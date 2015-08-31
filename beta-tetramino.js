function Tetris()
{
    /* Tetris API */
    var gameController = new GameController();

    function start()
    {
        gameController.startGame();
    }

    function pause()
    {
        gameController.pauseGame();
    }

    function stop()
    {
        gameController.stopGame()
    }
}

function GameController()
{
    // Connects browser and game
    this.state = "unready";

    this.prepare = function()
    {
        this.field = new Field();
        this.terominoes = new Tetrominoes();
        this.brick_generator = new BrickGenerator(this.terominoes);
        this.game = new Game(this.brick_generator);
        this.state = "prepared"
    };

    this.startGame = function()
    {
        field.clear();
        this.game.setCallback(this.game.fieldUpdated, this.updateField(this.game.gameField));
        this.game.setCallback(this.game.gameEnded, this.gameOver());
        this.game.prepare();
        this.game.start();
        this.state = "started"
    };

    this.stopGame = function()
    {
        this.game.stop();
        this.game.removeCallbacks();
        this.state = "stopped";
    };

    this.pauseGame = function()
    {
        this.game.pause();
        this.state = "stopped";
    };
}

function Game()
{
    // Tetris game itself. Doesn't require any
}