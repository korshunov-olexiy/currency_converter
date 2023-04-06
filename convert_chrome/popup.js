chrome.storage.local.get("selectedText", function(data) {
  $('#input_text').val(data.selected Text);
});

