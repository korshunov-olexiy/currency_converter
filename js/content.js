// функція AmountCode повертає асоціативний масив, що складається з суми (amount) та кода валюти (code)
function AmountCode(val1, val2) {
  const arr = {};
  if (val1.includes(",") && val1.includes('.')){
    arr.amount = val1.replaceAll(',', '');
  } else if (val1.includes(',') && !val1.includes('.')) {
    arr.amount = val1.replace(',', '.');
  } else { arr.amount = val1; }
    arr.code = val2.trim().toUpperCase();
  return arr;
}

function StrToCurrency (currencyStr) {
  //regex для пошуку суми та кода валюти в рядку
  const pattern = /([\d.,]+)([^\d]{0,})|([^\d]{0,})([\d.,]+)/;
  // Перед пошуком відповідності патерну видаляємо пробіли
  const match = currencyStr.replace(/\s+/, '').match(pattern);

  // Якщо regex повністю не спрацював або не знайдений код валюти - повернути NaN
  if (match === null || match [2] === '') { return NaN; }
  /* Якщо перша група match = undefined, повертаємо 4-у та 3-у групи,
  таким чином міняємо місцями знайдену суму та код валюти */
  if (match[1] === undefined) { return AmountCode(match[4], match[3]); }
  else { return AmountCode(match[1], match[2]); }
}

// призначаємо подію на відпускання миші після виділення текста на сторінці
document.addEventListener('mouseup', function(){

  chrome.storage.local.get('isEnabled', function(toggleCheckbox) {
    // якщо дозволена робота плагина, продовжуємо
    if (toggleCheckbox.isEnabled) {
      var seltext = window.getSelection().toString();
      if ( seltext.length <= 20){
        var paraAmountCode = StrToCurrency(seltext);
        chrome.storage.local.set({ selectedText: paraAmountCode });
        if (paraAmountCode.amount && paraAmountCode.code && paraAmountCode.code != 'ГРН.'){
          chrome.storage.local.get(['currencies'], function(data) {
            const currencies = Object.values(data['currencies']);
            /* Якщо в currencies є переданий код валюти (paraAmountCode.code)
            повертаємо атрибут rate, якщо ні, повертаємо 0 */
            const rate = currencies.find(rate => rate.cc.includes(paraAmountCode.code))?.rate || 0;
            if (rate != 0){
              var convertedText = (paraAmountCode.amount * rate).toFixed(2) + ' грн.';
              alert(convertedText);
            }
          });
        }
      }
    }
  });

});
