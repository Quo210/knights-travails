class Board {
    constructor(x = 8,y = 8){
        {
            this.x = x;
            this.y = y;
            this.knights = [];
        }
    }
    getBoard(){
            return this
        }
}
class Knight {
    constructor(location = [0,0], board){
        {
            let playBoard;
            (!board)? playBoard = new Board() : board;

            this.coords = location; // [x,y]
            this.x = this.coords[0]
            this.y = this.coords[1]
            this.movements = null;
            this.board = playBoard;

            this.board.knights.push(this)
        }
        console.log(
            'A new Knight has entered the board!',
            this.board,
            `Currently located at X:${this.x} Y:${this.y}`
        )
    }

    exploreX(yPos){
        let [left,right,yNow] = [undefined];
        const viable = {
            left: null,
            right: null,
        };
        if(yPos){
            left = yPos.left - 1;
            right = yPos.right + 1;
            yNow = yPos;
        } else {
            left = this.x - 2;
            right = this.x + 2;
            yNow = this.y;
        }
        
        if(left >= 0) viable.left = left;
        if(right <= 7) viable.right = right;

        if(yPos){
            return viable
        }

        const yViable = this.exploreY(true);
        
        const knightMovement = [];
        for (let i = 0; i < 2; i++){
            const yVals = Object.values(yViable); 
            yVals.forEach(element => {
                const arr = [];
                arr.push(
                    Object.values(viable)[i], element
                );
                knightMovement.push(arr);
            });
        };

        const xMovements = knightMovement.filter((set) => {
           return (set[0] == null || set[1] == null)? false : true
        })

        console.log(xMovements)
        return xMovements

    }

    exploreY(xPos){
        let [down,up,xNow] = [undefined];
        const viable = {
            down: null,
            up: null
        };
        if(xPos){
            down = this.y - 1;
            up = this.y + 1;
            xNow = xPos;
        } else {
            left = this.x - 2;
            right = this.x + 2;
            yNow = this.y;
        }
        
        if(down >= 0) viable.down = down;
        if(up <= 7) viable.up = up;

        if(xPos){
            return viable
        }
    }
}

const first = new Knight([4,4]);
first.exploreX();