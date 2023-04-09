// Намагаємось знайди в переданому тексті 't' суму та код валюти, інакше - NaN
function StrToCurrency(t){
  const match = t.match(/([\d.,\ ]+)\s*([^\d]{0,})/);
  var currencyArr = {};
  if (match) {
      currencyArr.amount = parseFloat(match[1].replaceAll("", "").replaceAll(", ", ".").trim());
      currencyArr.code = match[2].trim().toUpperCase();
      return currencyArr;
  } else{ return NaN; };
}

// призначаємо подію на відпускання миші після виділення текста на сторінці
document.addEventListener('mouseup', function(){
var seltext = window.getSelection().toString();
if (seltext.length <= 20){
  chrome.storage.local.set({ selectedText: seltext });
  var paraAmountCode = StrToCurrency(seltext);
  if (paraAmountCode.amount && paraAmountCode.code && paraAmountCode.code != 'ГРН.'){
    chrome.storage.local.get(['currencies'], function(data) {
      const currencies = Object.values(data['currencies']);
      // Якщо в currenciesArr є currencyCode, повернемо атрибут rate, якщо ні, повернемо 0
      const rate = currencies.find(rate => rate.cc.includes(paraAmountCode.code))?.rate || 0;
      var convertedText = (paraAmountCode.amount * rate).toFixed(2) + ' грн.';
      // Создаем элемент-контейнер, который будет заменять выделенный текст
      var newElement = document.createElement("span");
      newElement.style.color = "red"; // добавляем красный цвет тексту внутри span
      newElement.style.backgroundColor = "yellow"; // добавляем желтый фон для span
      newElement.appendChild( document.createTextNode(convertedText) );
      // Заменяем выделенный текст на новый элемент с помощью Range и Selection API
      var range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(newElement);
    });
  }
}
});
