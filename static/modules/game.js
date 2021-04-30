export { Game };

class Game {


    throwDice(dys, data, id, _id) {
        let diceNumber = Math.floor((Math.random() * 6) + 1)
        this.diceNumber = diceNumber;

        let move = {
            diceNumber: diceNumber,
            isDiceThrown: true,
            isPlayerAfterMove: false,
        }

        data.move = move

        let body = JSON.stringify({ id: id, data: data, _id: _id });
        let headers = { "Content-Type": "application/json" };

        fetch("/modifyDB", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => console.log(data) // dane odpowiedzi z serwera
            )

        // dys.speak(dys);
    }

    getSynthesisVoices(dys) {
        dys.synth = window.speechSynthesis;
        dys.voices = [];

        dys.voices = dys.synth.getVoices();
        console.log(dys.voices);

        if (speechSynthesis.onvoiceschanged !== undefined)
            speechSynthesis.onvoiceschanged = dys.voices
    }

    speak(dys, diceNumber) {

        dys.getSynthesisVoices(dys);

        var u = new SpeechSynthesisUtterance();
        u.text = diceNumber;
        u.pitch = 1;
        u.rate = 1;
        u.voice = dys.voices[13];
        dys.synth.speak(u);
    }
    drawBoard() {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        let board = document.getElementById("board");
        ctx.drawImage(board, 0, 0, 500, 500);

    }

    moves() {

        let is44 = false;
        let fields = []
        let x = 281;
        let y = 20;

        for (let i = 0; i < 40; i++) {
            if (i < 4) {
                fields.push({ x: x, y: y })
                y = is44 ? y + 44 : y + 43;
                is44 = !is44;
            } else if (i < 8) {
                fields.push({ x: x, y: y })
                x = is44 ? x + 44 : x + 43;
                is44 = !is44;
            } else if (i < 10) {
                fields.push({ x: x, y: y })
                y = is44 ? y + 44 : y + 43;
                is44 = !is44;
            } else if (i < 14) {
                fields.push({ x: x, y: y })
                x = is44 ? x - 44 : x - 43;
                is44 = !is44;
            } else if (i < 18) {
                fields.push({ x: x, y: y })
                y = is44 ? y + 44 : y + 43;
                is44 = !is44;
            } else if (i < 20) {
                fields.push({ x: x, y: y })
                x = is44 ? x - 44 : x - 43;
                is44 = !is44;
            } else if (i < 24) {
                fields.push({ x: x, y: y })
                y = is44 ? y - 44 : y - 43;
                is44 = !is44;
            } else if (i < 28) {
                fields.push({ x: x, y: y })
                x = is44 ? x - 44 : x - 43;
                is44 = !is44;
            } else if (i < 30) {
                fields.push({ x: x, y: y })
                y = is44 ? y - 44 : y - 43;
                is44 = !is44;
            } else if (i < 30) {
                fields.push({ x: x, y: y })
                y = is44 ? y - 44 : y - 43;
                is44 = !is44;
            } else if (i < 34) {
                fields.push({ x: x, y: y })
                x = is44 ? x + 44 : x + 43;
                is44 = !is44;
            } else if (i < 38) {
                fields.push({ x: x, y: y })
                y = is44 ? y - 44 : y - 43;
                is44 = !is44;
            } else if (i < 39) {
                fields.push({ x: x, y: y })
                x = is44 ? x + 44 : x + 43;
                is44 = !is44;
            } else {
                fields.push({ x: x, y: y })
            }

        }

        this.fields = fields;

        this.startingPositions = {
            blue: 0,
            green: 10,
            yellow: 20,
            red: 30
        }

        this.greenWinningContainer = [
            { x: 412, y: 237 },
            { x: 368, y: 237 },
            { x: 325, y: 237 },
            { x: 281, y: 237 }
        ]

        this.yellowWinningContainer = [
            { x: 238, y: 412 },
            { x: 238, y: 368 },
            { x: 238, y: 325 },
            { x: 238, y: 281 }
        ]

        this.redWinningContainer = [
            { x: 63, y: 238 },
            { x: 107, y: 238 },
            { x: 150, y: 238 },
            { x: 194, y: 238 }
        ]

        this.blueWinningContainer = [
            { x: 237, y: 63 },
            { x: 237, y: 107 },
            { x: 237, y: 151 },
            { x: 237, y: 194 }
        ]

        this.redStartingContainer = [
            { x: 20, y: 20 },
            { x: 64, y: 20 },
            { x: 20, y: 64 },
            { x: 64, y: 64 }
        ]

        this.blueStartingContainer = [
            { x: 455, y: 20 },
            { x: 411, y: 20 },
            { x: 455, y: 64 },
            { x: 411, y: 64 }
        ]

        this.greenStartingContainer = [
            { x: 455, y: 455 },
            { x: 411, y: 455 },
            { x: 455, y: 411 },
            { x: 411, y: 411 }
        ]

        this.yellowStartingContainer = [
            { x: 20, y: 455 },
            { x: 64, y: 455 },
            { x: 20, y: 411 },
            { x: 64, y: 411 }
        ]

        this.startingContainers = {
            red: this.redStartingContainer,
            blue: this.blueStartingContainer,
            green: this.greenStartingContainer,
            yellow: this.yellowStartingContainer
        }
        this.winningContainers = {
            red: this.redWinningContainer,
            blue: this.blueWinningContainer,
            green: this.greenWinningContainer,
            yellow: this.yellowWinningContainer
        }

        // for (let i = 0; i < greenWinningContainer.length; i++) {
        //     ctx.drawImage(greenPawn, greenWinningContainer[i].x, greenWinningContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < fields.length; i++) {
        //     ctx.drawImage(greenPawn, fields[i].x, fields[i].y, 25, 25);
        // }

        // for (let i = 0; i < yellowWinningContainer.length; i++) {
        //     ctx.drawImage(greenPawn, yellowWinningContainer[i].x, yellowWinningContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < redWinningContainer.length; i++) {
        //     ctx.drawImage(greenPawn, redWinningContainer[i].x, redWinningContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < blueWinningContainer.length; i++) {
        //     ctx.drawImage(greenPawn, blueWinningContainer[i].x, blueWinningContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < redStartingContainer.length; i++) {
        //     ctx.drawImage(greenPawn, redStartingContainer[i].x, redStartingContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < blueStartingContainer.length; i++) {
        //     ctx.drawImage(greenPawn, blueStartingContainer[i].x, blueStartingContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < greenStartingContainer.length; i++) {
        //     ctx.drawImage(greenPawn, greenStaringContainer[i].x, greenStaringContainer[i].y, 25, 25);
        // }

        // for (let i = 0; i < yellowStartingContainer.length; i++) {
        //     ctx.drawImage(greenPawn, yellowStartingContainer[i].x, yellowStartingContainer[i].y, 25, 25);
        // }

        console.log(fields);
        console.log(fields.length);

    }

    drawPawns(color, x, y) {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        let pawn = document.getElementById(color + "Pawn");

        ctx.drawImage(pawn, x, y, 25, 25);

    }

    // pawnsCoordinates() {

    // }


}