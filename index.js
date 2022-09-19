const fromCurrency = document.querySelector('.from-currency')
const toCurrency = document.querySelector('.to-currency')
const amount = document.querySelector('.amount')
const dateInput = document.querySelector('.date')
const errorMsg = document.querySelectorAll('p.error')
const form = document.querySelector('form')
const result = document.querySelector('p.result')
let amountFieldIsValid = true
let dateFieldIsValid = true


async function getSymbols() {
    const symbolsList = []
    const response = await fetch('https://api.exchangerate.host/symbols')
    const data = await response.json()
    const symbolsVal = Object.values(data.symbols)
    symbolsVal.forEach(function(symbols) {
        symbolsList.push(`<option value='${symbols.code}'>${symbols.code}, ${symbols.description}</option>`)
    })
    return symbolsList.join('')
}

getSymbols().then(data => {
    toCurrency.innerHTML = data
    fromCurrency.innerHTML = data
})

function hideError(errorList) {
    errorList.forEach(function(msg) {
        msg.style.display = 'none'
    })
}

function validateAmount() {
    amountFieldIsValid = true
    hideError([amount.nextElementSibling, amount.nextElementSibling.nextElementSibling])
    if (amount.value === '') {
        amountFieldIsValid = false
        amount.nextElementSibling.style.display = 'block'
    } else if (parseInt(amount.value) < 0) {
        amountFieldIsValid = false
        amount.nextElementSibling.nextElementSibling.style.display = 'block'
    }
}

function validateDate() {
    const value = dateInput.value
    if (!value) return
    dateFieldIsValid = true
    const date = new Date()
    hideError([dateInput.nextElementSibling])
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!value.match(regex)) {
        dateFieldIsValid = false
        dateInput.nextElementSibling.style.display = 'block'
    } else if (parseInt(value.slice(0, 4)) > date.getFullYear() || parseInt(value.slice(5, 7)) > date.getMonth() + 1 || parseInt(value.slice(8, 10)) > date.getDate()) {
        dateFieldIsValid = false
        dateInput.nextElementSibling.style.display = 'block'
    }
}

function formatDate(date) {
    return date.toString().length === 1 ? '0' + date : date
}

form.addEventListener('submit', function(e) {
    e.preventDefault()
    validateAmount()
    validateDate()
    if (amountFieldIsValid && dateFieldIsValid) {
        const dateObj = new Date()
        const fromCurrencyValue = fromCurrency.value || fromCurrency.children[0].attributes.value.value
        const toCurrencyValue = toCurrency.value || toCurrency.children[0].attributes.value.value
        const amountValue = amount.value
        const dateValue = dateInput.value || `${dateObj.getFullYear()}-${formatDate(dateObj.getMonth() + 1)}-${formatDate(dateObj.getDate())}`
        async function fetchRate() {
            const response = await fetch('https://api.exchangerate.host/' + dateValue)
            const data = response.json()
            return data
        }
        fetchRate().then(data => {
            const fromRate = data.rates[fromCurrencyValue]
            const toRate = data.rates[toCurrencyValue]
            result.innerHTML = `${amountValue} ${fromCurrencyValue} ==>  ${((toRate / fromRate) * amountValue).toFixed(2)} ${toCurrencyValue}`
        })
    }
})