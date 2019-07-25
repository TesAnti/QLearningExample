class Border {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.disabled = false;

    }

    isClicked(x_, y_) {
        if (this.disabled) return false;
        return (((x_ >= this.x) && (x_ <= this.w + this.x)) && ((y_ >= this.y) && (y_ <= this.h + this.y)));
    }
    debug() {
        if (this.disabled) return;
        fill(0, 0, 0, 0);
        rectMode(CORNER);
        rect(this.x, this.y, this.w, this.h);
    }

}
class Figure {
    constructor(border, symbol) {
        this.border = border;
        this.symbol = symbol;
        this.border = border;

    }
    draw() {
        image(this.symbol, this.border.x, this.border.y);
    }
}
class Game {

    constructor() {
        createCanvas(314, 401);
        this.cross = loadImage("images/cross.png");
        this.round = loadImage("images/round.png");
        this.bg = loadImage("images/background.jpg");
        this.grid = loadImage("images/field.png");
        this.line = loadImage("images/line.png");
        this.tie = loadImage("images/standoff.png");

        this.movesLeft = 9;
        this.positions = [
            new Border(30, 60, 85, 85), new Border(115, 60, 85, 85), new Border(200, 60, 85, 85),
            new Border(30, 145, 85, 85), new Border(115, 145, 85, 85), new Border(200, 145, 85, 85),
            new Border(30, 230, 85, 85), new Border(115, 230, 85, 85), new Border(200, 230, 85, 85),

        ];
        this.figures = [null, null, null,
            null, null, null,
            null, null, null
        ];

        this.currentSymbol = this.cross;
        this.ended = false;
        this.isTie = false;
        this.winVector = null;
        this.winPos = null;


        this.nextMoveCallback = null;
        this.gameOverCallback = null;
    }

    registerNextMoveCallback(callback) {
        this.nextMoveCallback = callback;
        this.nextMoveCallback("x");
    }
    registerGameOverCallback(callback) {
        this.gameOverCallback = callback;
    }

    serializeBoard() {
        var res = "";
        for (var n = 0; n < 9; n++) {
            if (this.figures[n] == null) res += " ";
            else if (this.figures[n].symbol == this.cross) res += "x";
            else res += "o";
        }
        return res;
    }

    cellNum(pos) {
        return pos.y * 3 + pos.x;
    }

    checkLine(vector, pos, symbol) {
        let count = 0;
        for (var n = 0; n < 3; n++) {
            let cell = this.cellNum(pos);
            let figure = this.figures[cell];
            if (figure == null) continue;
            if (figure.symbol == symbol) count++;
            pos.add(vector);
        }
        if (count == 3) return true;
        return false;
    }

    checkWin(symbol) {
        //horizontal lines
        for (var n = 0; n < 3; n++) {
            if (this.checkLine(createVector(1, 0), createVector(0, n), symbol)) {
                let p = this.cellNum(createVector(0, n));
                this.winPos = createVector(this.positions[p].x, this.positions[p].y + this.positions[p].h / 2);
                this.winVector = createVector(1, 0);
                return true;
            }
        }
        //vertical lines
        for (var n = 0; n < 3; n++) {
            if (this.checkLine(createVector(0, 1), createVector(n, 0), symbol)) {
                let p = this.cellNum(createVector(n, 0));
                this.winPos = createVector(this.positions[p].x + this.positions[p].w / 2, this.positions[p].y);
                this.winVector = createVector(0, 1);
                return true;
            }
        }
        //diagonals
        if (this.checkLine(createVector(1, 1), createVector(0, 0), symbol)) {
            let p = this.cellNum(createVector(0, 0));
            this.winPos = createVector(this.positions[p].x + this.positions[p].w / 2, this.positions[p].y + this.positions[p].h / 2);
            this.winVector = createVector(1, 1);
            return true;
        }
        if (this.checkLine(createVector(1, -1), createVector(0, 2), symbol)) {
            let p = this.cellNum(createVector(0, 2));
            this.winPos = createVector(this.positions[p].x + this.positions[p].w / 2, this.positions[p].y + this.positions[p].h / 2);
            this.winVector = createVector(1, -1);
            return true;
        }
        return false;
    }

    render() {
        image(this.bg, 0, 0);
        image(this.grid, 10, 40);

        
        for (var n in this.figures) {
            if (this.figures[n] == null) continue;
            this.figures[n].draw();
        }


        if (this.ended && this.winPos != null) {
            let v1 = createVector(0, 1);
            let v2 = this.winVector;
            let angle = -v1.angleBetween(v2);

            translate(this.winPos.x, this.winPos.y);
            rotate(angle);
            image(this.line, 0, 0);
            resetMatrix();
        }
        if (this.isTie) {
            image(this.tie, 30, 270);
        }
    }
    makeMove(index) {
        if (this.ended) return;
        this.figures[index] = new Figure(this.positions[index], this.currentSymbol);
        this.positions[index].disabled = true;
        if (this.currentSymbol == this.cross) {
            this.currentSymbol = this.round;

        } else {
            this.currentSymbol = this.cross;
        }
        if (this.checkWin(this.cross)) {
            this.ended = true;
            this.gameOverCallback("x");
        }
        if (this.checkWin(this.round)) {
            this.ended = true;
            this.gameOverCallback("o");
        }
        this.movesLeft--;
        if (!this.ended && this.movesLeft == 0) {
            this.ended = true;
            this.isTie = true;
            this.gameOverCallback("tie");
        }
        if (!this.ended && this.nextMoveCallback != null) {
            if (this.currentSymbol == this.cross) this.nextMoveCallback("x");
            else this.nextMoveCallback("o");
        }
    }
    click(x, y) {
        for (var n in this.positions) {
            if (this.positions[n].isClicked(x, y)) {
                this.makeMove(n);

            }
        }

    }


}