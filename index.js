const app = require("./app");

const {API_PORT} = process.env;
const port = process.env.API_PORT || 8989;

// server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});