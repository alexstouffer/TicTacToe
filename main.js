//Change makeMove to assign the "X" to the array instead of the HTML, and then have it call Board.render()
//Trigger the makeMove() to show the users selection. You will have to trigger it from the onClick(). I am going to name it onClick() just so I can refer to it.
//I changed the second if(isRouteThreat) call inside the onClick to use item.target instead of item.sender. That was causing an error.
var newBoard = function(){
    return [[null,null,null],[null,null,null],[null,null,null]];
}

var gameBoardElement = document.getElementById('ticTacToe');
var human = "X";
var computer = "O";
var isGameOver = false;
var computerLastMove;

var Board = {
  board: new newBoard(),
  render: function(gameBoard){
    var output = "<table><tbody>";
    this.board.forEach(function(row, i){
      output += "<tr id=\"row"+i+"\">";
      row.forEach(function(col, j){
          var colStr = col ? col : "";
          output += "<td data-row=\""+i+"\" data-col=\""+j+"\">"+ colStr +"</td>";
      });
      output += "</tr>";
    });
    output += "</tbody></table>";
    output += "<button onClick=\"resetBoard()\">Reset Game</button>"
    $(gameBoard).html(output);
  }

};

//create a class called boardElement. A function that accepts 3 params: rowId, colId, value. Sets all properties to its respective value and returns.

var boardElement = function(rowId, colId, value){
    this.rowId = rowId;
    this.colId = colId;
    this.value = value;
    return this;
}

var resetBoard = function(){
    isGameOver = false;
    Board.board = new newBoard();
    Board.render("#ticTacToe");
}

function makeMove(td){
 //check if element is empty. If true, put an "X" in it.
  if (!td) return;
  //get row id , column id, update Board.board[rowId][colId], Board.render();
  Board.board[td.dataset.row][td.dataset.col] = human;
  Board.render("#ticTacToe");
}

function isRouteType(route, type){
    if (type === "Threat"){
        var search = human;
    } else if (type === "Opportunity"){
        var search = computer;
    }
    var itemCount = route.reduce(function(index, item) {
        return index + (item.value === search);
    }, 0);
    var nullCount = route.reduce(function(index, item){
        return index + (item.value === null);
    }, 0);
    return itemCount === 2 && nullCount == 1;
}


function moveIfGood (route){
    // routePieces param will be passed human || computer.
    route.forEach(function(item){
        if(item.value == null){
          //Get the rowId. use item, item.rowId, item.colId, Assign "O" to array element in Board.board
          Board.board[item.rowId][item.colId] = computer;
          computerLastMove = {rowId: item.rowId, colId: item.colId, value: Board.board[item.rowId][item.colId]};
          Board.render("#ticTacToe");
          return;
        }
    });
}

function fillNullSquare (i, j){
    Board.board[i][j] = computer;
    computerLastMove = {rowId: i, colId: j, value: Board.board[i][j]};
    Board.render("#ticTacToe");
    return;
}

function answerMove(tdElement){

    var row = getRow(tdElement);
    var col = getCol(tdElement);
    var diag1 = getDiag1(tdElement);
    var diag2 = getDiag2(tdElement);
  //Will the computer win within next move?
    if(isRouteType(row, "Opportunity")){
      moveIfGood(row);
  } else if(isRouteType(col, "Opportunity")){
      moveIfGood(col);
    } else if(isRouteType(diag1, "Opportunity")){
      moveIfGood(diag1);
  } else if(isRouteType(diag2, "Opportunity")){
      moveIfGood(diag2);
    }
    //Will the computer lose within opponent's next move?
    else if(isRouteType(row, "Threat")){
      moveIfGood(row);
    } else if(isRouteType(col, "Threat")){
      moveIfGood(col);
    } else if (isRouteType(diag1, "Threat")){
      moveIfGood(diag1);
    } else if (isRouteType(diag2, "Threat")){
      moveIfGood(diag2);
      // No immediate win or loss, first fill center if null, then make routes by filling corners first
    } else if (Board.board[1][1] == null){
        fillNullSquare(1, 1);
    } else if (Board.board[0][0] == null){
        fillNullSquare(0, 0);
    } else if (Board.board[0][2] == null){
        fillNullSquare(0, 2);
    }
    //top edge work-around
    else if (Board.board[0][1] == null){
        fillNullSquare(0, 1);
    }
    else if (Board.board[2][0] == null){
        fillNullSquare(2, 0);
    } else if (Board.board[2][2] == null){
        fillNullSquare(2, 2);
    }
    // The corners are full. find whatever is left
     else if (Board.board[1][2] == null){
         fillNullSquare(1, 2);
     }
     else if (Board.board[1][0] == null){
         fillNullSquare(1, 2);
     }
     else if (Board.board[2][1] == null){
         fillNullSquare(2, 1);
     }
};


//Accepts the tdElement that the human clicked on, and returns any winning routes that move is in.
// Check array and see if moveRoute[i].value to see if it's different from playedPiece.
function getWinRoute(passedElement){
    var moveRoutes = getMoveRoutes(passedElement);
    var winResult = [];
    moveRoutes.forEach(function(moveRoute, index){
      	var playedPiece = Board.board[passedElement.dataset.row][passedElement.dataset.col];
        var isWin = true;
        //Loop through all 3 items in route and if any of them is not equal to played piece, set isWin = false;
        for (var i = 0; i < moveRoute.length; i++){
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
    result.push(getRow(tdElement));
    result.push(getCol(tdElement));
    result.push(getDiag1(tdElement));
    result.push(getDiag2(tdElement));
    result.forEach(function(index, item){
        if (item == undefined) result.pop(item);
    });
    return result;
}

$("#ticTacToe").on("click", "td", function onClick(item){
  //check if isGameOver. if it is return null.
  //we currently only check against the human move using tdElement. But that doesn't evaluate the computer's last move.
  if (isGameOver) return null;
  var tdElement = item.target;
  var computerTDElement = getTDElementFromBoardElement(computerLastMove)[0];
  makeMove(tdElement);
  var winRoutes = getWinRoute(tdElement);
  var computerWinRoutes = getWinRoute(computerTDElement);

  if (winRoutes.length > 0) {
      isGameOver = true;
      for (var i=0; i < winRoutes.length; i++){
          highlightWinRoute(winRoutes[i]);
      }
  }

  answerMove(tdElement);
  if (computerWinRoutes.length > 0){
      isGameOver = true;
      for (var i=0; i < computerWinRoutes.length; i++){
          highlightWinRoute(computerWinRoutes[i]);
      }
  }
});

function getTDElementFromBoardElement(routeObject){
//Elements returns a list of elements to evaluate against the model.
//winRoute is an array of objects. I need to evaluate each object along with its row and col properties.
// the object is evaluated against elements[i].dataset.row && dataset.col;
//highlightWinRoute will cycle through a winRoute, and apply a class to elements[i].
//if winRoute[i].rowId === elements[i].dataset.row && winRoute[i].colId === elements[i].dataset.col, then apply class.

//currently our elements and model can be evaluated, but the loop is too big to just increment. All items after indexOf 2 are undefined.

    var elements = gameBoardElement.getElementsByTagName('td');
    var results = [];
    var routeIndex = 0;
    for (var i=0; i < elements.length; i++){
        if (elements[i].dataset.row == routeObject.rowId && elements[i].dataset.col == routeObject.colId){
            results.push(elements[i]);
        }
    }
    return results;
}

function highlightWinRoute(winRoute){
    var results = [];
    for (var i=0; i < winRoute.length; i++){
        // The function will accept a boardElement and return a td element.
        var selection = getTDElementFromBoardElement(winRoute[i]);
        results.push(selection[0]);
    }
    for (var i=0; i < results.length; i++){
        results[i].classList.add("highlight");
    }
}

//4 routes for possible win: row, column, and 2 diagonals.
function getRow(td){
  var rowId = td.dataset.row;
  var result = [];
  Board.board[rowId].forEach(function(item, index){
	result.push({rowId: rowId, colId: index, value: item});
  });
  return result;
}
function getCol(td){
	var colId = td.dataset.col;
	var result = [];
	for(var i=0; i < Board.board.length; i++){
    	result.push({rowId: i, colId: colId, value: Board.board[i][colId]});
  	}
  	return result;
}
function getDiag1(td){
    var result = [];
	for(var i=0, j=0; i < Board.board.length; i++, j++){
        result.push({rowId: i, colId: j, value: Board.board[i][j]});
    }
    return result;
}
function getDiag2(td){
    var result = [];
    for(var i=0, j=2; i < Board.board.length; i++, j--){
        result.push({rowId: i, colId: j, value: Board.board[i][j]});
    }
    return result;
}

//Initiate Game on Page Load
(function(){
  Board.render("#ticTacToe");
})();
