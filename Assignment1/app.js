// 2023-04-24
// Lecture by Nabil
const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
// const mongoose = require('mongoose');
const usersModel = require('./models/w1users.js');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


app.use(session({
    secret: "The secret a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public.",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://vsctl95:MbabXSUUycA1FYOE@cluster1.ncanyuw.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        dbName: 'sessionStoreDB',
        collectionName: 'sessions',
        ttl: 60 * 60 * 24, // 1 day
        autoRemove: 'interval',
        autoRemoveInterval: 10 // In minutes. Default
    })
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

app.get(['/', '/home'], (req, res) => {
    console.log("\'\/\': Current session cookie:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        //redirect if user is already logged in
        res.redirect('/protectedRoute');
    }
    let homeHTML = `
        <h1>\'\/\' Home Page</h1>
        <h2>Welcome! Please login to continue.</h2>
        <form action="/login" method="GET">
        <input type="submit" value="Login" />
        </form>
        `
    res.send(`<code>app.get(\'/\')</code>: ${homeHTML}`);
})


app.get('/login', (req, res) => {
    console.log("\'\/login\': Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        //redirect if user is already logged in
        res.redirect('/protectedRoute');
    } else {
        res.send(`<code>app.get(\'\/login\')</code>
        <br />
        <img src="./mmdoor.gif" alt="GIF: Mickey Mouse trying to open door" />
        <h1> Login </h1>
        <form action="/login" method="POST">
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="submit" value="Login" />
        </form>
    `);
    }
})

app.get('/logout', function (req, res, next) {
    console.log("Before Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);
    console.log("Logging out. . .")
    req.session.loggedUsername = null;
    req.session.loggedPassword = null;
    req.session.GLOBAL_AUTHENTICATED = false;
    console.log("After Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);

    req.session.save(function (err) {
        if (err) next(err)
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/')
        })
    })
})

app.post('/login', async (req, res) => {
    const userresult = await usersModel.findOne({
        username: req.body.username
    });
    console.log(`Username entered: ${req.body.username}`)
    console.log(`Password entered: ${req.body.password}`)
    console.log(userresult)
    // if password is not null and the password matches the hashed password in the database
    if (userresult && bcrypt.compareSync(req.body.password, userresult.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = userresult.password;
        // res.send('<code>app.post(\'/login\')</code>: You are logged in');
        console.log("app.post(\'\/login\'): Current session cookie:", req.cookies)
        res.redirect('/protectedRoute');
    } else {
        let loginFailHTML = `
            <code>app.post(\'/login\')</code> 
            <br />
            <h3>Invalid username or password/h3>
            <br />
            <br />
            <input type="button" value="Try Again" onclick="window.history.back()" />
            <br />
            <a href="/">Home</a>
        `
        res.send(loginFailHTML);
        console.log("Current session cookie-id:", req.cookies)
    }



});


// only for authenticated users
const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        return res.status(401).json({ error: 'not authenticated' });
    }
    next();
};



app.use(['/protectedRoute', '/protectedRouteForAdminsOnly'], authenticatedOnly);
app.get('/protectedRoute', (req, res) => {
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.gif`;
    let protectedRouteHTML = `
        <code>app.get(\'\/protectedRoute\')</code>
        <h1>/protectedRoute</h1>
        <p>Login successful</p>
        <p>Welcome, ${req.session.loggedUsername}!</p>
        <img src="./${imageName}" alt="random welcome image" />
        <br />
        <br />
        <input type="button" value="Logout" onclick="window.location.href='/logout'" />
        `;
    console.log("\/protectedRoute: Current session cookie:", req.cookies)
    res.send(protectedRouteHTML);
});



const protectedRouteForAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    // if username and password are correct:
    const result = await usersModel.findOne({
        username: req.session.loggedUsername
    });
    console.log(`result type: ${typeof result}`);
    console.log('result of findOne(): ', result);
    // console.log(result);
    if (result?.type != 'administrator') {
        res.send('<h1> You are not an administrator! </h1>');
        // res.status(401).json({ error: 'not authenticated' });
    }
    next();
};


app.use('/protectedRouteForAdminsOnly', protectedRouteForAdminsOnlyMiddlewareFunction);
app.get('/protectedRouteForAdminsOnly', (req, res) => {
    console.log("Current session cookie:", req.cookies)
    return res.send(`<h1> protectedRouteForAdminsOnly </h1>
    <p>Welcome Administrator ${req.session.loggedUsername}</p>`);
});


app.use((req, res, next) => {
    let errorHTML = `
        <h1>404: Sorry can't find that!</h1>
        <input type="button" value="Back" onclick="window.history.back()" />`
    res.status(404).send(errorHTML)
})

module.exports = app;