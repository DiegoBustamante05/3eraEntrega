import { error } from 'console';
import fs from 'fs';


export class ProductManager {
    
    constructor () {
        this.products = [];
        this.path = "products.json"
        this.id = 0;
        const productsString = JSON.stringify(this.products)
        fs.writeFileSync(this.path, productsString)
    }
    async getProducts(){
        const productsBeta =  await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsBeta);
        console.log(this.products);
        return this.products;
    }
    async getProductById(id){
        const productsById = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsById);
        const found = this.products.find(prod => prod.id == id);
        if(found){
            console.log(found)
            return found;
        } else {
            throw new Error("Not found")
        }
    }
    async #getProductByCode(code){
        const productsByCode = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsByCode);
        const codeExist = this.products.find(prod => prod.code == code);
        if(codeExist){
            return true;
        } else {
            return false;
        }
    }
    async addProduct(newProduct) {
        const prodFs = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(prodFs)

        let title = newProduct.title;
        let description = newProduct.description;
        let price = newProduct.price;
        let thumbnail = newProduct.thumbnail;
        let code = newProduct.code;
        let stock = newProduct.stock;
        let category = newProduct.category;
        let status = newProduct.status;

        if(title === undefined || title === null || title === '' || description === undefined || description === null || description === '' || price === undefined || price === null || price === '' || code === undefined || code === null || code === '' || stock === undefined || stock === null || stock === '' || category === undefined || category === null || category === '') {
            throw new Error('Error, you must complete all fields');
        }else if (typeof title != "string" || typeof description != "string" || typeof code != "string" || typeof category != "string" ){         
            throw new Error("title, description, code, and category must be a string") 
        }else if (typeof price != "number" || typeof stock != "number" ){         
            throw new Error("price and stock must be a number")
        //}else if (typeof status != "boolean"){         
            //console.log("status must be a boolean")
            //return false;
        }else if(await this.#getProductByCode(code)){
            throw new Error("The code entered has already been used, please enter another") 
        }else {
            newProduct = {title, description, price, thumbnail, code, stock, category, status, id: this.id++};
            this.products.push(newProduct)
            const productsString = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, productsString)
            console.log(newProduct)
        }
    }
    
    async deleteProduct(id) {
        const fileProducts = await fs.promises.readFile(this.path, "utf-8");
        const fileProductsParse = JSON.parse(fileProducts);
    
        const positionProduct = fileProductsParse.findIndex(
        (prod) => prod.id == id
        );
    
        if (positionProduct == -1) {
            throw new Error("Product not found");
        } else {
            delete fileProductsParse[positionProduct];
            const productsDelete = fileProductsParse.filter(
            (prod) => prod !== undefined
        );
    
        const productsString = JSON.stringify(productsDelete);
        await fs.promises.writeFile(this.path, productsString);
        }
    }


    async updateProduct(id, productToUpdate) {
        const prodFs = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(prodFs)

        let title = productToUpdate.title;
        let description = productToUpdate.description;
        let price = productToUpdate.price;
        let thumbnail = productToUpdate.thumbnail;
        let code = productToUpdate.code;
        let stock = productToUpdate.stock;
        let category = productToUpdate.category;
        let status = productToUpdate.status;



        let found = this.products.find(p => p.id === id)
        if (found) {
            if(title === undefined || title === null || title === '' || description === undefined || description === null || description === '' || price === undefined || price === null || price === '' || stock === undefined || stock === null || stock === '') {
                throw new Error('Error, you must complete all fields');      
            }else if(await this.#getProductByCode(code)){
                throw new Error("The code entered has already been used, please enter another")
            }else {
            this.products[id] = Object.assign(found, {title, description, price, thumbnail, code, stock, category, status})
            const productsString = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, productsString)
            console.log("Updated product!")
            console.log(this.products)
            return(this.products)
            }
        } else {
            throw new Error("Product not found")
        }
    }
}


