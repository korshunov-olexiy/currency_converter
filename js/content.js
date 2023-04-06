function StrToCurrency(t){
    const match = t.match(/([\d.,\ ]+)\s*([^\d]{0,})/);
    var currencyArr = {};
    if (match) {
        currencyArr.amount = parseFloat(match[1].replaceAll("", "").replaceAll(", ", ".").trim());
        currencyArr.code = match[2].trim().toUpperCase();
        return currencyArr;
    } else{ return NaN; };
}

    // назначаем событие на отпускание мышки после выделения текста на странице
  document.addEventListener('mouseup', function(){

    var seltext = window.getSelection().toString();
    if (seltext.length <= 20){
      var currencyArr = StrToCurrency(seltext);
      if (currencyArr.code){
        $('#amount').val(currencyArr.amount);
        // если нашли код валюты в выделенном тексте и этот код не 'UAH'
        if (currencyArr.code && (currencyArr.code != 'UAH')){
          // ассоциативный массив для всех возможных кодов валют
          var assocArr = {};
          // выбираем из json-объекта ключи 'cc', которые соответствуют коду валюты
          promise_obj.then(data => {
            var cc_values = data.map(element => element.cc);
            cc_values.forEach(currency => {
              // если данный код валюты присутствует в ключах my_cc_codes
              if (my_cc_codes[currency]){
                assocArr[currency] = [currency].concat(my_cc_codes[currency]);
              }
            });
            // если код валюты выделенной строки присутствует в выпадающем списке, то его и выбрать
            for (const key in assocArr){
              if (assocArr[key].includes(currencyArr.code)){
                // устанавливаем значение в выпадающем списке равным найденому коду валюты
                $('#select-currency option[value="'+key+'"]').prop('selected', true);
                break;
              };
            };
            var rate = $('#select-currency option:selected').attr('data-id');
            var convertedText = ($('#amount').val() * rate).toFixed(2) + ' UAH';
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
      };
    };

  })