const fromCurrency = document.querySelector('.from-currency')
const toCurrency = document.querySelector('.to-currency')
const amount = document.querySelector('.amount')
const date = document.querySelector('.date')
const options = document.querySelectorAll('.options')
const optionsPara = document.querySelectorAll('.options p')



async function getSymbols() {
    const data = await fetch('https://api.exchangerate.host/symbols')
    const dataJson = await data.json()
    const symbols = await dataJson.symbols
    return symbols
}

getSymbols().then((data) => {
    const listSymbols = Object.values(data)
    const symbols = []
    listSymbols.forEach(function(symbol) {
        symbols.push(Object.values(symbol).join(', '))
    })
    console.log(symbols)
})



function fillInput() {
    this.parentElement.previousElementSibling.value = this.textContent
    this.parentElement.nextElementSibling.style.display = 'none'
}

function showOptions(element) {
    element.nextElementSibling.style.display = 'block'
}

function hideOptions() {
    setTimeout(() => {
        this.nextElementSibling.style.display = 'none'
    }, 100);

}

function emptyInput(element) {
    if (element.value == '') {
        element.parentElement.querySelectorAll('p.error')[0].style.display = 'block'
    } else {
        element.parentElement.querySelectorAll('p.error')[0].style.display = 'none'
    }
}




fromCurrency.addEventListener('focus', function() {
    showOptions(fromCurrency)
})
toCurrency.addEventListener('focus', function() {
    showOptions(toCurrency)
})

fromCurrency.addEventListener('blur', hideOptions)
toCurrency.addEventListener('blur', hideOptions)

fromCurrency.addEventListener('input', function() {
    emptyInput(fromCurrency)
})
toCurrency.addEventListener('input', function() {
    emptyInput(toCurrency)
})

amount.addEventListener('input', function() {
    emptyInput(amount)
})


optionsPara.forEach(function(para) {
    para.addEventListener('click', fillInput)
})