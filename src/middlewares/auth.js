export function checkUser(req, res, next) {
    if (req.user.email) {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'please log in'
    });
}

export function checkAdmin(req, res, next) {
    if (req.user.email && req.user.admin == true) {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'please log in AS ADMIN!'
    });
}

export function checkUserLoggedIn(req, res, next) {
    if (!req.user.email) {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'You are already logged in'
    });
}