require("dotenv").config();
const express = require("express");
const {sign, verify} = require("jsonwebtoken");
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const {mysqlPool} = require("./config/db");
const session = require('express-session')

app.use(cors({
    origin: ['http://localhost:3000'], //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(session({
    secret: process.env.SESSION_SECRET, // Change this to a long and secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in a production environment with HTTPS
    }, // Set 'secure' to true if using HTTPS
}));

// app.use(require('./middlewares/addCustomHeaders'));

/**
 * before routes: middlewares
 */

// Routes logic goes here
app.get('/users', async (req, res) => {
    try {
        const user = await mysqlPool.query("SELECT * FROM users")
        res.status(200).send(user[0])
    } catch (e) {
        res.status(400).send({message: "error" + e.message})
    }
})

// Register
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const {fullName, email, password, birthdate, phoneNumber} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("email and password is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const userRes = await mysqlPool.query("SELECT * FROM users WHERE email=?", [email])

        if (userRes[0].length > 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        await mysqlPool.query("INSERT INTO users (email, password, fullName, birthdate, phone) VALUES(?, ?, ?, ?, ?)", [email, encryptedPassword, fullName, birthdate, phoneNumber])
        const result = await mysqlPool.query("SELECT * FROM users WHERE email=?", [email])
        req.session.user = result[0][0]
        req.session.authorized = true
        res.status(201).send(result[0][0]);
    } catch (err) {
        res.status(400).send({message: "error" + err.message})
        console.log(err);
    }
    // Our register logic ends here
});


//Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("email and password is required");
        }
        // Validate if user exist in our database
        const userRes = await mysqlPool.query("SELECT * FROM users WHERE email=?", [email]);

        if (userRes[0][0]?.password && (await bcrypt.compare(password, userRes[0][0].password))) {
            req.session.user = userRes[0][0]
            req.session.authorized = true
            req.session.save((err) => {
                if (err) {
                    console.error("Error saving session:", err);
                }
            });
            return res.status(200).send(userRes[0][0]);
        }
        res.status(400).send("Invalid user or password");
    } catch (err) {
        res.status(400).send({message: "error" + err.message})
        console.log(err);
    }
});
// Our login logic ends here

// Log out
app.post("/logout",
    // auth,
    (req, res, next) => {
        // const refreshToken = req.refreshToken
        // refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        req.session.destroy()
        res.status(200).send({message: "Logged out"})
    })
// Our log out logic ends here

// Get one user
app.get('/onAuthStateChanged',
    // auth,
    async (req, res) => {
        if (!req.session?.authorized) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        res.status(200).send(req.session.user)
    })
// Our get one user logic ends here

module.exports = app;
