!function($){
   
    var Game = {
        over :false,
        board: [],
        placedBombs: {},
        start: function(rows, cols, numBombs) {
            this.cols = cols;
            this.rows = rows;
            var x, y, row;
            this.board = []; 
            this.placedBombs = {}; 
            this.placeBombs(numBombs);
            var self = this;
            for(y=0; y<this.rows; y++) {
                row = [];
                this.board.push(row);
                for(x=0; x<this.cols; x++) {
                    row.push(new Cell(x,y,this.placedBombs[y] && this.placedBombs[y][x]));
                }
            }
            
     
            this.dfs(function(cell) {
                var neighbours = self.getNeighbours(cell);
                $.each(neighbours, function(key, value){
                      cell.addNeighbour(value);
                });
            });
            this.paint();
            return this;
        },
  
        dfs: function(fn) {
            var x, y;
            for(y=0; y<this.rows; y++){
                for(x=0; x<this.cols; x++){
                    fn(this.getCell(x, y));
                }
            }
        },
        paint: function(){
            var x, y, tr, td, tbody = $('<tbody>');
            for(y=0; y<this.rows; y++) {
                tr = $('<tr>');
                for(x=0; x<this.cols; x++) {
                    td = $('<td co-orditation="'+y+'-'+x+'">').html("&nbsp;");
                    tr.append(td);
                }
                tbody.append(tr);
            }
            this.over = false;
            $("#minetable").empty().html(tbody);
            return this;
        },
          getNeighbours: function(cell) {
            var i, j, data = [], x = cell.x, y = cell.y;
            for( i=y-1; i<=y+1; i++ ) {
                if(i<0 || i>=this.rows)  continue;
                for(j=x-1; j<=x+1; j++) {
                    if(j<0 || j>=this.cols) continue;
                    if(x===j && y===i) continue;
                    data.push(this.getCell(j,i));
                }
            }
            return data;
        },
        show: function(cell){
            cell.show();
            if(cell.isBomb) {
                this.checkBombs();
                this.over=true;
            }
        },
        getCell: function(x,y) {
            return this.board[y][x];
        },
        placeBombs: function(numBombs) {
            var i;
            for(i=0; i<numBombs; i++) {
                this.placeBomb();
            }
        },
        placeBomb: function() {
            var randomCol = Math.floor(Math.random() * this.cols);
            var randomRow = Math.floor(Math.random() * this.rows);
            if(this.placedBombs[randomRow] && this.placedBombs[randomRow][randomCol]) { 
                return this.placeBomb();
            }
            this.placedBombs[randomRow] = this.placedBombs[randomRow] || {};
            this.placedBombs[randomRow][randomCol] = true;
        },
        checkBombs: function(){
            this.dfs(function(cell) {
                if(cell.isBomb) {
                    cell.setValue("X");
                }
            });
        },
        getCickedCell: function(e) {
            var cords = $(e.target).attr('co-orditation').split('-');
            var y = +cords[0], x=+cords[1];
            return this.getCell(x, y);
        }
      
    };
    
      
    var Cell = function Cell(x,y,isBomb) {
        this.x = x;
        this.y = y;
        this.isBomb = isBomb;
        this.bombCount = 0;
        this.neighbours = [];
        this.revealed = false;
        this.id = y + "-" + x;
    };
    Cell.prototype.setValue = function(value){
        var el = $("#minetable").find("td[co-orditation='"+this.id+"']");
        el.removeClass('mark').html(value);
        return this;
    };
    Cell.prototype.addNeighbour = function(neighbour){
        this.neighbours.push(neighbour);
        this.bombCount += (neighbour.isBomb ? 1 : 0);
        return this;
    };
    Cell.prototype.getNeighbours = function(neighbour){
        return this.neighbours;
    };
   
    Cell.prototype.show = function(){
        if(this.isBomb) {
            return ;
        }
        this.revealed = true;
        this.setValue(this.bombCount);
    };
  
    
    $(function(){
        
        $("#minetable").delegate("td", "click", function(e){
            if(!Game.over) {
                Game.show(Game.getCickedCell(e));
            }
        });
       
       Game.start(30, 15, 20);
    });
    
}(jQuery);