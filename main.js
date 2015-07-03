//Change makeMove to assign the "X" to the array instead of the HTML, and then have it call Board.render()
//Trigger the makeMove() to show the users selection. You will have to trigger it from the onClick(). I am going to name it onClick() just so I can refer to it.
//I changed the second if(isRouteThreat) call inside the onClick to use item.target instead of item.sender. That was causing an error.
var Board = {
  board: [[null,null,null],[null,null,null],[null,null,null]],
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
    $(gameBoard).html(output);
  }

};

var player = "X";
var computer = "O";
function makeMove(td){
 //check if element is empty. If true, put an "X" in it.
  if (!td) return;
  //get row id , column id, update Board.board[rowId][colId], Board.render();
  Board.board[td.dataset.row][td.dataset.col] = "X";
  Board.render("#ticTacToe");
}

function answerMove(tdElement){
    var row = getRow(tdElement);
    var col = getCol(tdElement);
    var diag1 = getDiag1(tdElement);
    var diag2 = getDiag2(tdElement);
  //Will the computer win within next move?
  if(isRouteOpportunity(row)){
      row.forEach(function(item){
      if(item.value == null){
        //Get the rowId. use item, item.rowId, item.colId, Assign "O" to array element in Board.board
        Board.board[item.rowId][item.colId] = "O";
        Board.render("#ticTacToe");
        return;
      }
    });
  } else if(isRouteOpportunity(col)){
  	col.forEach(function(item){
        if(item.value == null){
          Board.board[item.rowId][item.colId] = "O";
          Board.render("#ticTacToe");
          return;
        }
      });
  } else if(isRouteOpportunity(diag1)){
    	diag1.forEach(function(item){
          if(item.value == null){
          	Board.board[item.rowId][item.colId] = "O";
            Board.render("#ticTacToe");
            return;
          }
        });
  } else if(isRouteOpportunity(diag2)){
      	diag2.forEach(function(item){
            if(item.value == null){
            	Board.board[item.rowId][item.colId] = "O";
              Board.render("#ticTacToe");
              return;
            }
          });
    }
  //Will the computer lose within opponent's next move?
  else if(isRouteThreat(row)){
  	row.forEach(function(item){
      if(item.value == null){
        //Get the rowId. use item, item.rowId, item.colId, Assign "O" to array element in Board.board
      	Board.board[item.rowId][item.colId] = "O";
        Board.render("#ticTacToe");
        return;
      }
    });
  } else if(isRouteThreat(col)){
	col.forEach(function(item){
      if(item.value == null){
      	Board.board[item.rowId][item.colId] = "O";
        Board.render("#ticTacToe");
        return;
      }
    });
  } else if (isRouteThreat(diag1)){
        diag1.forEach(function(item){
            if(item.value == null){
                Board.board[item.rowId][item.colId] = "O";
                Board.render("#ticTacToe");
                return;
            }
        });
    } else if (isRouteThreat(diag2)){
        diag2.forEach(function(item){
            if(item.value == null){
                Board.board[item.rowId][item.colId] = "O";
                Board.render("#ticTacToe");
                return;
            }
        })
        // No immediate win or loss, first fill center if null, then make routes by filling corners first
    } else if (Board.board[1][1] == null){
        Board.board[1][1] = "O";
        Board.render("#ticTacToe");
        return;
    } else if (Board.board[0][0] == null){
        Board.board[0][0] = "O";
        Board.render("#ticTacToe");
        return;
    } else if (Board.board[0][2] == null){
        Board.board[0][2] = "O";
        Board.render("#ticTacToe");
        return;
    }
    //top edge work-around
    else if (Board.board[0][1] == null){
        Board.board[0][1] = "O";
        Board.render("#ticTacToe");
        return;
    }
    else if (Board.board[2][0] == null){
        Board.board[2][0] = "O";
        Board.render("#ticTacToe");
        return;
    } else if (Board.board[2][2] == null){
        Board.board[2][2] = "O";
        Board.render("#ticTacToe");
        return;
    }
    // The corners are full. find whatever is left
     else if (Board.board[1][2] == null){
         Board.board[1][2] = "O";
         Board.render("#ticTacToe");
         return;
     }
     else if (Board.board[1][0] == null){
         Board.board[1][0] = "O";
         Board.render("#ticTacToe");
         return;
     }
     else if (Board.board[2][1] == null){
         Board.board[2][1] = "O";
         Board.render("#ticTacToe");
         return;
     }
};

function isContainingNull(route){
    var nullCount = route.reduce(function(index, item){
        return index + (item.value === null);
    }, 0);
    return nullCount;
}

function isRouteThreat(route){
	//if true, add an "O" into the null spot
  	var search = "X";
	var xCount = route.reduce(function(index, item) {
  		return index + (item.value === search);
	}, 0);
  	var nullCount = route.reduce(function(index, item){
  		return index + (item.value === null);
    }, 0);
  	return xCount == 2 && nullCount == 1;
}

function isRouteOpportunity(route){
    var search = "O";
    var oCount = route.reduce(function(index, item){
        return index + (item.value === search);
    }, 0);
    var nullCount = route.reduce(function(index, item){
        return index + (item.value === null);
    }, 0);
    return oCount == 2 && nullCount == 1;
}

function isWinner(route){
    var xSearch = "X";
    var oSearch = "O";
    var xCount = route.reduce(function(index, item){
        return index + (item.value === xSearch);
    }, 0);
    var oCount = route.reduce(function(index, item){
        return index + (item.value === oSearch);
    }, 0);
    return xCount == 3 || oCount == 3;
}

$("#ticTacToe").on("click", "td", function onClick(item){
  var tdElement = item.target;
  makeMove(tdElement);
  isGameOver(getWinner(tdElement));
  answerMove(tdElement);
  isWinner(tdElement);
});

function getRow(td){
  var rowId = td.dataset.row;
  var result = [];
  Board.board[rowId].forEach(function(item, index){
	result.push({rowId: rowId, colId: index, value: item});
  });
  return result;
}
//Pass into getCol() the table data element that was clicked
//Get Column number from data element
//Get all elements from column in the main array associated with passed in element, the only column were talking about
//Which array do we want column from
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

function getRowCopy(td){
  var rowId = td;
  var result = [];
  Board.board[rowId].forEach(function(item, index){
	result.push({rowId: rowId, colId: index, value: item});
  });
  return result;
}

function isGameOver(){
	//Insert Game Over here

}

(function(){
  Board.render("#ticTacToe");
})();
