import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./DAO/productManager.js";
import { routerProducts } from "./routes/products.router.js";
import { routerViewProducts } from "./routes/products.view.router.js";
import { routerViewCart } from "./routes/cart.view.router.js";
import { routerCarts } from "./routes/cart.router.js";
import { routerLogin } from "./routes/login.router.js";
import { routerViews } from "./routes/views.router.js";
import { __dirname, connectMongo } from "./utils.js";
import { Server } from "socket.io";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { iniPassport } from "./config/passport.config.js";
import passport from 'passport';
import { enviroment } from "./utils.js";


const app = express();
const port = enviroment.PORT;



connectMongo();

const productManager = new ProductManager();

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
const socketServer = new Server(httpServer)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(session({ secret: 'un-re-secreto', resave: true, saveUninitialized: true }));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://diegobustamante:coder2023@bustamantedb.2llatvf.mongodb.net/?retryWrites=true&w=majority',
            ttl: 86400*7
        }),
        secret: 'un-re-secreto',
        resave: true,
        saveUninitialized: true,
    })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use('/api/sessions', routerLogin);


app.use("/view/products", routerViewProducts)
app.use("/view/cart", routerViewCart)


app.use(express.static(__dirname + "/public"));

app.use("/", routerViews)

app.get("*", (req, res) => {
    res.status(404).send({
        status: "error",
        data: "Page not found",
    });
});

socketServer.on("connection", (socket) =>{
    console.log(`New Connection: ${socket.id}`);
    socket.on("new-product", async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            const productsList = await productManager.getProducts();
            socketServer.emit("products", { productsList });
        } catch (error){
            console.log(error);
        }
    });
    socket.on("id-to-delete", async (id) => {
        try {
            console.log("el id es " + id)
            await productManager.deleteProduct(id);
            const productsListDeleted = await productManager.getProducts();
            socketServer.emit("products-deleted", { productsListDeleted });
        } catch (error){
            console.log(error);
        }
    });
});







