/**
 * Created by user on 14.03.2015.
 */

function Field()
{
    this.width = 10;
    this.height = 22;
    this.field = new Array(this.height);
    for(var row = 0; row < this.height; ++row)
        this.field[row] = new Array(this.width);

    var rows = document.getElementsByClassName("row");
    for(row = 0; row < this.height; ++row)
    {
        var cells = rows[row].getElementsByClassName("cell");
        for(var cell = 0; cell < this.width; ++cell)
        {
            this.field[row][cell] = cells[cell];
        }
    }

    this.clear = function()
    {
        for(var row = 0; row < this.height; ++row)
            for(var cell = 0; cell < this.width; ++cell)
                this.setColor(cell, row, "");
    };

    this.setColor = function(x, y, color)
    {
        this.field[y][x].style.backgroundColor = color;
    };

    this.getColor = function(x, y)
    {
        return this.field[y][x].style.backgroundColor;
    };

    this.isClear = function(x, y)
    {
        return !this.field[y][x].style.backgroundColor;
    };

    this.isLineFilled = function(y)
    {
        var allFilled = true;
        for(var cell = 0; cell < this.width && allFilled; ++cell)
        {
            if(this.isClear(cell, y)) allFilled = false;
        }
        return allFilled;
    };

    this.clearLine = function(y)
    {
        for(var x = 0; x < this.width; ++x)
        {
            this.setColor(x, y, "");
        }
    };

    this.shiftLines = function(y)
    {
        for(var line = y; line > 0; --line)
        {
            this.clearLine(line);
            for(var cell = 0; cell < this.field[y].length; ++cell)
                this.setColor(cell, line, this.getColor(cell, line-1));
        }
    };
}

var field = new Field();

var offsetsHash = {
    usual: {
        type: "standard",
        T: [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
        R: [[0,0], [ 1,0], [ 1,1], [0,-2], [ 1,-2]],
        B: [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
        L: [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]]
    },
    I: {
        T: [[ 0, 0], [-1, 0], [ 2, 0], [-1, 0], [ 2, 0]],
        R: [[-1, 0], [ 0, 0], [ 0, 0], [ 0,-1], [ 0, 2]],
        B: [[-1,-1], [ 1,-1], [-2,-1], [ 1, 0], [-2, 0]],
        L: [[ 0,-1], [ 0,-1], [ 0,-1], [ 0, 1], [ 0,-2]]
    },
    O: {
        T: [[ 0,0], [ 0,0], [ 0,0], [ 0,0], [ 0,0]],
        R: [[ 0,1], [ 0,1], [ 0,1], [ 0,1], [ 0,1]],
        B: [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]],
        L: [[-1,0], [-1,0], [-1,0], [-1,0], [-1,0]]
    }
};

var tetrominoes = {
    O: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "yellow",
        offsets: offsetsHash.O,
        model: [[1, 2], [1, 2], []]
    },
    I: {
        side: 5,
        rows: 5,
        columns: 5,
        color: "cyan",
        offsets: offsetsHash.I,
        model: [[], [], [1, 2, 3, 4],[],[]]
    },
    T: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "purple",
        offsets: offsetsHash.usual,
        model: [[1], [0, 1, 2], []]
    },
    J: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "blue",
        offsets: offsetsHash.usual,
        model: [[0], [0, 1, 2], []]
    },
    L: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "orange",
        offsets: offsetsHash.usual,
        model: [[2], [0, 1, 2], []]
    },
    S: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "green",
        offsets: offsetsHash.usual,
        model: [[1, 2], [0, 1], []]
    },
    Z: {
        side: 3,
        rows: 3,
        columns: 3,
        color: "red",
        offsets: offsetsHash.usual,
        model: [[0, 1], [1, 2], []]
    }
};

function Block(type, field)
{
    this.field = field;
    this.states = ['T', 'R', 'B', 'L'];
    this.type = type;
    this.tetromino = Object.create(tetrominoes[type]);

    this.rows = this.tetromino.rows; this.columns = this.tetromino.columns;
    this.x = 0; this.y = 0; this.state = this.states[0];

    this.insert = function(x, y)
    {
        for(var row = 0; row < this.tetromino.rows; ++row)
        {
            for(var cell = 0; cell < this.model[row].length; ++cell)
                this.field.setColor(x+this.model[row][cell], y+row, this.tetromino.color);
        }
        this.x = x;
        this.y = y;
    };

    this.remove = function()
    {
        for(var row = 0; row < this.tetromino.rows; ++row)
        {
            for(var cell = 0; cell < this.model[row].length; ++cell)
                this.field.setColor(this.x+this.model[row][cell], this.y+row, "");
        }
    };

    this.update = function(x, y)
    {
        this.remove();
        if(!this.hasCollisions(x, y, this.model))
        {
            this.insert(x, y);
            return true;
        }
        else this.insert(this.x, this.y);
        return false;
    };

    this.hasCollisions = function(x, y, model)
    {
        var clear = true;
        for(var row = 0; clear && row < model.length; ++row)
        {
            for(var cell = 0; clear && cell < model[row].length; ++cell)
            {
                if(x+model[row][cell] > this.field.width-1 || y+row > this.field.height-1 || x+model[row][cell] < 0 || y+row < 0)
                {
                    clear = false;
                    break;
                }
                clear = this.field.isClear(x+model[row][cell], y+row);
            }
        }
        return !clear;
    };

    this.getOffset = function(rotated, state)
    {
        var ox = 0, oy = 0;
        for(var i=0; i < this.tetromino.offsets[this.state].length; ++i)
        {
            ox = this.tetromino.offsets[this.state][i][0] - this.tetromino.offsets[state][i][0];
            oy = this.tetromino.offsets[this.state][i][1] - this.tetromino.offsets[state][i][1];
            if(!this.hasCollisions(this.x+ox, this.y+oy, rotated)) return [ox, oy];
        }
        return false;
    };

    this.rightRotated = function()
    {
        var rotated = new Array(this.tetromino.columns);
        for(var row = 0; row < rotated.length; ++row)
        {
            rotated[row] = [];
        }
        for(row = 0; row < this.tetromino.rows; ++row)
        {
            for(var cell = 0; cell < this.model[row].length; ++cell)
            {
                rotated[ this.model[row][cell] ].push(this.model.length-1-row);
            }
        }
        this.rows = this.columns;
        this.columns = this.rows;
        return rotated;
    };
    
    this.leftRotated = function()
    {
        var rotated = new Array(this.tetromino.columns);
        for(var row = 0; row < rotated.length; ++row)
        {
            rotated[row] = [];
        }
        for(row = 0; row < this.tetromino.rows; ++row)
        {
            for(var cell = 0; cell < this.model[row].length; ++cell)
            {
                rotated[ this.tetromino.columns-this.model[row][cell]-1 ].push(row);
            }
        }
        this.rows = this.columns;
        this.columns = this.rows;
        return rotated;
    };

    this.nextState = function(direction)
    {
        var state = this.states.indexOf(this.state);
        switch(direction)
        {
            case 'l':
                if(state === 0) return this.states[this.states.length-1];
                else return this.states[state-1]; break;
            case 'r':
                if(state === this.states.length-1) return this.states[0];
                else return this.states[state+1];
        }
    };

    this.rotateRight = function()
    {
        this.remove();
        var newState = this.nextState('r');
        var rotated = this.rightRotated();
        var offset;
        if( (offset = this.getOffset(rotated, newState)) )
        {
            this.state = newState;
            this.model = rotated;
            this.insert(this.x + offset[0], this.y + offset[1]);
        }
        else
        {
            this.insert(this.x, this.y);
        }
    };

    this.rotateLeft = function()
    {
        this.remove();
        var newState = this.nextState('l');
        var rotated = this.leftRotated();
        var offset;
        if( (offset = this.getOffset(rotated, newState)) )
        {
            this.state = newState;
            this.model = rotated;
            this.insert(this.x + offset[0], this.y + offset[1]);
        }
        else this.insert(this.x, this.y);
    };

    this.spawn = function()
    {
        var xOffset = Math.round((this.field.width-1)/2-this.tetromino.columns/2);
        this.model = this.tetromino.model;
        if(!this.hasCollisions(xOffset, 0, this.model))
        {
            this.insert(xOffset, 0);
            return true;
        }
        else return false;
    };

    this.shift = function(direction)
    {
        switch(direction)
        {
            case 'l': return this.update(this.x-1, this.y);
            case 'r': return this.update(this.x+1, this.y);
            case 'b': return this.update(this.x, this.y+1);
        }
    };
}

var offsets =
    [
        [
            [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
            [[0,0], [ 1,0], [ 1,1], [0,-2], [ 1,-2]],
            [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
            [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]]
        ],
        [
            [[ 0, 0], [-1, 0], [ 2, 0], [-1, 0], [ 2, 0]],
            [[-1, 0], [ 0, 0], [ 0, 0], [ 0,-1], [ 0, 2]],
            [[-1,-1], [ 1,-1], [-2,-1], [ 1, 0], [-2, 0]],
            [[ 0,-1], [ 0,-1], [ 0,-1], [ 0, 1], [ 0,-2]]
        ],
        [
            [[ 0,0], [ 0,0], [ 0,0], [ 0,0], [ 0,0]],
            [[ 0,1], [ 0,1], [ 0,1], [ 0,1], [ 0,1]],
            [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]],
            [[-1,0], [-1,0], [-1,0], [-1,0], [-1,0]]
        ]
    ];

var tetraminos =
    [
        [3, 3, [[1, 2], [1, 2], []], "yellow", offsets[2]],
        [5, 5, [[], [], [1, 2, 3, 4],[],[]], "cyan", offsets[1]],
        [3, 3, [[1], [0, 1, 2], []], "purple", offsets[0]],
        [3, 3, [[0], [0, 1, 2], []], "blue", offsets[0]],
        [3, 3, [[2], [0, 1, 2], []], "orange", offsets[0]],
        [3, 3, [[1, 2], [0, 1], []], "green", offsets[0]],
        [3, 3, [[0, 1], [1, 2], []], "red", offsets[0]]
    ];

var tetramino = [0, 0, 0, 0];

function insertTM(x, y, TM, state)
{
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
            field.setColor(x+TM[2][row][cell], y+row, TM[3]);
    }
    tetramino = [x, y, TM, state];
}

function removeTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
            field.setColor(x+TM[2][row][cell], y+row, "");
    }
}

function updateTM(TMx, TMy)
{
    removeTM();
    if(!hasCollisions(TMx, TMy, tetramino[2]))
    {
        insertTM(TMx, TMy, tetramino[2], tetramino[3]);
        return true;
    }
    else insertTM(tetramino[0], tetramino[1], tetramino[2], tetramino[3]);
    return false;
}

function shiftTM(direction)
{
    switch(direction)
    {
        case 'l': return updateTM(tetramino[0]-1, tetramino[1]);
        case 'r': return updateTM(tetramino[0]+1, tetramino[1]);
        case 'b': return updateTM(tetramino[0], tetramino[1]+1);
    }
}

function hasCollisions(TMx, TMy, TM)
{
    var clear = true;
    for(var y = 0; clear && y < TM[2].length; ++y)
    {
        for(var x = 0; clear && x < TM[2][y].length; ++x)
        {
            if(TMx+TM[2][y][x] > field.width-1 || TMy+y > field.height-1 || TMx+TM[2][y][x] < 0 || TMy+y < 0)
            {
                clear = false;
                break;
            }
            clear = field.isClear(TMx+TM[2][y][x], TMy+y);
        }
    }
    return !clear;
}

function rRotatedTM(TM)
{
    var TMArray = new Array(TM[1]);
    for(var i = 0; i < TMArray.length; ++i)
    {
        TMArray[i] = [];
    }
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
        {
            TMArray[ TM[2][row][cell]].push(TM[2].length-1-row);
        }
    }
    return [TM[1], TM[0], TMArray, TM[3], TM[4]];
}

function lRotatedTM(TM)
{
    var TMArray = new Array(TM[1]);
    for(var i = 0; i < TMArray.length; ++i)
    {
        TMArray[i] = [];
    }
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
        {
            TMArray[ TM[1]-TM[2][row][cell]-1 ].push(row);
        }
    }
    return [TM[1], TM[0], TMArray, TM[3], TM[4]];
}

function rRotateTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    removeTM();
    var newState = tetramino[3]===3?0:tetramino[3]+1;
    var rotated = rRotatedTM(tetramino[2], newState);
    var offset;
    if( (offset = getOffset(x, y, rotated, TM, tetramino[3], newState)) )
        insertTM(x + offset[0], y + offset[1], rotated, newState);
    else insertTM(x, y, TM, tetramino[3]);
}

function getOffset(x, y, rotated, TM, oldState, newState)
{
    var ox = 0, oy = 0;
    for(var i=0; i < TM[4][oldState].length; ++i)
    {
        ox = TM[4][oldState][i][0] - TM[4][newState][i][0];
        oy = TM[4][oldState][i][1] - TM[4][newState][i][1];
        if(!hasCollisions(x+ox, y+oy, rotated)) return [ox, oy];
    }
    return false;
}

function lRotateTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    removeTM();
    var newState = tetramino[3]?tetramino[3]-1:3;
    var rotated = lRotatedTM(tetramino[2], newState);
    var offset;

    if( (offset = getOffset(x, y, rotated, TM, tetramino[3], newState)) )
        insertTM(x + offset[0], y + offset[1], rotated, newState);
    else insertTM(x, y, TM);
}

function createTM()
{
    var TMId = getRandomBlock();
    var xOffset = Math.round((field.width-1)/2-tetraminos[TMId][1]/2);
    if(!hasCollisions(xOffset, 0, tetraminos[TMId]))
        insertTM(xOffset, 0, tetraminos[TMId], 0);
    else stop();
}

var block;

function create_ng()
{
    var TMId = getRandomBlock();
    var blocks = ['I', 'O', 'S', 'Z', 'T', 'J', 'L'];
    block = new Block(blocks[TMId], field);
    if(!block.spawn()) stop();
}

function shift(direction)
{
    switch(direction)
    {
        case 'l': shiftTM('l'); break;
        case 'r': shiftTM('r'); break;
    }
}

function fall()
{
    if(!shiftTM('b'))
    {
        for(var i = 0, add_score = false; i < tetramino[2][0] && tetramino[1]+i < field.height; ++i)
        {
            if(field.isLineFilled(tetramino[1]+i))
            {
                field.shiftLines(tetramino[1]+i);
                add_score = true;
            }
        }
        createTM();
        if(add_score) score += 1;
        if(score >= 5)
        {
            delay -= 20;
            change_speed();
            score = 0;
        }
    }
}

function fall_ng()
{
    if(!block.shift('b'))
    {
        for(var i = 0, add_score = false; i < block.tetromino.rows && block.y+i < field.height; ++i)
        {
            if(field.isLineFilled(block.y+i))
            {
                field.shiftLines(block.y+i);
                add_score = true;
            }
        }
        create_ng();
        if(add_score) score += 1;
        if(score >= 5)
        {
            delay -= 20;
            change_speed();
            score = 0;
        }
    }
}

var score = 0;
function change_speed()
{
    clearInterval(ival);
    ival = setInterval(fall_ng(), delay);
}

var delay = 200;

var paused = false;
var started = false;
var ival = 0;
function start()
{
    delay = 1000;
    field.clear();
    create_ng();
    ival = setInterval(fall_ng, delay);
    started = true;
    document.game_controls.start_button.disabled = true;
    document.game_controls.pause_button.disabled = false;
    document.game_controls.stop_button.disabled = false;
    document.game_controls.pause_button.textContent = "Pause";
}

function stop()
{
    clearInterval(ival);
    started = false;
    document.game_controls.stop_button.disabled = true;
    document.game_controls.pause_button.disabled = true;
    document.game_controls.start_button.disabled = false;
    document.game_controls.pause_button.textContent = "Stopped";
}

function switchPause()
{
    if(!started) return false;
    if(paused)
    {
        fall_ng();
        ival = setInterval(fall_ng, delay);
        paused = false;
        document.game_controls.pause_button.textContent="Pause";
    }
    else
    {
        clearInterval(ival);
        paused = true;
        document.game_controls.pause_button.textContent="Resume";
    }
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function rotate(direction)
{
    switch(direction)
    {
        case 'l': lRotateTM(); break;
        case 'r': rRotateTM(); break;
    }
}

document.addEventListener('keydown', function(event)
{
    switch (event.keyCode) {
        case "Q".charCodeAt(0): if(started && !paused) block.rotateLeft(); break;
        case "E".charCodeAt(0): if(started && !paused) block.rotateRight(); break;
        case "A".charCodeAt(0): if(started && !paused) block.shift('l'); break;
        case "D".charCodeAt(0): if(started && !paused) block.shift('r'); break;
        case "S".charCodeAt(0): if(started && !paused) fall_ng(); break;
        case 13: switchState(); break;
        case 32: switchPause(); break;
    }
});

function switchState()
{
    if(started) stop();
    else start();
}

var sequence = [];
function getRandomBlock()
{
    if(!sequence.length)
        sequence = generateBag();
    return sequence.pop();
}

function generateBag()
{
    var item;
    var bag = [];
    while(bag.length < 7)
    {
        item = getRandomInt(0, 7);
        if(bag.indexOf(item) === -1)
            bag.push(item);
    }
    return bag.reverse();
}