// 2023-04-24
// Assignment 2 - Victor Liu (#A00971668, Set F)
const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const usersModel = require('./models/w2users.js');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.ATLAS_DB_USERNAME}:${process.env.ATLAS_DB_PASSWORD}@${process.env.ATLAS_DB_HOST}/?retryWrites=true&w=majority`,
        // mongoUrl: `mongodb://127.0.0.1:27017/comp2537w2`,
        crypto: {
            secret: process.env.MONGO_SESSION_SECRET,
        },
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        dbName: 'sessionStoreDB',
        collectionName: 'sessions',
        ttl: 60 * 60 * 1, // 1 hour
        autoRemove: 'native'
    })
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"));
app.use(express.json())

app.get(['/', '/home'], (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/protectedRoute');
    } else {
        console.log("\'\/\', \'\/home\': Current session cookie:", req.cookies)
        res.render('./index.ejs');
    }
})

app.get('/createUser', (req, res) => {
    console.log("app.get(\'\/createUser\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/protectedRoute');
    } else {
        res.render('./register.ejs');
    }
})

app.post('/createUser', async (req, res) => {
    const schemaCreateUser = Joi.object({
        username: Joi.string()
            .alphanum()
            .max(30)
            .trim()
            .min(1)
            .strict()
            .required(),
        password: Joi.string()
            .required()
    })
    try {
        const resultUsername = await schemaCreateUser.validateAsync(req.body);
    } catch (err) {
        if (err.details[0].context.key == "username") {
            console.log(err.details)
            let createUserFailHTML = `
            <code>app.post(\'/createUser\')</code>
            <br />
            <h3>Error: Username can only contain letters and numbers and must not be empty - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/createUser'" />
            `
            return res.send(createUserFailHTML)
        }
        if (err.details[0].context.key == "password") {
            console.log(err.details)
            let createUserFailHTML = `
            <code>app.post(\'/createUser\')</code>
            <br />
            <h3>Error: Password is empty - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/createUser'" />
            `
            return res.send(createUserFailHTML)
        }
    }
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
            password: hashedPassword,
            type: "non-administrator"
        })
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = hashedPassword;
        req.session.loggedType = "non-administrator";
        await newUser.save();
        console.log(`New user created: ${newUser}`);
        res.redirect('/protectedRoute');
    }
})

app.get('/login', (req, res) => {
    console.log("app.get(\'\/login\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/protectedRoute');
    } else {
        res.render('login.ejs')
    }
})

app.post('/login', async (req, res) => {
    console.log(`Username entered: ${req.body.username}`);
    console.log(`Password entered: ${req.body.password}`);
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
    })
    try {
        const value = await schema.validateAsync({ username: req.body.username, password: req.body.password });
    }
    catch (err) {
        console.log(err.details);
        console.log("Username or password is invalid")
        return
    }

    const userresult = await usersModel.findOne({
        username: req.body.username
    });
    console.log(userresult);
    if (userresult && bcrypt.compareSync(req.body.password, userresult.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = userresult.password;
        req.session.loggedType = userresult?.type;
        console.log("app.post(\'\/login\'): Current session cookie:", req.cookies)
        res.redirect('/protectedRoute');
    } else {
        let loginFailHTML = `
        <code>app.post(\'/login\')</code> 
        <br />
        <a href="/">Home</a>
        <h1>Invalid username or password</h1>
        <input type="button" value="Try Again" onclick="window.history.back()" />
        <br />
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

const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/notLoggedIn')
    } else {
        next();
    }
};

const checkAccountType = async (req, res, next) => {
    const result = await usersModel.findOne({
        username: req.session.loggedUsername
    });
    console.log("checkAccountType: ", result)
    if (result.type === "administrator") {
        req.session.loggedType = "administrator";
        next();
    } else {
        req.session.loggedType = "non-administrator";
        next()
    }
}

app.use('/protectedRoute', authenticatedOnly, checkAccountType);
app.get('/notLoggedIn', (req, res) => {
    console.log("app.get(\'\/notLoggedIn\'): Current session cookie-id:", req.cookies)
    res.render('notLoggedIn.ejs')
});

app.get('/protectedRoute', async (req, res) => {
    console.log("app.get(\'\/protectedRoute\'): Current session cookie-id:", req.cookies);
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.gif`;
    res.render('protectedRoute.ejs', {
        "username": req.session.loggedUsername,
        "imagea": `00${Math.floor(Math.random() * 3) + 1}.gif`,
        "imageb": `00${Math.floor(Math.random() * 3) + 1}.gif`,
        "imagec": `00${Math.floor(Math.random() * 3) + 1}.gif`,
        "isAdmin": req.session.loggedType == 'administrator'
    })
});

const protectedRouteForAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    const result = await usersModel.findOne({
        username: req.session.loggedUsername
    });
    // console.log('User info from findOne(): ', result);
    if (req.session.GLOBAL_AUTHENTICATED && result?.type == 'administrator') {
        next('route');
    } else if (req.session.GLOBAL_AUTHENTICATED && result?.type != 'administrator') {
        let nonAdminHTML = `
            <code>app.use(\'/admin\', protectedRouteForAdminsOnlyMiddlewareFunction)</code>
            <h1>403: Error: insufficient privileges</h1>
            <button onclick="window.history.back()">Go Back</button>
            <br />
            `
        res.send(nonAdminHTML);
    } else {
        res.redirect('/login');
    }
};

app.use('/admin', protectedRouteForAdminsOnlyMiddlewareFunction);
app.get('/admin', async (req, res) => {
    console.log("app.get(\'\/admin\'): Current session cookie:", req.cookies);
    users = await usersModel.find({ username: { $nin: ["admin", req.session.loggedUsername] } });
    res.render('adminRoute.ejs', {
        "admin_name": req.session.loggedUsername,
        "users": users,
        "type": req.session.loggedType
        });
});

app.post('/promoteUser', async (req, res) => {
    console.log("app.post('/promoteUser'): Current session cookie:", req.cookies);
    console.log(`PROMOTING '${req.body.username}'`);
    const result = await usersModel.findOneAndUpdate({
        username: req.body.username
    }, {
        type: "administrator"
    }, { returnOriginal: false
    });
    console.log("result: ", result);
    res.redirect('/admin');
});

app.post('/demoteUser', async (req, res) => {
    console.log("app.post('/promoteUser'): Current session cookie:", req.cookies);
    console.log(`DEMOTING '${req.body.username}'`);
    const result = await usersModel.findOneAndUpdate({
        username: req.body.username
    }, {
        type: "non-administrator"
    }, { returnOriginal: false
    });
    console.log("result: ", result);
    res.redirect('/admin');
});


app.get("*", (req, res) => {
    console.log("app.get(\'*\'): Current session cookie:", req.cookies)
        res.status(404).render('404page.ejs');
})


module.exports = app;