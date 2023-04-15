document.addEventListener('DOMContentLoaded', function(){

  // створюємо функціонал для підказки на елементі checkbox
  $("#toggle-extension").mousemove(function (eventObject) {
    $toggle_tooltip = $(this).attr("data-tooltip");
    $("#tooltip_toggle").text($toggle_tooltip)
    .css({ "top" : eventObject.pageY + 5, "left" : eventObject.pageX + 5 }).show();
  }).mouseout(function () {
      $("#tooltip_toggle").hide().text("").css({ "top" : 0, "left" : 0 });
  });

  chrome.storage.local.get(['currencies'], data => {
    const currencies = Object.values(data['currencies']);

    currencies.forEach(element => {
      $('#select-currency').append($('<option>', {
        // додаємо лише перший єлемент массиву реквізиту 'cc'
        value: element.cc,
        text: element.cc[0] + ' (' + element.txt + ')',
        'data-id': element.rate
      }));
    });

    chrome.storage.local.get('selectedText', function(data) {
      /* шукаємо в атрибуті "value" випадаючого списку значення
         data.selectedText.code і якщо знаходимо, встановлюємо option:selected
      */
      $("#select-currency").find("option").filter(function() {
        return $(this).val().includes(data.selectedText.code);
      }).prop('selected', true);
      // встановлюємо суму в <input id='amount'>
      $('#amount').val(data.selectedText.amount);
    });

  });

  $('#convert-btn').bind('click', function(){
    let amount = $('#amount').val();
    let rate = $('#select-currency option:selected').attr('data-id');
    $('#result-lbl').text((amount * rate).toFixed(2) + ' UAH');
  });

  // встановлюємо стан прапорця в залежності від змінної "isEnabled"
  chrome.storage.local.get('isEnabled', function(toggleCheckbox) {
    $('#toggle-extension').prop('checked', toggleCheckbox.isEnabled);
  });

  /* Отримуємо елемент checkbox,
     та додаємо обробник подій на зміну його стану */
  $('#toggle-extension').on('change', function() {
    var isChecked = $(this).prop('checked');
    chrome.storage.local.set({'isEnabled': isChecked});
  });

});
