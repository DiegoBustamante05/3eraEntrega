export function checkUser(req, res, next) {
    if (req.user != undefined && req.user.email ) {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'Please log in'
    });
}

export function checkAdmin(req, res, next) {
    if (req.user != undefined && req.user.role === 'admin')  {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'Please log in AS ADMIN!'
    });
}

export function checkUserLoggedIn(req, res, next) {
    if (!req.user) {
        return next();
    }else
    return res.status(401).render('error-page', {
        msg: 'You are already logged in'
    });
}

export function checkUserRole(req, res, next) {
    if (req.user != undefined && req.user.role === 'user') {
        return next();
    }
    return res.status(401).render('error-page', {
        msg: 'only users can send messages.'
    });
}

