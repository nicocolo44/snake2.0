
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const score = document.getElementById('score')

let scoreCount = 0;
score.innerHTML = scoreCount;
const BLOCK_SIZE = 20
const BOARD_WIDTH = 30
const BOARD_HEIGHT = 30

let POS_X = 0
let POS_Y = 0

let dropCounter = 0;
let last_time = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT


context.scale(BLOCK_SIZE, BLOCK_SIZE)

let board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
function createBoard(height, width) {
    const board = []
    while (height--) {
        board.push(new Array(width).fill(0))
    }
    return board
}

function update(time = 0) {
    draw()
    const deltaTime = time - last_time;
    last_time = time;
    dropCounter += deltaTime;
    if (dropCounter > 150) {
        moveSnake();
        dropCounter = 0;
        if (detectCollisions()) {
            gameOver();
        }
    }
    detectFood()
    updateBoard()
    window.requestAnimationFrame(update)
}

function draw() {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'red'   
                context.fillRect(x, y, 1, 1)
            } else if (value === 2) {
                context.fillStyle = 'blue'
                context.fillRect(x, y, 1, 1)
            }
        })
    })
}


function makeFood() {
    const food = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT)
    }
    if (board[food.y][food.x] !== 0) {
        return makeFood()
    }
    return food
}

const snake = {
    head: {
        x: 0,
        y: 0
    },
    tail: [],
    direction: {
        x: 1,
        y: 0
    },
    eat: false
}


function moveSnake() {
    snake.tail.push({ ...snake.head })
    if (!snake.eat) {
        let last_tail = snake.tail.shift()
        board[last_tail.y][last_tail.x] = 0
    } else {
        snake.eat = false
    }
    snake.head.x += snake.direction.x
    snake.head.y += snake.direction.y
}


function detectCollisions() {
    if (snake.head.x >= BOARD_WIDTH || snake.head.x < 0 || snake.head.y >= BOARD_HEIGHT || snake.head.y < 0) {
        return true
    }
    if (board[snake.head.y][snake.head.x] === 1) {
        return true
    }
    return false
}


function detectFood() {
    if (board[snake.head.y][snake.head.x] === 2) {
        snake.eat = true
        food = makeFood()
        board[food.y][food.x] = 2
        scoreCount += 1;
        score.innerHTML = scoreCount;
    }
}


function updateBoard() {
    board[snake.head.y][snake.head.x] = 1
    snake.tail.forEach((segment) => {
        board[segment.y][segment.x] = 1
    })
    board[food.y][food.x] = 2
}




document.addEventListener('keydown', (event) => {
    let changeDirection = false;
    if ((event.keyCode === 37 || event.keyCode === 65) && snake.direction.x === 0) {
        snake.direction = {
            x: -1,
            y: 0
        }
        changeDirection = true;
    }
    if ((event.keyCode === 38 || event.keyCode === 87) && snake.direction.y === 0) {
        snake.direction = {
            x: 0,
            y: -1
        }
        changeDirection = true;
    }
    if ((event.keyCode === 39 || event.keyCode === 68) && snake.direction.x === 0) {
        snake.direction = {
            x: 1,
            y: 0
        }
        changeDirection = true;
    }
    if ((event.keyCode === 40 || event.keyCode === 83) && snake.direction.y === 0) {
        snake.direction = {
            x: 0,
            y: 1
        }
        changeDirection = true;
    }
    if (changeDirection) {
        moveSnake();
        dropCounter = 0;
        if (detectCollisions()) {
            gameOver();
        }
    }
})

function gameOver() {
    window.alert("Game Over")
    board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
    snake.head = { x: 0, y: 0 };
    snake.tail = [];
    snake.direction = { x: 0, y: 0 };
    scoreCount = 0;
    score.innerHTML = scoreCount;
}



let food = makeFood()
board[food.y][food.x] = 2
moveSnake();

update();




