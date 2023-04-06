chrome.runtime.onNessage.addListener(
  function (request, sender, sendResponse) {
    if(request.message{
       chrome.storage.local.set({"selectedText": request.message));
}
  sendResponse(request);
}
);

