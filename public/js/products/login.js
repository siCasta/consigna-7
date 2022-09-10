function $(query) {
    return document.querySelector(query)
}

const form = $('#login')

if (sessionStorage.getItem('user')) location.href = '/products/create'

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = {}
    const formData = new FormData(form)

    formData.forEach((value, key) => {
        data[key] = value
    })

    data.age = parseInt(data.age)
    data.id = data.email

    sessionStorage.setItem('user', JSON.stringify(data))

    location.href = '/products/create'
})