let SCORE = 0;
let TIME = 30;
let game;
let gameOptions = {
    gemSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffser: {
        x: 50,
        y: 50,
    }
};

window.onload = function(){
    let gameConfig = {
        width: 900,
        heigth: 900,
        scene : playGame,  
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame")
    };
    
    preload(){
        this.load.spritesheet("red", "images/game/gem-01.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("blue", "images/game/gem-02.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("green", "images/game/gem-03.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("tier", "images/game/gem-04.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("yellow", "images/game/gem-05.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("pink", "images/game/gem-06.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        }); this.load.spritesheet("multi", "images/game/gem-07.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("cross", "images/game/gem-08.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("vertical", "images/game/gem-09.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("horizontal", "images/game/gem-   10.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("time", "images/game/gem-11.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("double", "images/game/gem-12.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.spritesheet("gShadow", "images/game/shadow.png",{
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
    };
    create(){
        this.match3 = new Match3({
            rows: 8,
            columns: 7,
            items: 6
        });
        this.match3 = generateField();
        this.canPick = true;
        this.dragging = false;
        this. drawField();
        this.input.on("pointerdown", this.gemSelect, this);
    }
    drawField(){
        this.poolArray = [];
        for(let i = 0;i <this.match3.getRows(); i++){
            for(let j = 0; j< this.match3.getColumns(); j++){
                let gemX = gameOptions.boardOffser.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let gemY = gameOptions.boardOffser.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;
                let gem = this.add.sprite(gemX, gemY,"", this.match3.valueAt(i, j));
                this.match3.setCustomData(i,j,gem);
            }
        }
    }
    generateField(){
        //function to generate gems
    }
    gemSelect(){
        //function to select gems
    }
}

class Match3{
    constructor(obj){
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    //generates the game field
    generateField(){
        this.gameArray = [];
        this.selectedItem = false;
        for(let i = 0; i< this.rows; i++){
            this.gameArray[i] = [];
            for(let j = 0; j< this.columns; j++){
                do{let randomValue = Math.floor(Math.random() * this.item);
                this.gameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                }}while(this.isPartOfMatch(i,j));
            }
        }
    }

    // return true if there is a match in the board
    matchInBoard(){
        for(let i = 0; i<this.rows; i++){
            for(let j = 0; j< this.columns; j++ ){
                if(this.isPartOfMatch(i,j)){
                    return true;
                }
            }
        }
        return false;
    }

    // return true if the item at current position(row, column) is a part of match
    isPartOfMatch(row, column){
        return this.isPartOfHorizontalMatch(row, column) || this.isPartOfVerticalMatch(row, column);
    }

    // return true if the item is part of horizontal match
    isPartOfHorizontalMatch(row, column){
        return this.valueAt(row, column) === this.valueAt(row, column-1)&& this.valueAt(row, column) === this.valueAt(row, column-2)||
               this.valueAt(row, column) === this.valueAt(row, column+1)&& this.valueAt(row, column) === this.valueAt(row, column+2)||
               this.valueAt(row, column) === this.valueAt(row, column-1)&& this.valueAt(row, column) === this.valueAt(row, column+1);           
    }

    // return true if the item is part of vertical match
    isPartOfHorizontalMatch(row, column){
        return this.valueAt(row, column) === this.valueAt(row-1, column)&& this.valueAt(row, column) === this.valueAt(row-2, column)||
               this.valueAt(row, column) === this.valueAt(row+1, column+1)&& this.valueAt(row, column) === this.valueAt(row+2, column)||
               this.valueAt(row, column) === this.valueAt(row-1, column-1)&& this.valueAt(row, column) === this.valueAt(row+1, column);          
    }

    // return the value of the item at(row, column), if doesn't exist return false
    valueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returb true if item at (row, column) is a valid pick
    validPick(row, column){
        return row>= 0 && row <this.rows && column >= 0 && column < this.columns 
               && this.gameArray[row] != undefined && this.gameArray[column] != undefined;
    }
    // return the number of game rows
    getRows(){
        return this.rows;
    }

    // return the number of game columns
    getColumns(){
        return this.columns;
    }

    // set data of the item at (row, column)
    setCustomData(row, column, customData){
        this.gameArray[row][column].customData = customData;
    }

    // return custom data of the item at (row, column)
    customDataOf(row, column){
        return this.gameArray[row][column].customData;
    }

    // return selected item
    getSelectedItem(){
        return this.selectedItem;
    }

    // set selected item as a (row,column) object
    setSelectedItem(row, column){
        this.selectedItem = {
            row: row, 
            column: column
        }
    }

    //deleselect item
    deleselectedItem(){
        this.selectedItem = false;
    }

    // check if item at (row, colum) are the same as the item at (row2, column2)
    areTheSame(row, colum, row2, column2){
        return row == row2 && colum == column2;
    }

    // return true if two items are next to each other horizontally or vertically
    areNext(row, colum, row2, colum2){
        return Math.abs(row - row2) + Math.abs(colum - colum2) == 1;
    }

    //swap two items and return object with movement info
    swapItems(row, colum, row2, colum2){
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][colum] = Object.assign(this.gameArray[row2][colum2]);
        this.gameArray[row2][colum2] = Object.assign(tempObject);
        return [{
            row: row,
            colum: colum,
            deltaRow: row - row2,
            deltaColumn: colum - column2
        },
        {
           row: row2,
           colum: colum2,
           deltaRow: row2-row,
           deltaColumn: colum2-colum 
        }]
    }

    // return the items part of a match in the board as an array of {row, column} object 
    getMatchList(){
        let matches = [];
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.isPartOfMatch(i,j)){
                    matches.push({
                        row: i,
                        colum: j
                    });
                }
            }
        }
        return matches;
    }

    // remov all items forming a match
    removeMatches(){
        let matches = this.getMatchList();
        matches.forEach(function(item){
            this.setEmpty(item.row, item.colum)
        }.bind(this))
    }

    // set the items at (row, column) as empty
    setEmpty(row, column){
        this.gameArray[row][column].isEmpty = true;
    }

    // return true if the item at (row, column) is empty
    isEmpty(row, colum){
        return this.gameArray[row][colum].isEmpty;
    }

    // return amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, colum){
        let result = 0;
        if(row != this.getRows()){
            for(let i = row + 1; i < this.getRows(); i++){
                if(this.isEmpty(i, colum)){
                    result++;
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

function resize(){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeigth = window.innerHeight;
    var windowRatio = windowWidth / windowHeigth;
    var gameRatio = game.config.width / game.config.heigth;
    if (windowRatio < gameRatio){
        canvas.style.width = windowWidth +"px";
        canvas.style.height = (windowWidth/ gameRatio) +"px";
    }
    else{
        canvas.style.width = (windowHeigth * gameRatio) +"px";
        canvas.style.height = windowHeigth + "px";
    }
};