import express from 'express';
import passport from 'passport';
import {
    UserModel
} from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';
export const routerLogin = express.Router();

//Login & Register without passport
/*routerLogin.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        age,
        email,
        password
    } = req.body;
    if (!firstName || !lastName || !age || !email || !password) {
        return res.status(400).render('error-page', {
            msg: 'please complete all fields'
        });
    }
    try {
        await UserModel.create({
            firstName,
            lastName,
            age,
            email,
            password: createHash(password),
            admin: false
        });
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        req.session.age = age;
        req.session.email = email;
        req.session.admin = false;
        return res.redirect('/profile');
    } catch (e) {
        console.log(e);
        return res.status(400).render('error-page', {
            msg: 'please check your email and try again later'
        });
    }
});


routerLogin.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    console.log(email, password)
    if (!email || !password) {
        return res.status(400).render('error-page', {
            msg: 'the username or password does not exist'
        });
    }
    try {
        const foundUser = await UserModel.findOne({
            email
        });
        if (foundUser && isValidPassword(password, foundUser.password)) {
            req.session.firstName = foundUser.firstName;
            req.session.lastName = foundUser.lastName;
            req.session.age = foundUser.age
            req.session.email = foundUser.email;
            req.session.admin = foundUser.admin;
            return res.redirect('/view/products');
        } else {
            return res.status(401).render('error-page', {
                msg: 'the username or password is incorrect, please try again'
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).render('error-page', {
            msg: 'unexpected server error'
        });
    }
});
*/

routerLogin.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister'
}), (req, res) => {
    if (!req.user) {
        return res.json({
            error: 'something went wrong'
        });
    }
    req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        admin: req.user.admin
    };

    return res.render('profile', {firstName: req.user.firstName, lastName: req.user.lastName, admin: req.user.admin} );
});

routerLogin.get('/failregister', async (req, res) => {
    return res.json({
        error: 'fail to register'
    });
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


routerLogin.get('/github', passport.authenticate('github', { scope: ['user:email'] }))


routerLogin.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/error-auth' }), (req, res) => {

    req.session.user = req.user;
    res.redirect('/view/products');
});