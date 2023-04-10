// Намагаємось знайди в переданому тексті 't' суму та код валюти, інакше - NaN
function StrToCurrency(t){
  const regex = /([a-zA-ZŁł$€£¥₽₴₸₺₹.ңҢ]+|[\d\s\,]+)\s*([a-zA-ZŁł$€£¥₽₴₸₺₹.ңҢ]+|[\d\s\,]+)$/
  const match = t.replace(/\n/g, '').replaceAll(',', '.').match(regex);
  var currencyArr = {};
  if (match) {
      currencyArr.amount = parseFloat(match[1].replaceAll(' ', '').trim());
      currencyArr.code = match[2].toUpperCase().trim();
      return currencyArr;
  } else{ return NaN; };
}


// призначаємо подію на відпускання миші після виділення текста на сторінці
document.addEventListener('mouseup', function(){

  var seltext = window.getSelection();
  if ( seltext.toString().length <= 20 && seltext.rangeCount > 0){
    var range = seltext.getRangeAt(0);
    seltext = seltext.toString();
    var paraAmountCode = StrToCurrency(seltext);
    chrome.storage.local.set({ selectedText: paraAmountCode });

    if (paraAmountCode.amount && paraAmountCode.code && paraAmountCode.code != 'ГРН.'){
      chrome.storage.local.get(['currencies'], function(data) {
        const currencies = Object.values(data['currencies']);
        /* Якщо в currencies є переданий код валюти (paraAmountCode.code)
        повернемо атрибут rate, якщо ні, повернемо 0 */
        const rate = currencies.find(rate => rate.cc.includes(paraAmountCode.code))?.rate || 0;
        var convertedText = (paraAmountCode.amount * rate).toFixed(2) + ' грн.';
        // Створюємо елемент-контейнер, який змінить виділений текст
        var newElement = document.createElement("span");
        newElement.style.color = "red"; // додаємо червоний колір тексту до span
        newElement.style.backgroundColor = "yellow"; // додаємо жовтий колір до span
        newElement.appendChild( document.createTextNode(convertedText) );
        // Змінюємо виділений текст на новий елемент за допомогою Range та Selection API
        range.deleteContents();
        range.insertNode(newElement);
      });
    }
  }

});
