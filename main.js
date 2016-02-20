var gameBoardElement = document.getElementById('ticTacToe');
var human = "X";
var computer = "O";
var isGameOver = false;
var Enum = function () { var v = arguments; var s = { all: [], keys: v }; for (var i = v.length; i--;)s[v[i]] = s.all[i] = i; return s }
var Board = {
    newBoard: function () {
        return [[null, null, null], [null, null, null], [null, null, null]];
    },
    board: this.newBoard,
    render: function (gameBoard) {
        var output = "<table><tbody>";
        this.board.forEach(function (row, i) {
            output += "<tr id=\"row" + i + "\">";
            row.forEach(function (col, j) {
                var colStr = col ? col : "";
                output += "<td data-row=\"" + i + "\" data-col=\"" + j + "\">" + colStr + "</td>";
            });
            output += "</tr>";
        });
        output += "</tbody></table>";
        output += "<button onClick=\"Game.start()\">Reset Game</button>"
        $(gameBoard).html(output);
    },
    //getAllRoutes will return an array of all routes, so that a condition statement can evaluate if there are any routes with 2 computer squares. It will then fill out the remaining square, end the move, and end the game.  
    getAllRoutes: function () {
        //Scan the board for all routes.
        var arrayOfRouteArrays = [];
        for (var i = 0; i < 3; i++) {
            arrayOfRouteArrays.push(getRow(i));
            arrayOfRouteArrays.push(getCol(i));
        }
        arrayOfRouteArrays.push(getDiag1());
        arrayOfRouteArrays.push(getDiag2());
        return arrayOfRouteArrays;
    }
};
var Game = ({
    statuses: {
        newGame: 0,
        inProcess: 1,
        over: 2
    },
    start: function () {
        isGameOver = false;
        this.status = Game.statuses.newGame;
        Board.board = Board.newBoard();
        Board.render("#ticTacToe");
    },
    board: Board.board,
    get status() {
        return this._currentStatus;
    },
    set status(val) {
        this._currentStatus = val;
    },
    isHotRoute: function (route, peiceType) {
        if (route.filter(function (square) { return square.value === peiceType; }).length !== 2) return;
        var nulls = route.filter(function (square) { return square.value === null; });
        if (nulls.length === 1) return nulls[0];
        return false;
    },
    isWinRoute: function (route, pieceType) {
        if (route.filter(function (square) { return square.value === pieceType; }).length === 3) return;  
    },
    //Placing the piece on the board
    makeMove: function (td) {
        //check if element is empty. If true, put an "X" in it.
        //get row id , column id, update Board.board[rowId][colId], Board.render();
        if (Board.board[td.dataset.row][td.dataset.col] == null) {
            Board.board[td.dataset.row][td.dataset.col] = human;
            Board.board[td.dataset.row][td.dataset.col].readonly = true;
            Board.render("#ticTacToe");
        } else {
            alert("this square has already been chosen.");
            Game.makeMove(tdElement);
        }
    },
    answerMove: function (tdElement) {
        var result;
        var row = getTDRow(tdElement);
        var col = getTDCol(tdElement);
        var diag1 = getDiag1(tdElement);
        var diag2 = getDiag2(tdElement);
        var allRoutes = Board.getAllRoutes();
        //Will the computer win within next move?
        allRoutes.forEach(function (route) {
            if (result) return;
            var hotSpace = Game.isHotRoute(route, computer);
            if (hotSpace) result = Game.fillNullSquare(hotSpace.rowId, hotSpace.colId);
        });
        //...Or, do we need to block a threat?
        allRoutes.forEach(function (route) {
            if (result) return;
            var hotSpace = Game.isHotRoute(route, human);
            if (hotSpace) result = Game.fillNullSquare(hotSpace.rowId, hotSpace.colId);
        })      
        // No immediate win or loss, first fill center if null, then make routes by filling corners first
        if(!result){
            if (Board.board[1][1] == null) {
                result = Game.fillNullSquare(1, 1);
            } else if (Board.board[0][0] == null) {
                result = Game.fillNullSquare(0, 0);
            } else if (Board.board[0][2] == null) {
                result = Game.fillNullSquare(0, 2);
            }
            //top edge work-around
            else if (Board.board[0][1] == null) {
                result = Game.fillNullSquare(0, 1);
            }
            else if (Board.board[2][0] == null) {
                result = Game.fillNullSquare(2, 0);
            } else if (Board.board[2][2] == null) {
                result = Game.fillNullSquare(2, 2);
            }
            // The corners are full. find whatever is left
            else if (Board.board[1][2] == null) {
                result = Game.fillNullSquare(1, 2);
            }
            else if (Board.board[1][0] == null) {
                result = Game.fillNullSquare(1, 2);
            }
            else if (Board.board[2][1] == null) {
                result = Game.fillNullSquare(2, 1);
            }
        }
        if (!result) alert("Game Over: Stalemate");
        return result;
    },
    fillNullSquare: function (i, j) {
        Board.board[i][j] = computer;
        Board.board[i][j].readonly = true;
        Board.render("#ticTacToe");
        return { rowId: i, colId: j, value: Board.board[i][j] };
    }
});

var replaceTemplate = function (templateId, values) {
    var template = document.getElementsByTagName(templateId);
    values.forEach(function (item, index) {
        template = template.replace(item.key, item.value);
    })
    return template;
}

//Object Constructor for boardCell. Creates logical boardCell.
var boardCell = function (rowId, colId, value) {
    this.rowId = rowId;
    this.colId = colId;
    this.value = value;
    return this;
}

//TODO: make getWinRoute take getAllRoutes and eval for 3 of same pieceType.
function getWinRoute(passedElement) {
    var moveRoutes = getMoveRoutes(passedElement);
    var winResult = [];
    moveRoutes.forEach(function (moveRoute, index) {
        var playedPiece = Board.board[passedElement.dataset.row][passedElement.dataset.col];
        var isWin = true;
        //Loop through all 3 items in route and if any of them is not equal to played piece, set isWin = false;
        for (var i = 0; i < moveRoute.length; i++) {
            if (moveRoute[i].value !== playedPiece) isWin = false;
        }
        if (isWin) {
            //Return this row in the results
            winResult.push(moveRoute);
        }
    });
    return winResult;
}

//TODO: Remove once getWinRoutes checks from getAllRoutes.
function getMoveRoutes(tdElement) {
    var result = [];
    result.push(getTDRow(tdElement));
    result.push(getTDCol(tdElement));
    result.push(getDiag1(tdElement));
    result.push(getDiag2(tdElement));
    result.forEach(function (index, item) {
        if (item == undefined) result.pop(item);
    });
    return result;
}

//What happens on click event
document.getElementById("ticTacToe").addEventListener("click", function onClick(item) {
    //check if isGameOver. if it is return null.
    if (Game.status == Game.statuses.over) return null;
    Game.status = Game.statuses.inProcess;
    var tdElement = item.target;
    if (tdElement.tagName !== "TD") return false;
    Game.makeMove(tdElement);
    //winRoutes returns an array of winRoutes
    var winRoutes = Game.isWinRoute();    
    /*
    allRoutes.forEach(function (route) {
            if (result) return;
            var hotSpace = Game.isHotRoute(route, human);
            if (hotSpace) result = Game.fillNullSquare(hotSpace.rowId, hotSpace.colId);
    })    
    */

    if (winRoutes.length > 0) {
        isGameOver = true;
        Game.status = Game.statuses.over;
        for (var i = 0; i < winRoutes.length; i++) {
            highlightWinRoute(winRoutes[i]);
        }
    }
    if (winRoutes.length == 0) {
        var computersMoveBoardCell = Game.answerMove(tdElement);
    }
    if (!computersMoveBoardCell) return;
    var computersMoveTd = getElementFromCell(computersMoveBoardCell);
    var computerWinRoutes = getWinRoute(computersMoveTd);
    if (computerWinRoutes.length > 0) {
        Game.status = Game.statuses.over;
        isGameOver = true;
        for (var i = 0; i < computerWinRoutes.length; i++) {
            highlightWinRoute(computerWinRoutes[i]);
        }
    }
});

function getElementFromCell(boardCell) {
    // the object is evaluated against elements[i].dataset.row && dataset.col;
    console.log(typeof boardCell);
    var elements = gameBoardElement.getElementsByTagName('td');
    var results = [];
    for (var i = 0; i < elements.length; i++) {
        if (!boardCell) debugger;
        if (elements[i].dataset.row == boardCell.rowId && elements[i].dataset.col == boardCell.colId) {
            results.push(elements[i]);
        }
    }
    return results[0];
}

function highlightWinRoute(winRoute) {
    var results = [];
    for (var i = 0; i < winRoute.length; i++) {
        // The function will accept a boardCell and return a td element.
        var selection = getElementFromCell(winRoute[i]);
        results.push(selection);
    }
    for (var i = 0; i < results.length; i++) {
        results[i].classList.add("highlight");
    }
}

//4 routes for possible win: row, column, and 2 diagonals.
function getTDRow(td) {
    if (!td) return null;
    var rowId = td.dataset.row;
    var result = [];
    Board.board[rowId].forEach(function (item, index) {
        result.push({ rowId: rowId, colId: index, value: item });
    });
    return result;
}
function getTDCol(td) {
    var colId = td.dataset.col;
    var result = [];
    for (var i = 0; i < Board.board.length; i++) {
        result.push({ rowId: i, colId: colId, value: Board.board[i][colId] });
    }
    return result;
}
function getRow(number) {
    var result = [];
    for (var i = 0; i < Board.board.length; i++) {
        result.push({ rowId: number, colId: i, value: Board.board[number][i] });
    }
    return result;
}
function getCol(number) {
    result = [];
    for (var i = 0; i < Board.board.length; i++) {
        result.push({ rowId: i, colId: number, value: Board.board[i][number] });
    }
    return result;
}
function getDiag1() {
    var result = [];
    for (var i = 0, j = 0; i < Board.board.length; i++ , j++) {
        result.push({ rowId: i, colId: j, value: Board.board[i][j] });
    }
    return result;
}
function getDiag2() {
    var result = [];
    for (var i = 0, j = 2; i < Board.board.length; i++ , j--) {
        result.push({ rowId: i, colId: j, value: Board.board[i][j] });
    }
    return result;
}

//Initiate Game on Page Load
(function () {
    Game.start();
    Board.render("#ticTacToe");
})();
