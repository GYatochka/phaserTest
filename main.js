
let isMuted = false;
let button;
let score = 0;
let time = 30;
let game;
let music;
let selectMus;
let killGem;
let scoreText;

let gameOptions = {
    gemSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 100,
        y: 50,
    }
};

window.onload = function(){
    let gameConfig = {
        width: 900,
        heigth: 900,
        scene : playGame, 
        backgroundColor: 0x222222 
    }
    music = new AudioContext();
    selectMus = new AudioContext();
    killGem = new AudioContext();
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};
let donuts = ["red","blue","green","tier",'yellow',"pink"];

class mainMenu extends Phaser.Scene{
    constructor(){
        super("Menu")
    };
    preload(){

        this.load.image("background", "assets/images/backgrounds/background.jpg");
        this.load.image("play", "assets/btn-play.png");
        this.load.image("logo", "assets/donuts_logo.png");
        this.load.image("donut", "assets/donut.png");
        this.load.audio("bgMusic", "assets/audio/background.mp3");
    }

    create(){
        this.background = this.add.tileSprite(0, 0, 900, 900, "background");
        music = this.sound.play("bgMusic", {loop:true});
        this.add.sprite(400, 400, "play");
        scene.add(playGame);
    }

}

class playGame extends Phaser.Scene{
   
    constructor(){
        super("PlayGame")
    };
    
    preload(){
        this.load.image("background", "assets/images/backgrounds/background.jpg"); 
        this.load.image("red", "assets/images/game/gem-01.png");
        this.load.image("blue", "assets/images/game/gem-02.png");
        this.load.image("green", "assets/images/game/gem-03.png");
        this.load.image("tier", "assets/images/game/gem-04.png");
        this.load.image("yellow", "assets/images/game/gem-05.png");
        this.load.image("pink", "assets/images/game/gem-06.png");
        this.load.audio("bgMusic", "assets/audio/background.mp3");
        this.load.audio("kill", "assets/audio/kill.mp3");
        this.load.audio("select", "assets/audio/select-1.mp3");

       /*  this.load.image("multi", "assets/images/game/gem-07.png");
        this.load.image("cross", "assets/images/game/gem-08.png");

        this.load.image("vertical", "images/game/gem-09.png");
        this.load.image("horizontal", "images/game/gem-10.png");
        this.load.image("time", "images/game/gem-11.png");
        this.load.image("double", "images/game/gem-12.png");
        this.load.image("gShadow", "images/game/shadow.png");*/
    };
    
    create(){
        this.background = this.add.tileSprite(0, 0, 900, 900, "background");
        
        this.background.setOrigin(0, 0);
        if(isMuted)
        {music = this.sound.play("bgMusic", {loop:true});}
        this.match3 = new Match3({
            rows: 7,
            columns: 7,
            items: 6
        });
        this.match3.generateField();
        this.canPick = true;
        this.dragging = false;
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this);
    }
    
    drawField(){
        this.poolArray = [];
        scoreText = this.add.text(20, 20, `Score: ${score}`, {
            font: "25px Arial",
            fill: "black",
            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
          });

        for(let i = 0; i < this.match3.getRows(); i ++){
            for(let j = 0; j < this.match3.getColumns(); j ++){
                let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
                let gem = this.add.sprite(gemX, gemY, donuts[this.match3.valueAt(i, j)]);
                this.match3.setCustomData(i, j, gem);
            }
        }
    }
    gemSelect(pointer){
        if(this.canPick){
            this.dragging = true;
            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
            if(this.match3.validPick(row, col)){
                let selectedGem = this.match3.getSelectedItem();
                if(!selectedGem){
                    this.match3.customDataOf(row, col).setScale(1.2);
                    this.match3.customDataOf(row, col).setDepth(1);
                    this.match3.setSelectedItem(row, col);
                }
                else{
                    if(this.match3.areTheSame(row, col, selectedGem.row, selectedGem.column)){
                        this.match3.customDataOf(row, col).setScale(1);
                        this.match3.deleselectItem();
                    }
                    else{
                        if(this.match3.areNext(row, col, selectedGem.row, selectedGem.column)){
                            this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
                            this.match3.deleselectItem();
                            this.swapGems(row, col, selectedGem.row, selectedGem.column, true);
                        }
                        else{
                            this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
                            this.match3.customDataOf(row, col).setScale(1.2);
                            this.match3.setSelectedItem(row, col);
                        }
                    }
                }
            }
        }
    }
    swapGems(row, col, row2, col2, swapBack){
        let movements = this.match3.swapItems(row, col, row2, col2);
        this.swappingGems = 2;
        this.canPick = false;
        movements.forEach(function(movement){
            this.tweens.add({
                targets: this.match3.customDataOf(movement.row, movement.column),
                x: this.match3.customDataOf(movement.row, movement.column).x + gameOptions.gemSize * movement.deltaColumn,
                y: this.match3.customDataOf(movement.row, movement.column).y + gameOptions.gemSize * movement.deltaRow,
                duration: gameOptions.swapSpeed,
                callbackScope: this,
                onComplete: function(){
                    this.swappingGems --;
                    if(this.swappingGems == 0){
                        if(!this.match3.matchInBoard()){
                            if(swapBack){
                                this.swapGems(row, col, row2, col2, false);
                            }
                            else{
                                this.canPick = true;
                            }
                        }
                        else{
                            this.handleMatches();
                        }
                    }
                }
            })
        }.bind(this))
    }

    handleMatches(){
        let gemsToRemove = this.match3.getMatchList();
        let destroyed = 0;
        gemsToRemove.forEach(function(gem){
            this.poolArray.push(this.match3.customDataOf(gem.row, gem.column))
            destroyed ++;
            this.tweens.add({
                targets: this.match3.customDataOf(gem.row, gem.column),
                alpha: 0,
                duration: gameOptions.destroySpeed,
                callbackScope: this,
                onComplete: function(event, sprite){
                    destroyed --;
                    if(destroyed == 0){
                        this.makeGemsFall();

                    }
                }
            });
        }.bind(this));
    }
    makeGemsFall(){
        let moved = 0;
        this.match3.removeMatches();
        let fallingMovements = this.match3.arrangeBoardAfterMatch();
        fallingMovements.forEach(function(movement){
            moved ++;
            this.tweens.add({
                targets: this.match3.customDataOf(movement.row, movement.column),
                y: this.match3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        this.endOfMove()
                    }
                }
            })
        }.bind(this));

        let replenishMovements = this.match3.replenishBoard();
       
        replenishMovements.forEach(function(movement){
            moved ++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
            sprite.setTexture(donuts[this.match3.valueAt(movement.row, movement.column)]);
            this.match3.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        this.endOfMove()
                    }
                }
            });
        }.bind(this))
    }
    endOfMove(){
        if(this.match3.matchInBoard()){
            this.time.addEvent({
                delay: 250,
                callback: this.handleMatches()
            });
        }
        else{
            this.canPick = true;
            this.selectedGem = null;
        }
    }
}

class Match3{

    // constructor, simply turns obj information into class properties
    constructor(obj){
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    // generates the game field
    generateField(){
        this.gameArray = [];
        this.selectedItem = false;
        for(let i = 0; i < this.rows; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.columns; j ++){
                do{
                    let randomValue = Math.floor(Math.random() * this.items);
                    this.gameArray[i][j] = {
                        value: randomValue,
                        isEmpty: false,
                        row: i,
                        column: j
                    }
                } while(this.isPartOfMatch(i, j));
            }
        }
    }

    // returns true if there is a match in the board
    matchInBoard(){
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfMatch(i, j)){
                    return true;
                }
            }
        }
        return false;
    }

    // returns true if the item at (row, column) is part of a match
    isPartOfMatch(row, column){
        return this.isPartOfHorizontalMatch(row, column) || this.isPartOfVerticalMatch(row, column);
    }

    // returns true if the item at (row, column) is part of an horizontal match
    isPartOfHorizontalMatch(row, column){
        return this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column - 2) ||
                this.valueAt(row, column) === this.valueAt(row, column + 1) && this.valueAt(row, column) === this.valueAt(row, column + 2) ||
                this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column + 1);
    }

    // returns true if the item at (row, column) is part of an horizontal match
    isPartOfVerticalMatch(row, column){
        return this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row - 2, column) ||
                this.valueAt(row, column) === this.valueAt(row + 1, column) && this.valueAt(row, column) === this.valueAt(row + 2, column) ||
                this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row + 1, column)
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    valueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returns true if the item at (row, column) is a valid pick
    validPick(row, column){
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // returns the number of board rows
    getRows(){
        return this.rows;
    }

    // returns the number of board columns
    getColumns(){
        return this.columns;
    }

    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData){
        this.gameArray[row][column].customData = customData;
    }

    // returns the custom data of the item at (row, column)
    customDataOf(row, column){
        return this.gameArray[row][column].customData;
    }

    // returns the selected item
    getSelectedItem(){
        return this.selectedItem;
    }

    // set the selected item as a {row, column} object
    setSelectedItem(row, column){
        this.selectedItem = {
            row: row,
            column: column
        }
        selectMus = game.sound.play("select");
    }

    // deleselects any item
    deleselectItem(){
        this.selectedItem = false;
    }

    // checks if the item at (row, column) is the same as the item at (row2, column2)
    areTheSame(row, column, row2, column2){
        return row == row2 && column == column2;
    }

    // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally or vertically
    areNext(row, column, row2, column2){
        return Math.abs(row - row2) + Math.abs(column - column2) == 1;
    }

    // swap the items at (row, column) and (row2, column2) and returns an object with movement information
    swapItems(row, column, row2, column2){
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
        return [{
            row: row,
            column: column,
            deltaRow: row - row2,
            deltaColumn: column - column2
        },
        {
            row: row2,
            column: column2,
            deltaRow: row2 - row,
            deltaColumn: column2 - column
        }]
    }

    // return the items part of a match in the board as an array of {row, column} object
    getMatchList(){
        let matches = [];
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfMatch(i, j)){
                    matches.push({
                        row: i,
                        column: j
                    });
                }
            }
        }
        return matches;
    }

    // removes all items forming a match
    removeMatches(){
        let matches = this.getMatchList();
        score += 10 * matches.length;
        scoreText.setText(`Score: ${score}`)
        console.log("score: " + score);
        killGem = game.sound.play("kill");
        matches.forEach(function(item){
            this.setEmpty(item.row, item.column)
        }.bind(this))
    }

    // set the item at (row, column) as empty
    setEmpty(row, column){
        this.gameArray[row][column].isEmpty = true;
    }

    // returns true if the item at (row, column) is empty
    isEmpty(row, column){
        return this.gameArray[row][column].isEmpty;
    }

    // returns the amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, column){
        let result = 0;
        if(row != this.getRows()){
            for(let i = row + 1; i < this.getRows(); i ++){
                if(this.isEmpty(i, column)){
                    result ++;
                }
            }
        }
        return result;
    }

    // arranges the board after a match, making items fall down. Returns an object with movement information
    arrangeBoardAfterMatch(){
        let result = []
        for(let i = this.getRows() - 2; i >= 0; i --){
            for(let j = 0; j < this.getColumns(); j ++){
                let emptySpaces = this.emptySpacesBelow(i, j);
                if(!this.isEmpty(i, j) && emptySpaces > 0){
                    this.swapItems(i, j, i + emptySpaces, j)
                    result.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces,
                        deltaColumn: 0
                    });
                }
            }
        }
        return result;
    }

    // replenished the board and returns an object with movement information
    replenishBoard(){
        let result = [];
        for(let i = 0; i < this.getColumns(); i ++){
            if(this.isEmpty(0, i)){
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for(let j = 0; j < emptySpaces; j ++){
                    let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces,
                        deltaColumn: 0
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}


