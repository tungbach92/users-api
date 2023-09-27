require("dotenv").config();
const express = require("express");
const {sign, verify} = require("jsonwebtoken");
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const {mysqlPool} = require("./config/db");

app.use(cors({
    origin: ['http://localhost:3000'], //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());

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
        const {fullName, email, password, birthdate, phone} = req.body;

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
        await mysqlPool.query("INSERT INTO users (email, password, fullName, birthdate, phone) VALUES(?, ?, ?, ?, ?)", [email, encryptedPassword, fullName, birthdate, phone])
        const result = await mysqlPool.query("SELECT * FROM users WHERE email=?", [email])
        // Create token
        // const accessToken = generateAccessToken({user_id: user._id, email: user.email})

        // return new user
        // user.accessToken = accessToken
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
            // Create token
            // const accessToken = generateAccessToken({user_id: user._id, email})

            // Creating refresh token not that expiry of refresh
            //token is greater than the access token
            // const refreshToken = generateRefreshToken({user_id: user._id, email})

            //push refreshToken to our list refresh token
            // refreshTokens.push(refreshToken)

            // Assigning refresh token in http-only cookie
            // res.cookie('jwt', refreshToken, {
            //     // httpOnly: true,
            //     httpOnly: false,
            //     sameSite: 'none',
            //     secure: true,
            //     maxAge: 15 * 60 * 1000 // 15min
            // })
            // user.accessToken = accessToken
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
        // res.clearCookie('jwt', refreshToken, {
        //     httpOnly: false,
        //     sameSite: 'none',
        //     secure: true,
        // })
        res.status(200).send({message: "Logged out"})
    })
// Our log out logic ends here

// Get one user
app.get('/user',
    // auth,
    async (req, res) => {
        // const user = req.user
        const {email, password} = req.body
        const userRes = await mysqlPool.query("SELECT * FROM users WHERE email=?", [email]);
        if (userRes[0].length === 0 && !userRes[0][0]?.password || !(await bcrypt.compare(password, userRes[0][0].password))) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        res.status(200).send(userRes[0][0])
    })
// Our get one user logic ends here

module.exports = app;
