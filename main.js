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

        })
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