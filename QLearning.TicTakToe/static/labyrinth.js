
const FLOOR = 0;
const W = 2;//win
const L = 3;//loose


class Labyrinth {
    

    constructor() {

        this.room = [
            [ 0, 0, 0, 0, W],
            [ 0, 0, L, 0, 0],
            [ 0, 0, 0, 0, L],
            [ 0, 0, 0, L, 0],
            [ 0, 0, 0, 0, L],
        ];

        this.overlay = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        this.char = loadImage("l_images/idle_000.png");

        this.posX = 0;
        this.posY = 2;
        
        this.scoreCallback = null;

        

    }

    setOverlay(overlay) {
        this.overlay = overlay;
    }
    

    setScoreCallback(callback) {
        this.scoreCallback = callback;
        
    }

    gameOver(score) {
        
        this.addScore(score);

        //reset char position
        this.posX = 0;
        this.posY = 2;

        
    }

    getCurrentState() {
        return this.posY * 10 + this.posX;
    }

    addScore(score) {
        var newState = this.getCurrentState();
        var prevState = this.prevY * 10 + this.prevX;
        this.scoreCallback(newState, prevState,this.lastAction,score);
    }

    checkPosition() {
        var currentCell = this.room[this.posY][this.posX];
        if (currentCell == W) this.gameOver(10);
        if (currentCell == L) this.gameOver(-10);
        if (currentCell == FLOOR) {
            this.addScore(-1);
        }
    }

    makeMove(move) {
        this.prevX = this.posX;
        this.prevY = this.posY;
        this.lastAction = move;
        switch (move) {
            case "up":
                if (this.posY == 0) {
                    this.gameOver(-10);
                    return;
                }
                this.posY--;
                break;
            case "down":
                if (this.posY == 4) {
                    this.gameOver(-10);
                    return;
                }
                this.posY++;
                break;
            case "left":
                if (this.posX == 0) {
                    this.gameOver(-10);
                    return;
                }
                this.posX--;
                break;
            case "right":
                if (this.posX == 4) {
                    this.gameOver(-10);
                    return;
                }
                this.posX++;
                break;

                
        }
        this.checkPosition();
    }

    render() {
        for (var y = 0; y < this.room.length; y++) {
            for (var x = 0; x < this.room[y].length;x++) {
                if (this.room[y][x]==FLOOR) {
                    fill(50, 50, 50);
                }
                if (this.room[y][x] == W) {
                    fill(0, 0, 100);
                }
                if (this.room[y][x] == L) {
                    fill(0, 0, 0);
                }
                rect(x * 50, y * 50, 50, 50);
                if (this.overlay[y][x] < 0) {
                    fill(255, 0, 0, min(255, this.overlay[y][x] * -10));
                    rect(x * 50, y * 50, 50, 50);
                    
                }
                if (this.overlay[y][x] > 0) {
                    fill(0, 255, 0, min(255, this.overlay[y][x] * 10));
                    rect(x * 50, y * 50, 50, 50);
                    
                }
            }
        }
        this.char.resize(0, 32);
        image(this.char, this.posX*50+10, this.posY*50+5);
    }

}