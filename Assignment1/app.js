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
app.use(express.static(__dirname + "/public"));


app.get(['/', '/home'], (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        //redirect if user is already logged in
        res.redirect('/protectedRoute');
    } else {
        console.log("\'\/\', \'\/home\': Current session cookie:", req.cookies)

        let homeHTML = `
        <code>app.get(\'/\', \'\/home\')</code>
        <h1>Landing Page</h1>
        <img src="5m5h.gif" alt="GIF: Chilling at a bar scene - night" style="width: 50vh;" />
        <h2>Welcome! Please login to continue.</h2>
        <form action="/createUser" method="GET">
        <input type="submit" value="Register" />
        </form>
        <form action="/login" method="GET">
        <input type="submit" value="Login" />
        </form>
        `
        res.send(homeHTML);
    }
})

app.get('/createUser', (req, res) => {
    console.log("app.get(\'\/createUser\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        //redirect if user is already logged in
        res.redirect('/protectedRoute');
    } else {
        let createUserHTML = `
        <code>app.get(\'\/createUser\')</code>
        <br />
        <img src="/mmdoor.gif" alt="GIF: Mickey Mouse trying to open door" />
        <h1> Create User </h1>
        <form action="/createUser" method="POST">
        <label for="username">Username</label>
        <input type="text" name="username" placeholder="username" />
        <br />
        <br />
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="password" />
        <br />
        <br />
        <input type="submit" value="Create User" />
        </form>
        `
        res.send(createUserHTML);
    }
})

app.post('/createUser', async (req, res) => {
    const userresult = await usersModel.findOne({
        username: req.body.username
    })
    if (userresult) {
        let createUserFailHTML = `
            <code>app.post(\'/createUser\')</code>
            <br />
            <h3>Error: User already exists - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/createUser'" />
            `
        res.send(createUserFailHTML)
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new usersModel({
            username: req.body.username,
            password: hashedPassword
        })
        await newUser.save();
        console.log(`New user created: ${newUser}`);
        res.redirect('/login');
    }
})




app.get('/login', (req, res) => {
    console.log("app.get(\'\/login\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        //redirect if user is already logged in
        res.redirect('/protectedRoute');
    } else {
        let loginHTML = `
            <code>app.get(\'\/login\')</code>
            <br />
            <img src="/mmdoor.gif" alt="GIF: Mickey Mouse trying to open door" />
            <h1> Login </h1>
            <form action="/login" method="POST">
            <input type="text" name="username" placeholder="username" />
            <input type="password" name="password" placeholder="password" />
            <input type="submit" value="Login" />
            </form>
            `
        res.send(loginHTML);
    }
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
        console.log("app.post(\'\/login\'): Current session cookie-id:", req.cookies)
        res.send(loginFailHTML);
    }
});

app.get('/logout', function (req, res, next) {
    console.log("Before Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);
    console.log("Logging out. . .")
    req.session.loggedUsername = null;
    req.session.loggedPassword = null;
    req.session.GLOBAL_AUTHENTICATED = false;
    console.log("After Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
})

// only for authenticated users
const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        return res.status(401).json({ error: 'not authenticated' });
    }
    next();
};


// app.use(['/protectedRoute', '/protectedRouteForAdminsOnly'], authenticatedOnly);
app.use('/protectedRoute', authenticatedOnly);
app.get('/protectedRoute', async (req, res) => {
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.gif`;
    let checkUserType = await usersModel.findOne({
        username: req.session.loggedUsername
    });

    if (checkUserType?.type == 'administrator') {
        var checkAdminA = `<input type="button" value="Admin Page" onclick="window.location.href='/protectedRouteForAdminsOnly'" />`
    } else {
        var checkAdminA = ``
    }

    let protectedRouteHTML = `
        <code>app.get(\'\/protectedRoute\')</code>
        <h1>Home Page - Logged In</h1>
        <p>Welcome, <strong>${req.session.loggedUsername}</strong>! ${checkAdminA}</p>
        <img src="/${imageName}" alt="random welcome image" />
        <br />
        <br />
        <input type="button" value="Logout" onclick="window.location.href='/logout'" />
        `;
    console.log("app.get\'\/protectedRoute\': Current session cookie:", req.cookies)
    res.send(protectedRouteHTML);
});


const protectedRouteForAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    // if username and password are correct:
    const result = await usersModel.findOne({
        username: req.session.loggedUsername
    });
    console.log('User info from findOne(): ', result);
    // console.log(result);
    if (result?.type != 'administrator') {
        let nonAdminHTML = `
            <code>app.use(\'/protectedRouteForAdminsOnly\', protectedRouteForAdminsOnlyMiddlewareFunction)</code>
            <h1>Sorry, you are not an administrator.</h1>
            <br />
            <input type="button" value="Back" onclick="window.history.back()" />
            <br />
            `
        return res.send(nonAdminHTML);
    }
    next();
};


app.use('/protectedRouteForAdminsOnly', protectedRouteForAdminsOnlyMiddlewareFunction);
app.get('/protectedRouteForAdminsOnly', (req, res) => {
    let adminHTML = `
        <code>app.get(\'\/protectedRouteForAdminsOnly\')</code>
        <br />
        <h1>Admins Page</h1>
        <p>Welcome Administrator <strong>${req.session.loggedUsername}</strong></p>
        <img src="/lounge.gif" alt="GIF: bar lounge" style="width: 50vh;" />
        <br />
        <br />
        <input type="button" value="Back" onclick="window.history.back()" />
        `
    console.log("app.get(\'\/protectedRouteForAdminsOnly\'): Current session cookie:", req.cookies);
    return res.send(adminHTML);
});


app.use((req, res, next) => {
    let errorHTML = `
        <h1>404: Sorry can't find that!</h1>
        <input type="button" value="Back" onclick="window.history.back()" />`
    res.status(404).send(errorHTML)
    console.log("404 Page: Current session cookie:", req.cookies);
})

module.exports = app;