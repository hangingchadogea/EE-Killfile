function whyIgnore(element, kill_regex) {
  if (element.id.substr(-1) != "9") {
    return false; // This is not a post row. They all have IDs ending in 9.
  }
  if (element.style.display == "none") {
    return false; // We're already ignoring it, leave well enough alone.
  }
  return element.innerHTML.match(kill_regex);
}

function actually_do_things(response){
  var kill_regex = response.kill_regex;
  if (kill_regex == undefined)
    kill_regex = "quote_author..(HAL McRae|Yun Taragoashi)";
   
  var el = document.getElementsByTagName("tr");
  for(var i=0;i<el.length;i++){
    var reason = whyIgnore(el[i], kill_regex);
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
      comment_author(post_row) + "</b> is hidden because it contains the " +
      "string \'" + reason[0] + "\'.</td></tr>";
  firstCell.appendChild(firstTable);
  ignoreBarElement.appendChild(firstCell);
  elementParent = post_row.parentNode;
  elementParent.insertBefore(ignoreBarElement, post_row);
}

function comment_author(comment_row) {
  var anchors = comment_row.getElementsByTagName("a");
  var author_link = anchors[0];
  return author_link.innerText;
}

chrome.extension.sendRequest({method: "get_kill_regex"}, actually_do_things);
