function $(query) {
    return document.querySelector(query)
}

const socket = io()
const user = sessionStorage.getItem('user')
const inputDefaultURL = $('#thumbnail')
const logout = $('#logout')
const login = $('#login')

logout.addEventListener('click', () => {
    if (user) sessionStorage.removeItem('user')
    location.href = '/products/create'
})

inputDefaultURL.placeholder = 'Loading...'
inputDefaultURL.disabled = true

fetch('https://picsum.photos/1000').then(response => {
    inputDefaultURL.value = response.url
    inputDefaultURL.disabled = false
})

const form = $('#form')

if (!!user) {
    socket.emit('connected')
    login.style.display = 'none'
}

form.addEventListener('submit', async e => {
    e.preventDefault()

    const data = {}
    const formData = new FormData(form)

    formData.forEach((value, key) => {
        data[key] = value
    })

    data.price = parseInt(data.price)

    const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const data = await response.json()

        inputDefaultURL.placeholder = 'Loading...'
        inputDefaultURL.disabled = true

        fetch('https://picsum.photos/1000').then(response => {
            inputDefaultURL.value = response.url
            inputDefaultURL.disabled = false
        })

        e.target.reset()

        if (!!user) socket.emit('create', true)

        Swal.fire({
            title: 'Producto creado',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })

    } else {
        const error = await response.json()

        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    }
})

socket.on('products', data => {
    const table = $('#products')
    if (data <= 0) {
        table.innerHTML = '<tr><td colspan="4">No hay productos</td></tr>'
    } else {
        let products = ''
        data.forEach(product => {
            products += `<tr>
                <td class="align-middle">${product.title}</td>
                <td class="align-middle">${product.price}</td>
                <td class="align-middle">
                    <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid rounded-4" width="200">
                </td>
            </tr>`
        })
        table.innerHTML = products
    }
})

socket.on('created', data => {
    Toastify({
        text: data,
        duration: 3000,
        stopOnFocus: true,
        gravity: 'top',
        close: true,
    }).showToast()
})

const chatinput = $('#chatinput')

chatinput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (!user) {
            Swal.fire({
                title: 'Error',
                text: 'Ingresa para usar el chat',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        } else if (chatinput.value.trim().length > 0) {
            fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    author: JSON.parse(user),
                    message: chatinput.value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            socket.emit('message', true)

            chatinput.value = ''
        }
    }
})

socket.on('log', data => {
    const chat = $('#chat')
    const chattext = $('#chattext')
    const datalog = data.data.messages
    const per = data.percentage

    chattext.innerHTML = `Chat (${Math.floor(per)}%)`

    let messages = ''
    for (const key in datalog) {
        messages += `<div class="text-light">
            <span class="${datalog[key].author !== JSON.parse(user).email ? 'text-primary' : 'text-warning'}"><strong>${datalog[key].author}</strong></span>
            <span class="text-secondary">[${new Date(datalog[key].createdAt).toLocaleDateString()} ${new Date(datalog[key].createdAt).toLocaleTimeString()}]</span>
            <span class="text-light">: ${datalog[key].message}</span>
        </div>`
    }

    chat.innerHTML = messages
    chat.scrollTop = chat.scrollHeight + 100
})