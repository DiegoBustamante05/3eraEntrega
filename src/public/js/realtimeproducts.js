const socket = io();

const formProducts = document.getElementById("form-products");
const formDelete = document.getElementById("delete-product");
const inputTitle = document.getElementById("form-title");
const inputDecription = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputStock = document.getElementById("form-stock");
const inputCode = document.getElementById("form-code");
const inputCategory = document.getElementById("form-category");
const inputId = document.getElementById("form-id");

socket.on("products", (data) => {
    console.log(data);
    productsContainer = document.getElementById("dynamic-product-list")
    productsContainer.innerHTML = ""
    data.productsList.forEach(p => {
        productsContainer.innerHTML += `
        <div class="col-md-4">
            <div class="card text-center m-5">
                <div class="card-body">
                    <h5 class="card-title">${p.title}</h5>
                    <p class="card-text">${p.description}</p>
                    <p class="card-text">$ ${p.price}</p>
                    <a href="#" class="btn btn-primary">Comprar</a>
                </div>
                <div class="card-footer text-muted">
                    <p>stock: ${p.stock}</p>
                </div>
            </div>
        </div>
        `
    });
})

socket.on("products-deleted", (data) => {
    console.log(data);
    productsContainer = document.getElementById("dynamic-product-list")
    productsContainer.innerHTML = ""
    data.productsListDeleted.forEach(p => {
        productsContainer.innerHTML += `
        <div class="col-md-4">
            <div class="card text-center m-5">
                <div class="card-body">
                    <h5 class="card-title">${p.title}</h5>
                    <p class="card-text">${p.description}</p>
                    <p class="card-text">$ ${p.price}</p>
                    <a href="#" class="btn btn-primary">Comprar</a>
                </div>
                <div class="card-footer text-muted">
                    <p>stock: ${p.stock}</p>
                </div>
            </div>
        </div>
        `
    });
})


formProducts.addEventListener("submit", (e)=> {
    e.preventDefault();
    const newProduct = {
        title: inputTitle.value,
        description: inputDecription.value,
        price: Number(inputPrice.value),
        stock: Number(inputStock.value),
        code: inputCode.value,
        category: inputCategory.value,
    };
    
    socket.emit("new-product", newProduct)
})

formDelete.addEventListener("submit", (e)=> {
    e.preventDefault();
    const id = Number(inputId.value);
    console.log("el id que queres eliminar es " + id);
    socket.emit("id-to-delete", id);
})