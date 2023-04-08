chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(['currencies'], function(data) {
        if (!data.currencies) {
        fetchCurrencies();
        } else {
        const now = new Date();
        const lastUpdated = data.currencies.lastUpdated ? new Date(data.currencies.lastUpdated) : null;
        const diff = lastUpdated ? now - lastUpdated : Infinity;
        const hours = diff / 1000 / 60 / 60;
    
        if (hours >= 12) {
            fetchCurrencies();
        }
        }
    });

    // свой список кодов валют, которые могут встречаться в интернете
    const my_cc_codes = {
        USD: ['$', 'US$'], GBP: ['£'], PLN: ['ZŁ'], EUR: ['€'],
        JPY: ['¥'], CHF: ['Fr.', 'Fr'], AUD: ['A$'], CAD: ['C$'],
        CNY: ['¥', '元'], HKD: ['HK$'], INR: ['₹'], SGD: ['S$'],
        RUB: ['руб', '₽'], BYN: ['Br'], KZT: ['₸']
    };

    chrome.storage.local.get(['currencies'], function(data) {
        // проверяем, что data.currencies существует и что его свойство my_cc_codes отсутствует
        if (data.currencies && !data.currencies.my_cc_codes) {
          data.currencies.my_cc_codes = my_cc_codes;
          chrome.storage.local.set({ currencies: data.currencies });
        }
    });

});

function fetchCurrencies() {
const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

fetch(url)
    .then(response => response.json())
    .then(data => {
    const currencies = {
        my_cc_codes,
        exchange_rates: {},
        lastUpdated: new Date().toString()
    };

    for (let i = 0; i < data.length; i++) {
        const { cc, rate } = data[i];
        currencies.exchange_rates[cc] = rate;
    }

    chrome.storage.local.set({ currencies });
    });
}

setInterval(fetchCurrencies, 1000 * 60 * 60 * 12); // Обновление каждые 12 часов
