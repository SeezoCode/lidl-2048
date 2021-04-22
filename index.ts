
// let gameFields = document.querySelectorAll('.gameFields')


class Game {
    private table: number[][];
    private history: any[][][];
    disabled: boolean = false
    constructor() {
        this.table = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        this.history = []
        this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        // this.randomlySpawn()
        this.mountUi()
        this.updateFields()
    }

    mountUi() {
        let up = () => {this.handleWay('up'); this.updateFields()}
        let down = () => {this.handleWay('down'); this.updateFields()}
        let left = () => {this.handleWay('left'); this.updateFields()}
        let right = () => {this.handleWay('right'); this.updateFields()}
        let goBack = () => this.goBack()
        let repl = () => replay(this.history)
        document.getElementById('up').addEventListener('click', () => up())
        document.getElementById('down').addEventListener('click', () => down())
        document.getElementById('left').addEventListener('click', () => left())
        document.getElementById('right').addEventListener('click', () => right())

        document.getElementById('back').addEventListener('click', () => goBack())


        document.body.addEventListener("keydown", event => {
            let prevent = false
            if (event.key === 'ArrowUp') up()
            else if (event.key === 'ArrowDown') down()
            else if (event.key === 'ArrowLeft') left()
            else if (event.key === 'ArrowRight') right()
            else prevent = true
            if (!prevent) event.preventDefault()
            console.log(event.key)
        })

        document.getElementById('replay').addEventListener('click', () => repl())

    }

    hasEmptySpace(): boolean {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (!this.table[col][row]) return true
            }
        }
        return false
    }

    randomlySpawn() {
        const y = Math.floor(Math.random() * 4)
        const x = Math.floor(Math.random() * 4)
        if (this.table[y][x] && this.hasEmptySpace()) return this.randomlySpawn()
        else if (this.hasEmptySpace()) this.table[y][x] = 2
        else this.endGame()
    }

    handleWay(way: string) {
        for (let i = 0; i < 4; i++) {
            if (way === 'up') this.moveUp()
            if (way === 'down') this.moveDown()
            if (way === 'left') this.moveLeft()
            if (way === 'right') this.moveRight()
        }
        this.randomlySpawn()
    }

    moveUp() {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (col != 0) {
                    if (this.table[col][row] === this.table[col - 1][row]) {
                        this.table[col - 1][row] = this.table[col - 1][row] * 2
                        this.table[col][row] = 0
                    }
                    else if (this.table[col - 1][row] === 0) {
                        this.table[col - 1][row] = this.table[col][row]
                        this.table[col][row] = 0
                    }
                }
            }
        }
    }

    moveDown() {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (col != 3) {
                    if (this.table[col][row] === this.table[col + 1][row]) {
                        this.table[col + 1][row] = this.table[col + 1][row] * 2
                        this.table[col][row] = 0
                    }
                    else if (this.table[col + 1][row] === 0) {
                        this.table[col + 1][row] = this.table[col][row]
                        this.table[col][row] = 0
                    }
                }
            }
        }
    }

    moveLeft() {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (row != 0) {
                    if (this.table[col][row] === this.table[col][row - 1]) {
                        this.table[col][row - 1] = this.table[col][row - 1] * 2
                        this.table[col][row] = 0
                    }
                    else if (this.table[col][row - 1] === 0) {
                        this.table[col][row - 1] = this.table[col][row]
                        this.table[col][row] = 0
                    }
                }
            }
        }
    }

    moveRight() {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (row != 3) {
                    if (this.table[col][row] === this.table[col][row + 1]) {
                        this.table[col][row + 1] = this.table[col][row + 1] * 2
                        this.table[col][row] = 0
                    }
                    else if (this.table[col][row + 1] === 0) {
                        this.table[col][row + 1] = this.table[col][row]
                        this.table[col][row] = 0
                    }
                }
            }
        }
    }

    pushHistory() {
        let arr = [[],[],[],[]]
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                let table = this.table[col][row]
                arr[col].push(table)
            }
        }
        this.history.push(arr)
        console.log(this.history)
    }

    goBack() {
        this.history.pop()
        this.table = this.history[this.history.length - 1]
        this.updateFields(false)
    }

    get score(): number {
        let sco = 0
        this.table.forEach((arr) => {
            arr.forEach((val) => sco += val)
        })
        return sco
    }

    endGame() {
        if (this.disabled) return
        console.log(this.history)
        let obj = {
            // @ts-ignore
            name: document.getElementById('name').value ?? 'Pepege',
            score: this.score,
            history: this.history
        }
        let storage = window.localStorage.getItem('arr')
        if (storage) {
            let s = JSON.parse(storage)
            s.push(obj)
            window.localStorage.setItem('arr', JSON.stringify(s))
        }
        else {
            window.localStorage.setItem('arr', JSON.stringify([]))
            this.endGame()
        }
        showScoreTable()

        this.disabled = true
        new Game()
    }

    updateFields(history: boolean = true) {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                if (col === 0 || col === 2) {
                    document.querySelector(`.fieldDiv` + ((col * 4 + row) + 1)).innerHTML = this.table[col][row].toString()
                }
                else {
                    let table = this.table[col].reverse()
                    document.querySelector(`.fieldDiv` + ((col * 4 + row) + 1)).innerHTML = table[row].toString()
                    this.table[col].reverse()
                }
            }
        }
        if (history) this.pushHistory()
        document.getElementById('score').innerHTML = 'Score: ' + this.score.toString()
    }
}

function highScore(score: number, name: string) {
    window.localStorage.push({
        name: name,
        score: score
    })
}

function buildScore(score: string, name: string, position: string, history: Array<Array<Array<number>>>) {
    let pos = 'rep' + position
    return `<tr><td>${position}</td><td>${name}</td><td>${score}</td><td><button class={pos}>Replay</button></td></tr>`
}

var hist

function showScoreTable() {
    let table = document.querySelector("table")
    table.innerHTML = ''
    table.innerHTML += `<tr><td>Position</td><td>Name</td><td>Score</td><td>Replay</td></tr>`

    let storage = window.localStorage.getItem("arr")
    if (storage) {
        let s = JSON.parse(storage)
        hist = s
        s.sort((a, b) => (a.score > b.score) ? -1 : 1)
        for (let i = 0; i < s.length; i++) {
            table.innerHTML += buildScore(s[i].score.toString(), s[i].name, i.toString(), s[i].history)

            // @ts-ignore
            // document.querySelector('rep' + 0).setAttribute('onClick',  () => replay(s[i].history))
        }
    }
}


function replay(arr: Array<Array<Array<number>>>) {
    console.log(arr)
    let currentFrame = 0;
    setInterval(() => {
        if (currentFrame != arr.length) display(arr[currentFrame])
        currentFrame++
    }, 1000)
}

function display(table: Array<Array<number>>) {
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            if (col === 0 || col === 2) {
                document.querySelector(`.fieldDiv` + ((col * 4 + row) + 1)).innerHTML = table[col][row].toString()
            }
            else {
                let t = table[col].reverse()
                document.querySelector(`.fieldDiv` + ((col * 4 + row) + 1)).innerHTML = t[row].toString()
                table[col].reverse()
            }
        }
    }
}
// window.localStorage.setItem("arr", JSON.stringify([]))
showScoreTable()
let game = new Game()

document.getElementById('newGame').addEventListener('click', () => {
    // delete game
    game = new Game()
})
