const app = require("./app");

const PORT = 8989
const port = process.env.API_PORT || PORT;

// server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});