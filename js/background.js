//  період оновлення даних в годинах
const updatePeriodHours = 8;

// свій список кодів валют, які можуть зустрітись в написанні
// (об'єднується з масивом `currencies`)
const my_cc_codes = {
    USD: ['$', 'US$'], GBP: ['£'], PLN: ['ZŁ'], EUR: ['€'],
    JPY: ['¥'], CHF: ['Fr.', 'Fr'], AUD: ['A$'], CAD: ['C$'],
    CNY: ['¥', '元'], HKD: ['HK$'], INR: ['₹'], SGD: ['S$'],
    RUB: ['руб', '₽'], BYN: ['Br'], KZT: ['₸']
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(['currencies'], function(data) {
        if (!data.currencies) {
            fetchCurrencies();
        } else {
            chrome.storage.local.get(['lastUpdated'], function(data){
                if (data.lastUpdated){
                    const savedDate = new Date(data.lastUpdated);
                    const currentDate = new Date();
                    // різниця в мілісекундах
                    const diffInMs = currentDate.getTime() - savedDate.getTime();
                    // перетворення в години
                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                    if (diffInHours >= updatePeriodHours) { fetchCurrencies(); }
                } else { fetchCurrencies(); }
            })
        }
    });
});

// отримуємо дані про поточні курси валют, дату перевірки, та зберігаємо результат в локальні змінні chrome
function fetchCurrencies() {
    const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
    fetch(url).then(response => response.json()).then(data => {
        // об'єднуємо масив my_cc_codes та отриманий data по значенню 'cc'
        const currencies = Object.values(data.reduce((acc, cur) => {
            if (my_cc_codes[cur.cc]) {
              cur.cc = [...new Set([...my_cc_codes[cur.cc], cur.cc])];
            } else {
                cur.cc = [cur.cc];
            }
            acc[cur.r030] = cur;
            return acc;
        }, {}));
        const currency_lastUpdated = new Date().toISOString();
        chrome.storage.local.set({ currencies });
        // створюємо змінну в chrome 'lastUpdated' - час оновлення даних
        chrome.storage.local.set({lastUpdated: currency_lastUpdated});
    });
}

setInterval(fetchCurrencies, 1000 * 60 * 60 * updatePeriodHours); // Встановлюємо оновлення даних кожні 8 годин
