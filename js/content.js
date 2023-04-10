// функция AmountCode возвращает ассоциативный массив, состоящий из суммы (amount) и кода валюты (code)
function AmountCode(val1, val2) {
  const arr = {};
  if (val1.includes(",") && val1.includes('.')){
    arr.amount = val1.replaceAll(',', '');
  } else if (val1.includes(',') && !val1.includes('.')) {
    arr.amount = val1.replace(',', '.');
  } else { arr.amount = val1; }
    arr.code = val2.toUpperCase();
  return arr;
}

function StrToCurrency (t) {
  //regex для поиска суммы и кода валюты в строке
  const r = /([\d.,]+)([^\d]{0,})|([^\d]{0,})([\d.,]+)/;
  //предварительно убираем пробелы в строке и потом ищем соответствие выражению 'r'
  const match = t.replaceAll(' ', '').match(r);
  // если regex полностью не сработал или не найден код валюты вернуть NaN
  if (match === null || match [2] === '') { return NaN; }
  /*если первая группа match = undefined, возвращаем 4ю и 3ю группы,
  таким образом меняя местами найденную сумму и код валюты */
  if (match[1] === undefined) { return AmountCode(match[4], match[3]); }
  else { return AmountCode(match[1], match[2]); }
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
