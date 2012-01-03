configuration = new Array();
configuration.configuration = new Array();
// EDIT THESE NEXT TWO LINES!!!!!!!!!!
configuration.configuration['kill_regex'] = "quote_author=.Yun Taragoashi";
configuration.configuration['autoignore'] = "true";
window.addEventListener('load', actually_do_things(configuration), true);

// The rest of this file is automatically generated by chrome_to_greasemonkey.sh
// and you probably don't want to edit it except for debugging. Edit the
// code in content_script.js and then run chrome_to_greasemonkey.sh again.
// Thanks to Joe Mauer Power Hour for leading the way.

function whyIgnore(element, kill_regex, ignored_users) {
  if (!row_is_forum_comment(element)){
    return false;
  }
  if (post_is_ignored_server_side(element)) {
    return false; // We're already ignoring it, leave well enough alone.
  }
  if (ignored_users.length > 0) {
    quote_match = element.innerHTML.match("quote_author..(" +
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

function actually_do_things(response){
  var kill_regex = response.configuration.kill_regex;
  if (kill_regex == undefined)
    kill_regex = "quote_author..(HAL McRae|Yun Taragoashi)";
  if (response.configuration.autoignore != "false") {
    ignoredUsers = determine_ignored_users();
  }
  else {
    ignoredUsers = [];
  }
  var el = document.getElementsByTagName("tr");
  for(var i=0;i<el.length;i++){
    var reason = whyIgnore(el[i], kill_regex, ignoredUsers);
    if (reason) {
      set_post_ignored(el[i], reason);
      i = i+2;
    }
  }
}

function set_post_ignored(post_row, reason){
  post_row.style.display = "none";
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
  var author_link = anchors[0];
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

function post_is_ignored_server_side(row) {
  return row.style.display == "none";
}

function determine_ignored_users() {
  var ignoredUsers = new Array();
  var allRows = document.getElementsByTagName("tr");
  for(var i=0;i<allRows.length;i++){
    currentRow = allRows[i];
    if (row_is_forum_comment(currentRow)) {
      author = comment_author(currentRow);
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