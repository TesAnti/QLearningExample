let game;
let lastState = {};
let lastAction = {};
let firstMoveX;
let firstMoveO;


let oAiEnabled = false;
let xAiEnabled = true;
function predictNextMove(name) {
    lastState[name] = game.serializeBoard();

    $.post('/ttt/predict?name=' + name,
        lastState[name],
        function (data) {
            lastAction[name] = data;
            game.makeMove(data);
        })
}



function nextMove(figure) {
    var newState = game.serializeBoard();
    if (xAiEnabled &&figure == "x") {
        if (!firstMoveX) {
            $.post('/ttt/learn?name='+figure,
                { prevState: lastState[figure], action: lastAction[figure], reward:-1, newState:newState },
                function() {
                    predictNextMove(figure);
                });
        } else {
            firstMoveX = false;
            predictNextMove(figure);
        }
        
    } 
    if (oAiEnabled&&figure == "o") {
        if (!firstMoveO) {
            $.post('/ttt/learn?name=' + figure,
                { prevState: lastState[figure], action: lastAction[figure], reward: -1, newState: newState },
                function () {
                    predictNextMove(figure);
                });
        } else {
            firstMoveO = false;
            predictNextMove(figure);
        }

    } 
}


function gameOver(figure) {
    if (xAiEnabled &&figure != "x") {
        $.post('/ttt/learn?name=x',
            {
                prevState: lastState["x"],
                action: lastAction["x"],
                reward: figure == "tie" ? -5 : -10,
                newState: game.serializeBoard()
            },
            function() {
                //document.location.reload(false);
            });
    }
    if (xAiEnabled &&figure == "x") {
        $.post('/ttt/learn?name=x',
            { prevState: lastState["x"], action: lastAction["x"], reward: 10, newState: game.serializeBoard() },
            function() {
                //document.location.reload(false);
            });
    }
    if (oAiEnabled &&figure != "o") {
        $.post('/ttt/learn?name=o',
            {
                prevState: lastState["o"],
                action: lastAction["o"],
                reward: figure == "tie" ? -5 : -10,
                newState: game.serializeBoard()
            },
            function() {
                //document.location.reload(false);
            });
    }
    if (oAiEnabled &&figure == "o") {
        $.post('/ttt/learn?name=o',
            { prevState: lastState["o"], action: lastAction["o"], reward: 10, newState: game.serializeBoard() },
            function() {
                //document.location.reload(false);
            });
    }
    setTimeout(function() { document.location.reload(false); }, 300);
}

function setup() {
    game = new Game();
    firstMoveX = true;
    firstMoveO = true;
    game.registerNextMoveCallback(nextMove);
    game.registerGameOverCallback(gameOver);
    
}

function draw() {
    game.render();

}

function mouseClicked() {
    game.click(mouseX, mouseY);
}