chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "get_configuration") {
    sendResponse({configuration: localStorage});
  }
  else
    sendResponse({}); // snub them.
});
