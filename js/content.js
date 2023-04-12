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
  
  // delete it
  console.log(match);
  
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
  if ( seltext.toString().length <= 20){
    // Разрешаем редактирование страницы
    document.designMode = "on";
    // Получаем диапазон выделения
    var range = seltext.getRangeAt(0);
    // Создаем фрагмент документа для изменения размера шрифта
    var fontFragment = document.createElement('font');
    fontFragment.setAttribute('size', '2');
    // Оборачиваем выделенный диапазон в фрагмент документа
    fontFragment.appendChild(range.extractContents());
    range.insertNode(fontFragment);
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
        // Создаем элемент span для выделенного текста и добавленного вами текста
        var selectedSpan = document.createElement("span");
        selectedSpan.style.color = "gray";
        selectedSpan.style.backgroundColor = "yellow";
        selectedSpan.textContent = seltext;

        var mySpan = document.createElement("span");
        mySpan.style.color = "blue";
        mySpan.style.backgroundColor = "#FFFFE0";
        mySpan.textContent = convertedText;

        // Создаем пустой элемент span и добавляем его в элемент div
        var spacerSpan = document.createElement("span");
        spacerSpan.innerHTML = "<br>"; // добавляем перевод строки

        // Создаем элемент div для обертывания элементов span
        var wrapperDiv = document.createElement("div");
        // Добавляем элементы span в элемент div
        wrapperDiv.appendChild(selectedSpan).appendChild(spacerSpan).appendChild(mySpan);

        // Устанавливаем HTML-содержимое для выделения
        range.deleteContents();
        range.insertNode(wrapperDiv);
      });
    }
  }

});
