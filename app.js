
const path = require('path')
var express = require("express");
var app = express();

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')

app.get("" , (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log("Server running on port 3000");
});
   