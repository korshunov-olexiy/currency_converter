// список вариантов кодов валют
const my_cc_codes = {USD: ['$', 'US$'], GBP: ['£'], PLN: ['ZŁ'],
                    EUR: ['€'], JPY: ['¥'], CHF: ['Fr.', 'Fr'],
                    AUD: ['A$'], CAD: ['C$'], CNY: ['¥', '元'],
                    HKD: ['HK$'], INR: ['₹'], SGD: ['S$'],
                    RUB: ['руб', '₽'], BYN: ['Br'], KZT: ['₸']};

async function get_json(){
  return new Promise((resolve, reject) => {
    jQuery.getJSON('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', function(data){
      return resolve(data);
  }).fail(function(){
    reject(new Error('Failed to fetch JSON object'));
  });
});
}

async function main(){
  try { return await get_json(); } catch (error) { alert('Failed to fetch JSON object'); }
}

document.addEventListener('DOMContentLoaded', function(){

  var promise_obj = main();

  promise_obj.then(data => {
    data.forEach(element => {
      $('#select-currency').append($('<option>', {
        value: element.cc,
        text: element.cc + ' (' + element.txt + ')',
        'data-id': element.rate,
        'option-icon': 'images/flags/' + element.cc + '.png'
      }));
    });
  });

  function formatState (state) {
    if (!state.id) { return state.text; }
    var $state = $(
      '<span><img src="' + $(state.element).attr('option-icon') + '" class="img-flag" /> ' + state.text + '</span>'
      );
    return $state;
  };
  
  // создаем контрол "select2" плагина jquery select2.min.js выпадающего списка "select-currency"
  $("#select-currency").select2({
    templateResult: formatState
  });

  $('#convert-btn').bind('click', function(){
    // let val = $('#select-currency option:selected').attr('value');
    // let txt = $('#select-currency option:selected').text();
    let amount = $('#amount').val();
    let rate = $('#select-currency option:selected').attr('data-id');
    console.log(rate);
    $('#result-lbl').text((amount * rate).toFixed(2) + ' UAH');
  });

  function formatCurrencyOption (currency) {
    if (!currency.id) {
      return currency.text;
    }
    var $currency = $(
      '<span><img src="images/flags/' + currency.cc + '.png" class="img-flag" /> ' + currency.txt + '</span>'
    );
    return $currency;
  };

  // назначаем событие на отпускание мышки после выделения текста на странице
  document.addEventListener('mouseup', function(){

    var seltext = window.getSelection().toString();
    if (seltext.length <= 20){
      var i = 0;
      var amount = 0;
      seltext = seltext.trim().replaceAll(',', '.');
      // находим код валюты в выделенном тексте, если он там есть
      while ( isNaN(parseFloat(seltext.substr(seltext.length-i))) && i < seltext.length ){ i += 1; }
      i -= 1;
      currencyCode = seltext.substr(seltext.length-i).trim();
      if (!currencyCode) {
        currencyCode = '';
        amount = parseFloat(seltext.replaceAll(' ', ''));
      } else{
        amount = parseFloat(seltext.substr(0, seltext.length-i).replaceAll(' ', ''));
      };
      if (!isNaN(amount)){
        $('#amount').val(amount);
        // если нашли код валюты в выделенном тексте и этот код не 'UAH'
        if (currencyCode && (currencyCode != 'UAH')){
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
              if (assocArr[key].includes(currencyCode.toUpperCase())){
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

})
