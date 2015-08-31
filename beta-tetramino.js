function Game()
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
    this.field = new Field();

    function startGame()
    {
        field.clear();
        this.terominoes = new Tetrominoes();
        this.brick_generator = new BrickGenerator(this.terominoes);
        this.game_field = new GameField(this.brick_generator);

    }

    function stopGame()
    {

    }
}