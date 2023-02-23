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
        let [left,right] = [undefined];
        const viable = {
            left: null,
            right: null,
        };
        if(yPos){
            left = this.x - 1;
            right = this.x + 1;
        } else {
            left = this.x - 2;
            right = this.x + 2;
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
        let [down,up] = [undefined];
        const viable = {
            down: null,
            up: null
        };
        if(xPos){
            down = this.y - 1;
            up = this.y + 1;
        } else {
            down = this.y - 2;
            up = this.y + 2;
        }
        
        if(down >= 0) viable.down = down;
        if(up <= 7) viable.up = up;

        if(xPos){
            return viable
        }

        const xViable = this.exploreX(true);

        const knightMovement = [];
        for (let i = 0; i < 2; i++){
            const xVals = Object.values(xViable); 
            xVals.forEach(element => {
                const arr = [];
                arr.push(
                    element, Object.values(viable)[i]
                );
                knightMovement.push(arr);
            });
        };

        const yMovements = knightMovement.filter((set) => {
            return (set[0] == null || set[1] == null)? false : true
         })
 
         console.log(yMovements)
         return yMovements
    }
}

const first = new Knight([4,4]);
first.exploreX();
first.exploreY()