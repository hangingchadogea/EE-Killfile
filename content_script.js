function whyIgnore(element, kill_regex) {
//  return (element.id == "c9");
  if (element.id.substr(-1) != "9") {
    return false; // This is not a post row. They all have IDs ending in 9.
  }
  if (element.style.display == "none") {
    return false; // We're already ignoring it, leave well enough alone.
  }
  return element.innerHTML.match(kill_regex);
}

function trim(str) {
  var newstr;
  newstr = str.replace(/^\s*/, "").replace(/\s*$/, ""); 
  newstr = newstr.replace(/\s{2,}/, " "); 
  return newstr;
} 

function after_send_request(response){
  var kill_regex = response.kill_regex;
  if (kill_regex == undefined)
    kill_regex = "quote_author..(HAL McRae|Yun Taragoashi)";
   
  var el = document.getElementsByTagName("tr");
  for(var i=0;i<el.length;i++){
    var reason = whyIgnore(el[i], kill_regex);
    if (reason) {
      el[i].style.display = "none";
      var ignoreBarElement = document.createElement('tr');
      var firstCell = document.createElement('td');
      firstCell.setAttribute("colspan", "3");
      firstTable = document.createElement('table');
      firstTable.setAttribute("class", "ignored");
      
      firstTable.setAttribute("style", "width:100%");
      firstTable.innerHTML = "<tr><td class=\"tableCellOne\"><span style=\"float:right\"><a href=\"#\" onclick=\"showHideRow(\'" + el[i].id + "\');return false;\">View / Hide</a></span>A post is hidden because it contains the string \'" + reason[0] + "\'.</td></tr>"
      firstCell.appendChild(firstTable);
      ignoreBarElement.appendChild(firstCell);
      elementParent = el[i].parentNode;
      elementParent.insertBefore(ignoreBarElement, el[i]);
      i = i+2;
    }
  }
}

chrome.extension.sendRequest({method: "get_kill_regex"}, after_send_request);
