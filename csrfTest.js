const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('csrf', { csrfToken: req.csrfToken() });
});

app.post('/form', csrfProtection, (req, res) => {
    res.send('ok');
});