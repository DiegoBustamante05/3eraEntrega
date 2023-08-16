import express from 'express';
import passport from 'passport';
import {
    UserModel
} from '../DAO/models/users.model.js';
import UserDto from '../DAO/DTOs/user.Dto.js';
import { createHash, isValidPassword } from '../utils.js';
import { CartModel } from '../DAO/models/carts.model.js';
export const routerLogin = express.Router();



routerLogin.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister'
}), async (req, res) => {
    if (!req.user) {
        return res.json({
            error: 'something went wrong'
        });
    }

    try {
        // Crear un carrito asociado al usuario
        const newCart = new CartModel({
            products: [], 
        });

        // Asociar el carrito al usuario recién registrado
        req.user.cart = newCart._id;

        // Guardar el carrito y actualizar el usuario
        await Promise.all([newCart.save(), req.user.save()]);

        req.session.user = {
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role,
            cart: req.user.cart
        };

        return res.render('profile', {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            admin: req.user.admin
        });
    } catch (error) {
        console.error('Error al registrar usuario y carrito:', error);
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
});


routerLogin.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), async (req, res) => {
    if (!req.user) {
        return res.json({
            error: 'invalid credentials'
        });
    }
    req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        admin: req.user.admin
    };

    return res.redirect('/view/products');
});

routerLogin.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', {
                error: 'no se pudo cerrar su session'
            });
        }
        return res.redirect('/login');
    });
});

routerLogin.get('/current', async (req, res) => {
    if (!req.user) {
        return res.json({ error: "invalid credentials" });
    }
    const user = new UserDto(req.user)
    console.log(user)
    return res.json(user);
});


routerLogin.get('/github', passport.authenticate('github', { scope: ['user:email'] }))


routerLogin.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/error-auth' }), (req, res) => {

    req.session.user = req.user;
    res.redirect('/view/products');
});