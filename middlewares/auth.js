const {verify, sign} = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // const accessToken = req.accessToken
    // const refreshToken = req.refreshToken
    // if (accessToken) {
    //     verify(accessToken, process.env.TOKEN_KEY, (err, user) => {
    //         if (err) {
    //             //session login expired
    //             return res.status(440).send({message: err.message});
    //         }
    //         req.user = user;
    //         next();
    //     });
    // } else {
    //     res.status(401).send({message: "You are not authenticated!"});
    // }
};

module.exports = verifyToken;