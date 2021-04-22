// let gameFields = document.querySelectorAll('.gameFields')
var Game = /** @class */ (function () {
    function Game() {
        this.disabled = false;
        this.table = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.history = [];
        this.randomlySpawn();
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        this.mountUi();
        this.updateFields();
    }
    Game.prototype.mountUi = function () {
        var _this = this;
        var up = function () { _this.handleWay('up'); _this.updateFields(); };
        var down = function () { _this.handleWay('down'); _this.updateFields(); };
        var left = function () { _this.handleWay('left'); _this.updateFields(); };
        var right = function () { _this.handleWay('right'); _this.updateFields(); };
        var goBack = function () { return _this.goBack(); };
        var repl = function () { return replay(_this.history); };
        document.getElementById('up').addEventListener('click', function () { return up(); });
        document.getElementById('down').addEventListener('click', function () { return down(); });
        document.getElementById('left').addEventListener('click', function () { return left(); });
        document.getElementById('right').addEventListener('click', function () { return right(); });
        document.getElementById('back').addEventListener('click', function () { return goBack(); });
        document.body.addEventListener("keydown", function (event) {
            var prevent = false;
            if (event.key === 'ArrowUp')
                up();
            else if (event.key === 'ArrowDown')
                down();
            else if (event.key === 'ArrowLeft')
                left();
            else if (event.key === 'ArrowRight')
                right();
            else
                prevent = true;
            if (!prevent)
                event.preventDefault();
            console.log(event.key);
        });
        document.getElementById('replay').addEventListener('click', function () { return repl(); });
    };
    Game.prototype.hasEmptySpace = function () {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (!this.table[col][row])
                    return true;
            }
        }
        return false;
    };
    Game.prototype.randomlySpawn = function () {
        var y = Math.floor(Math.random() * 4);
        var x = Math.floor(Math.random() * 4);
        if (this.table[y][x] && this.hasEmptySpace())
            return this.randomlySpawn();
        else if (this.hasEmptySpace())
            this.table[y][x] = 2;
        else
            this.endGame();
    };
    Game.prototype.handleWay = function (way) {
        for (var i = 0; i < 4; i++) {
            if (way === 'up')
                this.moveUp();
            if (way === 'down')
                this.moveDown();
            if (way === 'left')
                this.moveLeft();
            if (way === 'right')
                this.moveRight();
        }
        this.randomlySpawn();
    };
    Game.prototype.moveUp = function () {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (col != 0) {
                    if (this.table[col][row] === this.table[col - 1][row]) {
                        this.table[col - 1][row] = this.table[col - 1][row] * 2;
                        this.table[col][row] = 0;
                    }
                    else if (this.table[col - 1][row] === 0) {
                        this.table[col - 1][row] = this.table[col][row];
                        this.table[col][row] = 0;
                    }
                }
            }
        }
    };
    Game.prototype.moveDown = function () {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (col != 3) {
                    if (this.table[col][row] === this.table[col + 1][row]) {
                        this.table[col + 1][row] = this.table[col + 1][row] * 2;
                        this.table[col][row] = 0;
                    }
                    else if (this.table[col + 1][row] === 0) {
                        this.table[col + 1][row] = this.table[col][row];
                        this.table[col][row] = 0;
                    }
                }
            }
        }
    };
    Game.prototype.moveLeft = function () {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (row != 0) {
                    if (this.table[col][row] === this.table[col][row - 1]) {
                        this.table[col][row - 1] = this.table[col][row - 1] * 2;
                        this.table[col][row] = 0;
                    }
                    else if (this.table[col][row - 1] === 0) {
                        this.table[col][row - 1] = this.table[col][row];
                        this.table[col][row] = 0;
                    }
                }
            }
        }
    };
    Game.prototype.moveRight = function () {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (row != 3) {
                    if (this.table[col][row] === this.table[col][row + 1]) {
                        this.table[col][row + 1] = this.table[col][row + 1] * 2;
                        this.table[col][row] = 0;
                    }
                    else if (this.table[col][row + 1] === 0) {
                        this.table[col][row + 1] = this.table[col][row];
                        this.table[col][row] = 0;
                    }
                }
            }
        }
    };
    Game.prototype.pushHistory = function () {
        var arr = [[], [], [], []];
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                var table = this.table[col][row];
                arr[col].push(table);
            }
        }
        this.history.push(arr);
        console.log(this.history);
    };
    Game.prototype.goBack = function () {
        this.history.pop();
        this.table = this.history[this.history.length - 1];
        this.updateFields(false);
    };
    Object.defineProperty(Game.prototype, "score", {
        get: function () {
            var sco = 0;
            this.table.forEach(function (arr) {
                arr.forEach(function (val) { return sco += val; });
            });
            return sco;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.endGame = function () {
        var _a;
        if (this.disabled)
            return;
        console.log(this.history);
        var obj = {
            // @ts-ignore
            name: (_a = document.getElementById('name').value) !== null && _a !== void 0 ? _a : 'Pepege',
            score: this.score,
            history: this.history
        };
        var storage = window.localStorage.getItem('arr');
        if (storage) {
            var s = JSON.parse(storage);
            s.push(obj);
            window.localStorage.setItem('arr', JSON.stringify(s));
        }
        else {
            window.localStorage.setItem('arr', JSON.stringify([]));
            this.endGame();
        }
        showScoreTable();
        this.disabled = true;
        new Game();
    };
    Game.prototype.updateFields = function (history) {
        if (history === void 0) { history = true; }
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (col === 0 || col === 2) {
                    document.querySelector(".fieldDiv" + ((col * 4 + row) + 1)).innerHTML = this.table[col][row].toString();
                }
                else {
                    var table = this.table[col].reverse();
                    document.querySelector(".fieldDiv" + ((col * 4 + row) + 1)).innerHTML = table[row].toString();
                    this.table[col].reverse();
                }
            }
        }
        if (history)
            this.pushHistory();
        document.getElementById('score').innerHTML = 'Score: ' + this.score.toString();
    };
    return Game;
}());
function highScore(score, name) {
    window.localStorage.push({
        name: name,
        score: score
    });
}
function buildScore(score, name, position, history) {
    var pos = 'rep' + position;
    return "<tr><td>" + position + "</td><td>" + name + "</td><td>" + score + "</td><td><button class={pos}>Replay</button></td></tr>";
}
var hist;
function showScoreTable() {
    var table = document.querySelector("table");
    table.innerHTML = '';
    table.innerHTML += "<tr><td>Position</td><td>Name</td><td>Score</td><td>Replay</td></tr>";
    var storage = window.localStorage.getItem("arr");
    if (storage) {
        var s = JSON.parse(storage);
        hist = s;
        s.sort(function (a, b) { return (a.score > b.score) ? -1 : 1; });
        for (var i = 0; i < s.length; i++) {
            table.innerHTML += buildScore(s[i].score.toString(), s[i].name, i.toString(), s[i].history);
            // @ts-ignore
            // document.querySelector('rep' + 0).setAttribute('onClick',  () => replay(s[i].history))
        }
    }
}
function replay(arr) {
    console.log(arr);
    var currentFrame = 0;
    setInterval(function () {
        if (currentFrame != arr.length)
            display(arr[currentFrame]);
        currentFrame++;
    }, 1000);
}
function display(table) {
    for (var col = 0; col < 4; col++) {
        for (var row = 0; row < 4; row++) {
            if (col === 0 || col === 2) {
                document.querySelector(".fieldDiv" + ((col * 4 + row) + 1)).innerHTML = table[col][row].toString();
            }
            else {
                var t = table[col].reverse();
                document.querySelector(".fieldDiv" + ((col * 4 + row) + 1)).innerHTML = t[row].toString();
                table[col].reverse();
            }
        }
    }
}
// window.localStorage.setItem("arr", JSON.stringify([]))
showScoreTable();
var game = new Game();
document.getElementById('newGame').addEventListener('click', function () {
    // delete game
    game = new Game();
});
