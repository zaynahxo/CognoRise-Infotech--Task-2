const API_KEY = '58978ee18bcff6446cffafb8';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');
    const exchangeRateChart = document.getElementById('exchangeRateChart').getContext('2d');
    let chart;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.conversion_rates);
            currencies.forEach(currency => {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency;
                optionFrom.textContent = currency;
                fromCurrency.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = currency;
                optionTo.textContent = currency;
                toCurrency.appendChild(optionTo);
            });
        });

    convertBtn.addEventListener('click', () => {
        const amount = amountInput.value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (amount === '' || from === '' || to === '') {
            alert('Please fill in all fields.');
            return;
        }

        fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.conversion_rates[to];
                const convertedAmount = (amount * rate).toFixed(2);
                resultDiv.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
                updateChart(data.conversion_rates, from, to);
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                resultDiv.textContent = 'Error fetching exchange rates. Please try again later.';
            });
    });

    function updateChart(rates, from, to) {
        const labels = Object.keys(rates);
        const data = Object.values(rates);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(exchangeRateChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Exchange Rate (${from} to ${to})`,
                    data: data,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Currency'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Exchange Rate'
                        }
                    }
                }
            }
        });
    }
});
