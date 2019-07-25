let img;
let labyrinth;
let name = "l1";
function setup() {
    createCanvas(500, 500);
    
    labyrinth = new Labyrinth();
    labyrinth.setScoreCallback(learnState)
}

function learnState(newState, prevState, action, score) {
    var self = window;
    $.post("/labyrinth/learn?name=" + name,
        { prevState: prevState, action: action, reward: score, newState: newState },
        function () {
            
            self.updateOverlay(); 
        });
}

function updateOverlay() {
    var self = window;
    $.post("/labyrinth/overlay?name=" + name, function (overlay) {
        labyrinth.setOverlay(JSON.parse(overlay));
        setTimeout(function () { self.predictNextMove(); }, 100);
        
    });
}

function predictNextMove() {
    var self = window;
    var state = labyrinth.getCurrentState().toString();
    $.post("/labyrinth/predict?name=" + name,
            state,
        function (newAction) {
            labyrinth.makeMove(newAction);
        });
}

function draw() {
    labyrinth.render();

}

function mouseClicked() {
    this.predictNextMove();
}