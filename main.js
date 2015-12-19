//Change makeMove to assign the "X" to the array instead of the HTML, and then have it call Board.render()
//Trigger the makeMove() to show the users selection. You will have to trigger it from the onClick(). I am going to name it onClick() just so I can refer to it.
//I changed the second if(isRouteThreat) call inside the onClick to use item.target instead of item.sender. That was causing an error.


//When a winRoute exists, set the Game.status to "over".
//On the click event, check if the Game.status is over, and if it is then exit the function
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
        //Will the computer win within next move?
        //scanBoardRoutes will return an array of all routes, so that a condition statement can evaluate if there are any routes with 2 computer squares. It will then fill out the remaining square, end the move, and end the game.
        function scanBoardRoutes (){
          var arrayOfRouteArrays = [];
          for(var i = 0; i < 3; i++){
            arrayOfRouteArrays.push(getRow(i));
            arrayOfRouteArrays.push(getCol(i));
          }
          arrayOfRouteArrays.push(getDiag1());
          arrayOfRouteArrays.push(getDiag2());
          return arrayOfRouteArrays;
        }
        //Will the computer lose within opponent's next move?
        if (isRouteType(row, "Threat")) {
            result = Game.moveIfGood(row);
        } else if (isRouteType(col, "Threat")) {
            result = Game.moveIfGood(col);
        } else if (isRouteType(diag1, "Threat")) {
            result = Game.moveIfGood(diag1);
        } else if (isRouteType(diag2, "Threat")) {
            result = Game.moveIfGood(diag2);
            // No immediate win or loss, first fill center if null, then make routes by filling corners first
        } else if (Board.board[1][1] == null) {
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
        if (!result) debugger;
        return result;
    },
    moveIfGood: function (route) {
        // routePieces param will be passed human || computer.
        var result;
        route.forEach(function (item) {
            if (item.value == null) {
                //Get the rowId. use item, item.rowId, item.colId, Assign "O" to array element in Board.board
                Board.board[item.rowId][item.colId] = computer;
                Board.board[item.rowId][item.colId].readonly = true;
                Board.render("#ticTacToe");
                result = { rowId: item.rowId, colId: item.colId, value: Board.board[item.rowId][item.colId] };
            }
        });
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

//create a class called boardCell. A function that accepts 3 params: rowId, colId, value. Sets all properties to its respective value and returns.

var boardCell = function (rowId, colId, value) {
    this.rowId = rowId;
    this.colId = colId;
    this.value = value;
    return this;
}
function isRouteType(route, type) {
    if (type === "Threat") {
        var search = human;
    } else if (type === "Opportunity") {
        var search = computer;
    }
    var itemCount = route.reduce(function (index, item) {
        return index + (item.value === search);
    }, 0);
    var nullCount = route.reduce(function (index, item) {
        return index + (item.value === null);
    }, 0);
    return itemCount === 2 && nullCount == 1;
}

//Accepts the tdElement that the human clicked on, and returns any winning routes that move is in.
// Check array and see if moveRoute[i].value to see if it's different from playedPiece.
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

//pass in 1 tdElement and return all existing routes from previous move that the element is on.
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

//TODO: computer win isn't caught until next move
document.getElementById("ticTacToe").addEventListener("click", function onClick(item) {
    //check if isGameOver. if it is return null.
    //we currently only check against the human move using tdElement. But that doesn't evaluate the computer's last move.
    if (Game.status == Game.statuses.over) return null;
    Game.status = Game.statuses.inProcess;
    var tdElement = item.target;
    if (tdElement.tagName !== "TD") return false;
    Game.makeMove(tdElement);
    var winRoutes = getWinRoute(tdElement);

    if (winRoutes.length > 0) {
        isGameOver = true;
        Game.status = Game.statuses.over;
        for (var i = 0; i < winRoutes.length; i++) {
            highlightWinRoute(winRoutes[i]);
        }
    }
    if (winRoutes.length == 0){
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
function getRow(number){
  var result = [];
  for (var i = 0; i < Board.board.length; i++){
    result.push({ rowId: number, colId: i, value: Board.board[number][i]});
  }
  return result;
}
function getCol(number){
  result = [];
  for (var i = 0; i < Board.board.length; i++){
    result.push({ rowId: i, colId: number, value: Board.board[i][number]});
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
