default_config = {"kill_regex": "this default string will match nothing I hope",
                  "autoignore": true,
                  "hide_images": true,
                  "hide_fully": false,
                  "hide_link_numbers": false}
chrome.storage.sync.get("configuration", chrome_configuration);

function whyIgnore(element, kill_regex, ignored_users, hide_images) {
  if (!row_is_forum_comment(element)){
    return false;
  }
  if (post_is_ignored_server_side(element)) {
    return false; // We're already ignoring it, leave well enough alone.
  }
  if (hide_images && post_has_inline_image(element))
    return "it embeds an inline image.";
  if (ignored_users.length > 0) {
    quote_match = element.innerHTML.match("quote_author.*(" +
                                          ignored_users.join("|") + ") - ");
    if (quote_match) {
      return "it quotes <b>" + quote_match[1] + "</b>";
    }
  }
  regex_match = element.innerHTML.match(kill_regex);
  if (regex_match) {
    return "it contains the string '" + regex_match[0] + "'";
  }
  return null;
}

function chrome_configuration(response){
  if (response && response.configuration) {
    var configuration = response.configuration;
    console.log("Using configuration from chrome.sync:")
    console.log(configuration);
    for (var key in default_config) {
      if (configuration[key] == undefined) {
        console.log(key + " was undefined, using default value.");
        configuration[key] = default_config[key];
      }
    }
  }
  else {
    console.log("Using default configuration.")
    var configuration = default_config;
  }
  run_killfile(configuration);
}

function run_killfile(configuration){
  var kill_regex = configuration.kill_regex;
  var hide_images = configuration.hide_images;
  var hide_fully = configuration.hide_fully;
  var hide_link_numbers = configuration.hide_link_numbers;
  if (configuration.autoignore) {
    ignoredUsers = determine_ignored_users();
  }
  else {
    ignoredUsers = [];
  }
  var el = document.getElementsByTagName("tr");
  for(var i=0;i<el.length;i++){
    if (hide_fully && row_is_ignore_bar(el[i])) {
      el[i].style.display = "none";
      continue;
    }
    var reason = whyIgnore(el[i], kill_regex, ignoredUsers, hide_images);
    if (reason) {
      set_post_ignored(el[i], reason, hide_fully);
      i = i+2;
    }
  }
  if (hide_link_numbers) {
    var a_tags = document.getElementsByTagName("a");
    for (var i=0; i < a_tags.length; i++) {
      if (a_tags[i].innerText.match("# [0-9]+")) {
        a_tags[i].innerText = "Link";
      }
    }
  }
}

function set_post_ignored(post_row, reason, hide_fully){
  post_row.style.display = "none";
  if (hide_fully && reason.substring(0, 9) == "it quotes") {
    return;
  }
  var ignoreBarElement = document.createElement('tr');
  var firstCell = document.createElement('td');
  firstCell.setAttribute("colspan", "3");
  firstTable = document.createElement('table');
  firstTable.setAttribute("class", "ignored");
  firstTable.setAttribute("style", "width:100%");
  firstTable.innerHTML = "<tr><td class=\"tableCellOne\"><span style=\"float:" +
      "right\"><a href=\"#\" onclick=\"showHideRow(\'" + post_row.id + "\');" +
      "return false;\">View / Hide</a></span>A post by <b>" +
      comment_author(post_row) + "</b> is hidden because " + reason +
      ".</td></tr>";
  firstCell.appendChild(firstTable);
  ignoreBarElement.appendChild(firstCell);
  elementParent = post_row.parentNode;
  elementParent.insertBefore(ignoreBarElement, post_row);
}

function comment_author(comment_row) {
  var hasInnerText =
      (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;
  var anchors = comment_row.getElementsByTagName("a");
  var author_link = undefined;
  for (var i=0;i<anchors.length;i++)
    if (anchors[i].href.match('/member(s)?(hip)?/'))
      author_link = anchors[i];
  if (hasInnerText) {
    return author_link.innerText;
  }
  else { // some schmuck is still using Firefox!
    return author_link.textContent;
  }
}

function row_is_forum_comment(row) {
  // Comments are rows with IDs ending in 9. I don't know why.
  return row.id.substr(-1) == "9";
}

function row_is_ignore_bar(row) {
  tables = row.getElementsByTagName("table");
  return tables.length > 0 && tables[0].getAttribute("class") == "ignored";
}

function post_is_ignored_server_side(row) {
  return row.style.display == "none";
}

function post_has_inline_image(row) {
  return row.innerHTML.match(
      "img src=.(?!http://www.baseballthinkfactory.org)");
}

function determine_ignored_users() {
  var ignoredUsers = new Array();
  var allRows = document.getElementsByTagName("tr");
  for(var i=0;i<allRows.length;i++){
    currentRow = allRows[i];
    if (row_is_forum_comment(currentRow)) {
      author = comment_author(currentRow).replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      author = author.replace(/[\s\\]+$/g,'');
      if (post_is_ignored_server_side(currentRow)) {
        if (ignoredUsers.indexOf(author) == -1) {
          ignoredUsers.push(author);
        }
      }
      else { // The post is NOT ignored on the server side.
        author_index = ignoredUsers.indexOf(author);
        if (author_index != -1) {
          ignoredUsers.splice(author_index, 1);
        }
      }
    }
  }
  return ignoredUsers;
}
