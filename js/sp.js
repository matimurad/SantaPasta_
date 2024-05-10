const qty = {}
const buttons = {}
const menos = {}
const mas = {}
const pastasCarrito = {}

const carrito = document.querySelector(".carrito")
const imgCarrito = document.querySelector(".img-carrito")
const total = document.querySelector(".total")
const finalizar = document.querySelector(".item button")

const productsIndex = document.querySelector(".products-index")

function toggle() {
    if (!carrito.classList.contains("mostrar")) carrito.classList.add("mostrar")
    else carrito.classList.remove("mostrar")
}

imgCarrito.onclick = toggle

let url = "../js/api.json"
if (window.location.href.match(/SantaPasta_\/$/)) url = "./Santapasta_/js/api.json"

fetch(url).then(x=>x.json()).then(pastas => {
    function getStorage(id) {
        if (localStorage.getItem(id) != null) qty[id] = localStorage.getItem(id)
        else qty[id] = 0
    }
    
    function agregar(id) {
        if (qty[id] < pastas.find(pasta => pasta.id == id).stock) {
            qty[id]++
            localStorage.setItem(id, qty[id])
            update()
        } else {
            console.log(qty[id])
            Swal.fire({
                title: "Oops",
                text: "No hay mas stock",
                confirmButtonText: "Aceptar",
            })
        }
    }
    
    function restar(id) {
        if (qty[id]) qty[id]--
        localStorage.setItem(id, qty[id])
        update()
    }
    
    function update() {
        pastas.forEach(i => {
            if (qty[i.id] > 0) {
                pastasCarrito[i.id].querySelector(".qty").innerText = qty[i.id]
                pastasCarrito[i.id].querySelector(".precio").innerText = qty[i.id] * i.precio
                total.querySelector(".precio").innerText = pastas.reduce((x, y) => x + qty[y.id] * y.precio, 0)
                if (!carrito.contains(pastasCarrito[i.id])) carrito.insertBefore(pastasCarrito[i.id], total)
            } else if (carrito.contains(pastasCarrito[i.id])) carrito.removeChild(pastasCarrito[i.id])
        })
    }

    function index() {
        if (productsIndex) {
            pastas.forEach(i => {
                const div = document.createElement("div")
                div.innerHTML =
                `<h2>${i.id}</h2>
                <a href="../pages/allpasta.html?id=${i.id}">
                <img src="../img/${i.id}.png" alt="${i.id}"></a>
                <p>${i.shortdescription}</p>`

                productsIndex.appendChild(div)
            })
        }
    }

    function allpasta() {
        const id = window.location.search.slice(4)
        const pasta = pastas.find(pasta => id == pasta.id)

        if (pasta) {
            const h1 = document.createElement("h1")
            h1.innerText = id

            const div = document.createElement("div")
            div.className = "descripcion"
            div.innerHTML =
            `<img class="fotos" src="../img/${id}.png" alt="${id}">
            <p>${pasta.description}</p>`

            const button = document.createElement("button")
            button.className = `agregar agregar-${id}`
            button.innerText = "Agregar al carrito"

            const section = document.createElement("section")
            section.id = "products"

            document.querySelector("main").append(h1, div, button, section)

            const products = document.querySelector("#products")

            pastas.forEach(i => {
                if (i.id != id) {
                    const div = document.createElement("div")
                    div.innerHTML =
                    `<h2>${i.id}</h2>
                    <a href="../pages/allpasta.html?id=${i.id}">
                    <img src="../img/${i.id}.png" alt="${i.id}"></a>
                    <p>${i.shortdescription}</p>`

                    products.append(div)
                }
            })
        }
    }

    function widget() {
        pastas.forEach(i => {
            getStorage(i.id)
        
            buttons[i.id] = document.querySelector(`.agregar-${i.id}`)
            pastasCarrito[i.id] = document.createElement("div")
            pastasCarrito[i.id].className = "item"
            pastasCarrito[i.id].innerHTML = `<p>${i.id}</p><p class="menos">-</p><p class='qty'></p><p class="mas">+</p><p class='precio'></p>`
            mas[i.id] = pastasCarrito[i.id].querySelector(".mas")
            menos[i.id] = pastasCarrito[i.id].querySelector(".menos")
        
            if (buttons[i.id] != null) buttons[i.id].onclick = () => agregar(i.id)
            mas[i.id].onclick = () => agregar(i.id)
            menos[i.id].onclick = () => restar(i.id)
        })
    }

    index()
    allpasta()
    widget()
    update()

    finalizar.addEventListener("click", () => Swal.fire({
        title: "Finalizar compra",
        text: "¿Desea finalizar la compra?",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        showCancelButton: true
    }).then(() => Swal.fire({
        title: "Gracias por tu compra",
        text: "PD: No hay reembolso",
        confirmButtonText: "Aceptar",
    })).then(() => {
        localStorage.clear()
        window.location.href = "../index.html"
    })
)})