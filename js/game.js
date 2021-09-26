class Game {
    constructor(seconds) {
        this._seconds = seconds;
        this._counter = 0;
        this.game = false;
        this.gameOver = false;
    }

    //#region Game starting and finishing
    _startGame() {
        this.game = true;

        this._showSeconds();
        this._startTimer();
        this._increaseCounter();
    }

    _gameOver(timer) {
        this.game = false;
        this.gameOver = true;
        this._seconds = +document.querySelector("#setTimer").value || 10;

        this._deactivateButton();
        setTimeout(() => {
            this.activateButton();
        }, 5000);

        clearInterval(timer);
        this._writeNewRecord(this._counter);
    }
    //#endregion

    //#region Timer

    _startTimer() {
        let timer = setInterval(() => {
            this._seconds--;
            this._showSeconds();
        }, 1000);

        setTimeout(() => {
            this._gameOver(timer);
        }, this._seconds * 1000);
    }

    _showSeconds() {
        document.querySelector('#timer').innerHTML = this._seconds;
        this._animateTimer();
    }

    //#endregion

    //#region Counter

    _increaseCounter() {
        if (this.game) {
            this._counter++;
        } else {
            if (!this.gameOver) {
                this._startGame();
            } else {
                this._resetCounter()
                this._startGame();
            }
        }

        this._animateCounter();
        document.querySelector('#counter').innerHTML = this._counter;
    }

    _resetCounter() {
        this._counter = 0;
        document.querySelector('#counter').innerHTML = this._counter
    }

    //#endregion

    //#region Button handlers

    _deactivateButton() {
        document.querySelector("#clicker").removeEventListener("click", this._clicksListener);
        
        document.querySelector('#clicker').classList.add("deactivating");
        setTimeout(function() {
            document.querySelector('#clicker').classList.remove("deactivating");
            document.querySelector('#clicker').classList.add("deactivated");
            document.querySelector('#clicker').innerHTML = "Ok, ok, calm down, dude!";
        }, 100);
    }

    activateButton() {
        document.querySelector("#clicker").addEventListener("click", this._clicksListener);
        document.querySelector('#clicker').classList.remove("deactivated");
        document.querySelector('#clicker').innerHTML = "Click me!!!";

        this._showSeconds();
        this._resetCounter();
    }

    _clicksListener() {
        if (game.gameOver) {
            game = new Game(+document.querySelector('#setTimer').value || 10);
        }

        game._increaseCounter();
    }

    //#endregion

    //#region Animations

    _animateCounter() {
        document.querySelector('#counter').classList.add("counter-anim");
        setTimeout(function () {
            document.querySelector('#counter').classList.remove("counter-anim");
        }, 100);
    }

    _animateTimer() {
        document.querySelector('#timer').classList.add("seconds-anim");
        setTimeout(function () {
            document.querySelector('#timer').classList.remove("seconds-anim");
        }, 900);
        if (this._seconds <= 3 && this._seconds > 0) {
            document.querySelector('#timer').classList.add("out-of-time");
            setTimeout(function () {
                document.querySelector('#timer').classList.remove("out-of-time");
            }, 900);

        }
        if (this._seconds == 0) {
            document.querySelector('#timer').classList.add("no-time-left");
            setTimeout(function () {
                document.querySelector('#timer').classList.remove("no-time-left");
            }, 2000);
        }
    }

    //#endregion

    //#region Records

    displayRecords() {
        let records = JSON.parse(localStorage.getItem("clickerRecords")) ?? [0, 0, 0, 0, 0];
        let recordsPanel = document.querySelector('.records-panel');
        recordsPanel.innerHTML = "";

        for (let i = 0; i < records.length; i++) {
            let li = document.createElement("li");
            li.append(`${records[i]} clicks`);
            recordsPanel.append(li);
        }
    }

    _writeNewRecord(value) {
        let records = JSON.parse(localStorage.getItem("clickerRecords")) ?? [0, 0, 0, 0, 0];
        
        records.push(value);
        records.sort((a, b) => b - a);
        records.pop();

        localStorage.setItem("clickerRecords", JSON.stringify(records));

        this.displayRecords();
    }

    //#endregion
}

let game = new Game(+document.querySelector("#setTimer").value || 10);
game.activateButton();
game.displayRecords();

document.querySelector('#setTimer').addEventListener("input", function () {
    game = new Game(+this.value || 10);
    game.activateButton();
});