const pastas = ["mezzelunes", "fagotinis", "raviolones", "agnolotis"]
const precios = {"mezzelunes": 1000, "fagotinis": 2000, "raviolones": 3000, "agnolotis": 4000}
const qty = {}
const buttons = {}
const menos = {}
const mas = {}
const pastasCarrito = {}

function getStorage(id) {
    if (localStorage.getItem(id) != null) qty[id] = localStorage.getItem(id)
    else qty[id] = 0
}

function agregar(id) {
    qty[id]++
    localStorage.setItem(id, qty[id])
    update()
}

function restar(id) {
    if (qty[id]) qty[id]--
    localStorage.setItem(id, qty[id])
    update()
}

function update() {
    for (let i of pastas) {
        if (qty[i] > 0) {
            pastasCarrito[i].querySelector(".qty").innerText = qty[i]
            pastasCarrito[i].querySelector(".precio").innerText = qty[i] * precios[i]
            if (!carrito.contains(pastasCarrito[i])) carrito.appendChild(pastasCarrito[i])
        }
        else if (carrito.contains(pastasCarrito[i])) carrito.removeChild(pastasCarrito[i])
    }
}

function toggle() {
    if (!carrito.classList.contains("mostrar")) carrito.classList.add("mostrar")
    else carrito.classList.remove("mostrar")
}

const carrito = document.querySelector(".carrito")

const imgCarrito = document.querySelector(".img-carrito")
imgCarrito.onclick = toggle


for (let i of pastas) {
    getStorage(i)

    buttons[i] = document.querySelector(`.agregar-${i}`)
    pastasCarrito[i] = document.createElement("div")
    pastasCarrito[i].className = "item"
    pastasCarrito[i].innerHTML = `<p>${i}</p><p class="menos">-</p><p class='qty'></p><p class="mas">+</p><p class='precio'></p>`
    mas[i] = pastasCarrito[i].querySelector(".mas")
    menos[i] = pastasCarrito[i].querySelector(".menos")

    if (buttons[i] != null) buttons[i].onclick = () => agregar(i)
    mas[i].onclick = () => agregar(i)
    menos[i].onclick = () => restar(i)
}

update()