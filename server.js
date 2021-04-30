//zmienne, stałe

var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require('cors');
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}
var Datastore = require('nedb')

var db = new Datastore({
    filename: 'games.db',
    autoload: true
});
var id = 0;
var game = {
    id: 0,
    data: "",
};
var data;


//funkcje na serwerze obsługujace konkretne adresy w przeglądarce
var path = require("path")
app.use(express.static('static'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));

})

app.post("/getGames", function (req, res) {

    db.find({}, function (err, docs) {
        let games = JSON.stringify({ "data": docs });
        res.end(games)
    });

})

app.post("/checkGame", function (req, res) {

    let _id = req.body._id;

    db.find({ _id: _id }, function (err, docs) {
        let game = JSON.stringify({ "data": docs });
        res.end(JSON.stringify(game))
    });
})

app.post("/newGame", function (req, res) {
    let game = {
        id: id,
        data: req.body
    }
    id++;

    db.insert(game, function (err, newDoc) {
        game._id = newDoc._id;
        res.end(JSON.stringify(game));
    })

})

app.post("/modifyDB", function (req, res) {
    let move = {
        diceNumber: 0,
        isDiceThrown: false,
        isPlayerAfterMove: false

    }

    let game = req.body;

    if (req.body.data.move == undefined)
        req.body.data.move = move;


    console.log(req.body)

    db.update({ _id: req.body._id }, { $set: { data: req.body.data } }, function (err, numReplaced) {
        console.log("replaced---->" + numReplaced);
        res.end(JSON.stringify(game))
    });

})






//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})