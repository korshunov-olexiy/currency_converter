document.addEventListener('DOMContentLoaded', function(){

  chrome.storage.local.get(['currencies'], data => {
    const currencies = Object.values(data['currencies']);
    currencies.forEach(element => {
      $('#select-currency').append($('<option>', {
        value: element.cc,
        text: element.cc + ' (' + element.txt + ')',
        'data-id': element.rate,
        'option-icon': 'images/flags/' + element.cc + '.png'
      }));
    });
  })

  $('#convert-btn').bind('click', function(){
    // let val = $('#select-currency option:selected').attr('value');
    // let txt = $('#select-currency option:selected').text();
    let amount = $('#amount').val();
    let rate = $('#select-currency option:selected').attr('data-id');
    $('#result-lbl').text((amount * rate).toFixed(2) + ' UAH');
  });

});
