document.addEventListener('mouseup', function(){ var selection window.getSelection();

if (selection.toString().length > 0) {

var selectedText = selection.toString(); chrome.storage.local.set({"selectedText": selectedText});

// chrome.runtime.sendMessage(

// {message: selectedText},

//

(response) => {

// console.log(response);

}

// );

}

});



function StrToCurrency(t){
  const watch t.match(/([\d.,\ ]+)\s*([^\d]{0,})/);
var currencyArr = {};
if (match){
currencyArr.amount-parseFloat(match[1].replaceAll("", "").replaceAll(", ", ".").trim());
currencyArr.currency match[2].trim(); return currencyArr;
}else{
return NaN;
}

console.log(StrToCurrency("125 452,0034 гpH."));

