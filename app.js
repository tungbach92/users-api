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
app.get('/user', async (req, res) => {
    try {
        const user = await mysqlPool.query("SELECT * FROM user")
        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send({message: "error" + e.message})
    }
})
module.exports = app;
