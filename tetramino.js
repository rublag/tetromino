/**
 * Created by user on 14.03.2015.
 */
var fieldX = 10;
var fieldY = 22;
var field = new Array(fieldY);
for(var i=0; i< field.length; ++i)
    field[i] = new Array(fieldX);

var rows = document.getElementsByClassName("row");
for(var row = 0; row < rows.length; ++row)
{
    var cells = rows[row].getElementsByClassName("cell");
    for(var cell = 0; cell < cells.length; ++cell)
    {
        field[row][cell] = cells[cell];
    }
}

function clearField()
{
    for(var i = 0; i < field.length; ++i)
        for(var j = 0; j < field[i].length; ++j)
            setColor(j, i, "");
}

var offsetsHash = {
    usual: {
        type: "standard",
        T: [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
        R: [[0,0], [ 1,0], [ 1,1], [0,-2], [ 1,-2]],
        B: [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]],
        L: [[0,0], [ 0,0], [ 0,0], [0, 0], [ 0, 0]]
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
            setColor(x+TM[2][row][cell], y+row, TM[3]);
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
            setColor(x+TM[2][row][cell], y+row, "");
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
            if(TMx+TM[2][y][x] > fieldX-1 || TMy+y > fieldY-1 || TMx+TM[2][y][x] < 0 || TMy+y < 0)
            {
                clear = false;
                break;
            }
            clear = isClear(TMx+TM[2][y][x], TMy+y);
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
    var xOffset = Math.round((fieldX-1)/2-tetraminos[TMId][1]/2);
    if(!hasCollisions(xOffset, 0, tetraminos[TMId]))
        insertTM(xOffset, 0, tetraminos[TMId], 0);
    else stop();
}

function setColor(x, y, color)
{
    field[y][x].style.backgroundColor = color;
}

function isClear(x, y)
{
    return !field[y][x].style.backgroundColor;
}

function shift(direction)
{
    switch(direction)
    {
        case 'l': shiftTM('l'); break;
        case 'r': shiftTM('r'); break;
    }
}

function isLineFilled(y)
{
    var allFilled = true;
    for(var i = 0; i < field[y].length && allFilled; ++i)
    {
        if(isClear(i, y)) allFilled = false;
    }
    return allFilled;
}

function clearLine(y)
{
    for(var i = 0; i < field[y].length; ++i)
    {
        setColor(i, y, "");
    }
}

function shiftLines(y)
{
    for(var i = y; i > 0; --i)
    {
        clearLine(i);
        for(var j = 0; j < field[y].length; ++j)
            field[i][j].style.backgroundColor = field[i-1][j].style.backgroundColor;
    }
}

function fall()
{
    if(!shiftTM('b'))
    {
        for(var i = 0, add_score = false; i < tetramino[2][0] && tetramino[1]+i < fieldY; ++i)
        {
            if(isLineFilled(tetramino[1]+i))
            {
                shiftLines(tetramino[1]+i);
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

var score = 0;
function change_speed()
{
    clearInterval(ival);
    ival = setInterval(fall, delay);
}

var delay = 200;

var paused = false;
var started = false;
var ival = 0;
function start()
{
    delay = 1000;
    clearField();
    createTM();
    ival = setInterval(fall, delay);
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
        fall();
        ival = setInterval(fall, delay);
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
        case "Q".charCodeAt(0): if(started && !paused) rotate('l'); break;
        case "E".charCodeAt(0): if(started && !paused) rotate('r'); break;
        case "A".charCodeAt(0): if(started && !paused) shift('l'); break;
        case "D".charCodeAt(0): if(started && !paused) shift('r'); break;
        case "S".charCodeAt(0): if(started && !paused) fall(); break;
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