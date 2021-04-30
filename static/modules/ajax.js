export { Ajax };
import { Game } from "./game.js";

class Ajax {
    constructor(nick, color, colors, data, ready, insert_time, _id, status) {
        this.nick = nick;
        this.color = color;
        this.colors = colors;
        this.data = data;
        this.ready = ready;
        this.insert_time = insert_time;
        this._id = _id;
        this.status = status;
        this.playerOrder = ["red", "blue", "green", "yellow"];
    }

    //dys = this;

    init() {
        let dys = this;
        let game = new Game();
        dys.sounds = [false, false, false, false];

        document.getElementById("submitNick").addEventListener("click", function () {
            document.getElementById("startScreen").style.zIndex = -10;
            dys.get(game);
        })
        document.getElementById("submitReady").addEventListener("click", function () { dys.getReady(dys) })
        document.getElementById("throwDice").addEventListener("click", function () { game.throwDice(game, dys.data, dys.id, dys._id) })
        game.moves();
        game.drawBoard();

    }

    newGame() {
        this.nick = document.getElementById("nick").value;
        this.colors = ["red", "blue", "green", "yellow"];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.insert_time = new Date().getTime();

        this.inputPlayerData(this.color, this.nick);

        this.data[this.color] = {
            nick: this.nick,
            color: this.color,
            insert_time: this.insert_time,
            last_act: this.insert_time,
            status: this.status,
            pawns: []
        }

        let body = JSON.stringify(this.data);
        let headers = { "Content-Type": "application/json" };
        // nagłowek czyli typ danych

        fetch("/newGame", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {
                    this._id = data._id;
                } // dane odpowiedzi z serwera
            )

    }
    clearDivs() {
        let game = this.data;
        let colors = ["red", "blue", "green", "yellow"];

        let playerColors = Object.keys(game);

        if (game.move != undefined)
            playerColors.splice(playerColors.indexOf("move"), 1)

        for (let i = 0; i < playerColors.length; i++) {
            colors.splice(colors.indexOf(playerColors[i]), 1);
        }

        //console.log(colors);

        for (let i = 0; i < colors.length; i++) {
            document.getElementById(colors[i]).setAttribute("style", "background-color: lightgrey;");
            document.getElementById(colors[i]).children[0].innerHTML = "?";
        }
    }

    inputPlayerData(color, nick) {

        if (color == "red") {
            document.getElementById("red").style.backgroundColor = "red";
            document.getElementById("red").children[0].innerText = nick;
        } else if (color == "blue") {
            document.getElementById("blue").style.backgroundColor = "blue";
            document.getElementById("blue").children[0].innerText = nick;
        } else if (color == "green") {
            document.getElementById("green").style.backgroundColor = "green";
            document.getElementById("green").children[0].innerText = nick;
        } else if (color == "yellow") {
            document.getElementById("yellow").style.backgroundColor = "yellow";
            document.getElementById("yellow").children[0].innerText = nick;

        }



    }

    markReadyPlayers(color) {

        if (this.data[color].status != 0) {
            document.getElementById(color).style.opacity = 1;
        } else {
            document.getElementById(color).style.opacity = 0.2;
        }
    }

    get(game) {

        let headers = { "Content-Type": "application/json" };

        fetch("/getGames", { method: "post", headers }) // fetch
            .then(response => response.json())
            .then(response => {

                let ob = response.data;
                ob.sort(function (a, b) {
                    return parseFloat(a.id) - parseFloat(b.id);
                });

                if (ob.length == 0) {
                    console.log("no games");
                    this.newGame();
                } else {
                    ob = ob[ob.length - 1];
                    //console.log(ob)
                    let lastGame = ob.data;
                    // console.log("last game:");
                    // console.log(lastGame);

                    let numberOfPlayers = Object.keys(lastGame).length;
                    if (ob.data.move != undefined)
                        numberOfPlayers--;

                    let playerData = [];
                    let allPlayersReady = 0;
                    let id = ob.id;
                    this.id = id;
                    this._id = ob._id;
                    if (numberOfPlayers == 4) {
                        console.log("4 players");
                        this.newGame();
                    } else {
                        if (lastGame.red != undefined) {
                            playerData.push(lastGame.red);
                            document.getElementById("red").children[0].innerHTML = lastGame.red.nick;
                            document.getElementById("red").style.backgroundColor = "red";
                            this.colors.splice(this.colors.indexOf("red"), 1);
                        }
                        if (lastGame.blue != undefined) {
                            playerData.push(lastGame.blue);
                            document.getElementById("blue").children[0].innerHTML = lastGame.blue.nick;
                            document.getElementById("blue").style.backgroundColor = "blue";
                            this.colors.splice(this.colors.indexOf("blue"), 1);
                        }
                        if (lastGame.yellow != undefined) {
                            playerData.push(lastGame.yellow);
                            document.getElementById("yellow").children[0].innerHTML = lastGame.yellow.nick;
                            document.getElementById("yellow").style.backgroundColor = "yellow";
                            this.colors.splice(this.colors.indexOf("yellow"), 1);
                        }
                        if (lastGame.green != undefined) {
                            playerData.push(lastGame.green);
                            document.getElementById("green").children[0].innerHTML = lastGame.green.nick;
                            document.getElementById("green").style.backgroundColor = "green";
                            this.colors.splice(this.colors.indexOf("green"), 1);
                        }

                        for (let i = 0; i < playerData.length; i++) {
                            if (playerData[i].status != 0)
                                allPlayersReady++;
                        }

                        if (numberOfPlayers == allPlayersReady && numberOfPlayers >= 2) {
                            console.log("ready");
                            this.newGame();
                        } else {
                            this.nick = document.getElementById("nick").value;
                            this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
                            // console.log(Math.floor(Math.random() * this.colors.length));
                            this.insert_time = new Date().getTime();
                            this.data = {};
                            this.inputPlayerData(this.color, this.nick);

                            for (let i = 0; i < numberOfPlayers; i++) {
                                this.data[playerData[i].color] = playerData[i];
                            }
                            this.data[this.color] = {
                                nick: this.nick,
                                color: this.color,
                                insert_time: this.insert_time,
                                last_act: this.insert_time,
                                status: this.status,
                                pawns: []
                            }
                            this.send();
                        }
                    }
                }
                this.checkStatusAjaxInterval = setInterval(this.checkStatusAjax, 1000, this, game);
                this.clearDivs();
            }
            )
    }

    send() {
        let body = JSON.stringify({ id: this.id, data: this.data, _id: this._id });
        let headers = { "Content-Type": "application/json" };

        fetch("/modifyDB", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => console.log(data) // dane odpowiedzi z serwera
            )
    }

    checkStatusAjax(dys, Game) {
        let body = JSON.stringify({ _id: dys._id });
        let headers = { "Content-Type": "application/json" };

        fetch("/checkGame", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {
                    data = JSON.parse(data);

                    let game = data.data[0];

                    dys.data = game.data;

                    let playerColors = Object.keys(dys.data);




                    if (dys.data.move != undefined)
                        playerColors.splice(playerColors.indexOf("move"), 1)



                    for (let i = 0; i < playerColors.length; i++) {
                        dys.inputPlayerData(playerColors[i], game.data[playerColors[i]].nick)
                        dys.markReadyPlayers(playerColors[i])
                    }

                    Game.drawBoard();

                    for (let i = 0; i < playerColors.length; i++) {
                        for (let j = 0; j < 4; j++) {
                            if (dys.data[playerColors[i]].pawns[j] != undefined) {
                                Game.drawPawns(playerColors[i], dys.data[playerColors[i]].pawns[j].map.x, dys.data[playerColors[i]].pawns[j].map.y)
                            }
                        }
                    }

                    if (dys.ready) {

                        for (let i = 0; i < playerColors.length; i++) {
                            dys.data[playerColors[i]].status = 2;
                            let pawn;

                            for (let j = 0; j < 4; j++) {
                                if (playerColors[i] == "red") {
                                    pawn = {
                                        board: "start",
                                        map: Game.redStartingContainer[j],
                                        index: j,
                                        color: playerColors[i]
                                    }
                                } else if (playerColors[i] == "blue") {
                                    pawn = {
                                        board: "start",
                                        map: Game.blueStartingContainer[j],
                                        index: j,
                                        color: playerColors[i]
                                    }
                                } else if (playerColors[i] == "green") {
                                    pawn = {
                                        board: "start",
                                        map: Game.greenStartingContainer[j],
                                        index: j,
                                        color: playerColors[i]
                                    }
                                } else if (playerColors[i] == "yellow") {
                                    pawn = {
                                        board: "start",
                                        map: Game.yellowStartingContainer[j],
                                        index: j,
                                        color: playerColors[i]
                                    }
                                }

                                dys.data[playerColors[i]].pawns.push(pawn);
                            }
                        }

                        for (let i = 0; i < dys.playerOrder.length; i++) {
                            if (dys.data[dys.playerOrder[i]]) {

                                dys.data[dys.playerOrder[i]].status = 3;
                                break;
                            }
                        }

                        dys.ready = false;

                        dys.saveData(dys);
                        //document.getElementById("ready")
                    }

                    let move = dys.data.move;

                    let index = 0;
                    while (!dys.data[dys.playerOrder[index]]) {
                        index++;
                        if (index > 3)
                            index = 0;

                    }
                    console.log(dys.playerOrder[index] + " " + index)
                    return;

                    for (let i = 0; i < dys.playerOrder.length; i++) {
                        if (dys.data[dys.playerOrder[i]]) {

                            if (dys.data[dys.playerOrder[i]].status == 3 && dys.playerOrder[i] == dys.color) {
                                document.getElementById("throwDice").style.visibility = "visible";

                                if (dys.resetTimer) {
                                    dys.timer = 10;
                                    dys.resetTimer = false;
                                }

                                if (move.isDiceThrown == true && move.diceNumber > 0 && move.diceNumber < 7) {
                                    document.getElementById("throwDice").style.visibility = "hidden";
                                    let diceImage = "background-image:url('../images/dice/k" + move.diceNumber + ".png');"
                                    document.getElementById("diceImage").setAttribute("style", diceImage);

                                    if (dys.sounds[i] == false) {
                                        // Game.speak(Game, move.diceNumber);
                                        dys.sounds[i] = true;
                                    }
                                    break;
                                }

                            }


                            if (dys.data[dys.playerOrder[i]].status == 2 && dys.playerOrder[i] == dys.color) {
                                document.getElementById("throwDice").style.visibility = "hidden";

                                if (dys.resetTimer) {
                                    dys.timer = 10;
                                    dys.resetTimer = false;
                                }
                                if (move.diceNumber > 0 && move.diceNumber < 7) {
                                    let diceImage = "background-image:url('../images/dice/k" + move.diceNumber + ".png');"
                                    document.getElementById("diceImage").setAttribute("style", diceImage);

                                    if (dys.sounds[i] == false) {
                                        // Game.speak(Game, move.diceNumber);
                                        dys.sounds[i] = true;
                                    }
                                    break;
                                }

                            }

                        }
                    }

                    for (let i = 0; i < dys.playerOrder.length; i++) {
                        if (dys.data[dys.playerOrder[i]]) {
                            console.log(dys.data[dys.playerOrder[i]].status + " " + dys.data[dys.playerOrder[i]].color);
                            if (dys.data[dys.playerOrder[i]].status == 3 && !dys.timerInterval && dys.playerOrder[i] == dys.color) {
                                document.getElementById("throwDice").style.visibility = "visible";
                                dys.timer = 10;

                                dys.activePlayer = dys.playerOrder[i];

                                dys.timerInterval = setInterval(function () {

                                    if (move.isPlayerAfterMove == false && move.diceNumber > 0 && move.diceNumber < 7) {
                                        let pawns = dys.data[dys.activePlayer];

                                        if (move.diceNumber == 1 || move.diceNumber == 6) {
                                            for (let j = 0; j < pawns.pawns.length; j++) {
                                                if (pawns.pawns[j].board == "start") {
                                                    let pawnDivs = document.getElementById("pawn" + j);
                                                    pawnDivs.setAttribute("style", "top:" + Game.startingContainers[dys.activePlayer][j].y + "px;left:" + Game.startingContainers[dys.activePlayer][j].x + "px;");
                                                    pawnDivs.style.zIndex = 99;
                                                    pawnDivs.style.backgroundColor = "pink";

                                                    pawnDivs.addEventListener("click", function pawnDivsEventListener() {

                                                        console.log("pierwszy if");

                                                        dys.data[dys.activePlayer].pawns[j].board = "board";
                                                        dys.data[dys.activePlayer].pawns[j].index = Game.startingPositions[dys.activePlayer];

                                                        let currentPawnIndex = dys.data[dys.activePlayer].pawns[j].index;

                                                        dys.data[dys.activePlayer].pawns[j].map = { x: Game.fields[currentPawnIndex].x, y: Game.fields[currentPawnIndex].y }

                                                        dys.data.move.isPlayerAfterMove = true;

                                                        dys.data[dys.playerOrder[i]].status = 2;
                                                        let index = i + 1;

                                                        while (!dys.data[dys.playerOrder[index]]) {
                                                            index++;
                                                            if (index > 3)
                                                                index = 0;

                                                        }

                                                        dys.data[dys.playerOrder[index]].status = 3;

                                                        dys.resetTimer = true;

                                                        dys.saveData(dys);

                                                        Array.from(document.getElementsByClassName("pawnDiv")).forEach(element => {
                                                            var old_element = element;
                                                            var new_element = old_element.cloneNode(true);
                                                            old_element.parentNode.replaceChild(new_element, old_element);

                                                            new_element.style.zIndex = -999;
                                                        })

                                                    })
                                                }
                                            }

                                        } else if (move.diceNumber > 0 && move.diceNumber < 7) {
                                            for (let j = 0; j < pawns.pawns.length; j++) {
                                                if (pawns.pawns[j].board == "board") {
                                                    let x = Game.fields[pawns.pawns[j].index].x;
                                                    let y = Game.fields[pawns.pawns[j].index].y;

                                                    let pawnDivs = document.getElementById("pawn" + j);
                                                    pawnDivs.setAttribute("style", "top:" + y + "px;left:" + x + "px;");
                                                    pawnDivs.style.zIndex = 99;
                                                    pawnDivs.style.backgroundColor = "pink";

                                                    console.log("drugi if");

                                                    let moveDice = move.diceNumber;

                                                    pawnDivs.addEventListener("click", function pawnDivsEventListener() {

                                                        let oldPawnIndex = dys.data[dys.activePlayer].pawns[j].index

                                                        console.log("olPawnIndex: " + oldPawnIndex + " move.diceNumber: " + moveDice);

                                                        dys.data[dys.activePlayer].pawns[j].board = "board";
                                                        dys.data[dys.activePlayer].pawns[j].index = oldPawnIndex + moveDice;

                                                        let currentPawnIndex = dys.data[dys.activePlayer].pawns[j].index;

                                                        dys.data[dys.activePlayer].pawns[j].map = { x: Game.fields[currentPawnIndex].x, y: Game.fields[currentPawnIndex].y }

                                                        dys.data.move.isPlayerAfterMove = true;

                                                        dys.data[dys.playerOrder[i]].status = 2;
                                                        let index = i + 1;

                                                        while (!dys.data[dys.playerOrder[index]]) {
                                                            index++;
                                                            if (index > 3)
                                                                index = 0;

                                                        }

                                                        dys.data[dys.playerOrder[index]].status = 3;

                                                        dys.resetTimer = true;

                                                        dys.saveData(dys);

                                                        Array.from(document.getElementsByClassName("pawnDiv")).forEach(element => {
                                                            var old_element = element;
                                                            var new_element = old_element.cloneNode(true);
                                                            old_element.parentNode.replaceChild(new_element, old_element);

                                                            new_element.style.zIndex = -999;
                                                        })


                                                    })

                                                }
                                            }
                                        }

                                    }
                                    let timer = document.getElementById(dys.playerOrder[i]).children[1];

                                    dys.timer--;
                                    timer.innerHTML = dys.timer;


                                    if (dys.timer <= 0) {

                                        dys.data[dys.playerOrder[i]].status = 2;
                                        let index = i + 1;

                                        while (!dys.data[dys.playerOrder[index]]) {
                                            index++;
                                            if (index > 3)
                                                index = 0;

                                        }

                                        dys.data[dys.playerOrder[index]].status = 3;
                                        dys.data.move.isDiceThrown = false;

                                        console.log("endTimer");

                                        clearInterval(dys.timerInterval);
                                        dys.saveData(dys);
                                        dys.timerInterval = null;
                                        dys.sounds = [false, false, false, false];






                                    }
                                }, 1000)
                            } else if (dys.data[dys.playerOrder[i]].status == 2 && !dys.timerInterval && dys.playerOrder[i] == dys.color) {
                                dys.timer = 10;
                                let timer = null;



                                for (let i = 0; i < dys.playerOrder.length; i++) {
                                    if (dys.data[dys.playerOrder[i]]) {
                                        if (dys.data[dys.playerOrder[i]].status == 3) {
                                            timer = document.getElementById(dys.playerOrder[i]).children[1];
                                        }
                                    }

                                }


                                dys.timerInterval = setInterval(function () {

                                    dys.timer--;
                                    timer.innerHTML = dys.timer;


                                    if (dys.timer <= 0) {
                                        clearInterval(dys.timerInterval);

                                        for (let i = 0; i < dys.playerOrder.length; i++) {
                                            if (dys.data[dys.playerOrder[i]]) {
                                                if (dys.data[dys.playerOrder[i]].status == 3) {
                                                    let index = i + 1;
                                                    dys.data[dys.playerOrder[i]].status = 2;

                                                    while (!dys.data[dys.playerOrder[index]]) {
                                                        index++;
                                                        if (index > 3)
                                                            index = 0;

                                                    }

                                                    dys.data[dys.playerOrder[index]].status = 3;

                                                }
                                            }

                                        }

                                        timer.innerText = "";

                                        dys.timerInterval = null;
                                        dys.data.move.isDiceThrown = false;

                                        dys.sounds = [false, false, false, false];
                                    }

                                }, 1000)


                            }

                        }











                    }

                } // dane odpowiedzi z serwera
            )

    }

    getReady(dys) {

        if (dys.status == 0) {
            dys.status = 1;
            document.getElementById("ready").innerText = "GOTOWY";
            document.getElementById(dys.data[dys.color].color).style.opacity = 1;
        } else {
            dys.status = 0;
            document.getElementById("ready").innerText = "NIEGOTOWY";
            document.getElementById(dys.data[dys.color].color).style.opacity = 0.2;
        }

        dys.data[dys.color].status = dys.status;

        let body = JSON.stringify({ id: dys.id, data: dys.data, _id: dys._id });
        let headers = { "Content-Type": "application/json" };

        fetch("/modifyDB", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {

                    let readyPlayerCounter = 0;

                    let playerColors = Object.keys(dys.data);

                    if (dys.data.move != undefined)
                        playerColors.splice(playerColors.indexOf("move"), 1);

                    for (let i = 0; i < playerColors.length; i++) {
                        if (dys.data[playerColors[i]].status == 1) {
                            readyPlayerCounter++;
                        }
                    }

                    if (playerColors.length >= 2) {
                        dys.ready = readyPlayerCounter == playerColors.length;
                    }
                } // dane odpowiedzi z serwera
            )


    }

    saveData(dys) {
        let body = JSON.stringify({ id: dys.id, data: dys.data, _id: dys._id });
        let headers = { "Content-Type": "application/json" };
        // nagłowek czyli typ danych

        fetch("/modifyDB", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => console.log(data) // dane odpowiedzi z serwera
            )
    }

}