
const inputTitle = document.getElementById("title");
const inputDecription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCode = document.getElementById("code");
const inputCategory = document.getElementById("category");
const inputStatus = document.getElementById("status");
const inputId = document.getElementById("id");

const inputTitleUpdate = document.getElementById("titleUpdate");
const inputDecriptionUpdate = document.getElementById("descriptionUpdate");
const inputPriceUpdate = document.getElementById("priceUpdate");
const inputStockUpdate = document.getElementById("stockUpdate");
const inputCodeUpdate = document.getElementById("codeUpdate");
const inputCategoryUpdate = document.getElementById("categoryUpdate");
const inputStatusUpdate = document.getElementById("statusUpdate");
const inputIdUpdate = document.getElementById("idUpdate");

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const newProduct = {
            title: inputTitle.value,
            description: inputDecription.value,
            price: Number(inputPrice.value),
            stock: Number(inputStock.value),
            code: inputCode.value,
            category: inputCategory.value,
            status: inputStatus.value,
        };

        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
        } catch (error) {
            res.json('Error: ', error);
        }
    });
});


document.getElementById("delete-product").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const id = inputIdUpdate.value

    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.log("Error: ", error);
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const id = inputIdUpdate.value

        console.log(id, inputCategoryUpdate, inputCodeUpdate, inputTitleUpdate.value, inputDecriptionUpdate.value, inputStockUpdate.value,inputStatusUpdate.value )

        const newProduct = {
            title: inputTitleUpdate.value,
            description: inputDecriptionUpdate.value,
            price: Number(inputPriceUpdate.value),
            stock: Number(inputStockUpdate.value),
            code: inputCodeUpdate.value,
            category: inputCategoryUpdate.value,
            status: inputStatusUpdate.value,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
        } catch (error) {
            res.json('Error: ', error);
        }
    });
});