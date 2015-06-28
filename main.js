//Change makeMove to assign the "X" to the array instead of the HTML, and then have it call Board.render(). 
//Trigger the makeMove() to show the users selection. You will have to trigger it from the onClick(). I am going to name it onClick() just so I can refer to it.
//I changed the second if(isRowThreat) call inside the onClick to use item.target instead of item.sender. That was causing an error.


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
  //$(td).html(player)
  //get row id , column id, update Board.board[rowId][colId], Board.render();
  Board.board[td.dataset.row][td.dataset.col] = "X";
  Board.render("#ticTacToe");
}

function answerMove(tdElement){
	//Insert AI here
  	//find the null value and relplace it with an "O"
  var row = getRow(tdElement);
  if(isRowThreat(row)){
  	row.forEach(function(item){
      if(item.value == null){
        //Get the rowId. use item, item.rowId, item.colId, Assign "O" to array element in Board.board
      	Board.board[item.rowId][item.colId] = "O";
        Board.render("#ticTacToe");
        return;
      }
    });
  };
  var col = getCol(tdElement);
  if(isRowThreat(col)){
	col.forEach(function(item){
      if(item.value == null){
      	Board.board[item.rowId][item.colId] = "O";
        Board.render("#ticTacToe");
        return;
      }
    });
  }
	
}

function isRowThreat(row){
	//if true, add an "O" into the null spot
  	var search = "X";
	var xCount = row.reduce(function(index, item) {
  		return index + (item.value === search);
	}, 0);
  	var nullCount = row.reduce(function(index, item){
  		return index + (item.value === null);
    }, 0);
  	return xCount == 2 && nullCount == 1;
}

$("#ticTacToe").on("click", "td", function onClick(item){
  var tdElement = item.target;
  makeMove(tdElement);
  answerMove(tdElement);
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
function getDiag(){
	
}
function getDiag(){

}

function isGameOver(){
	//Insert Game Over here 
}

$(function(){
  Board.render("#ticTacToe");
});

