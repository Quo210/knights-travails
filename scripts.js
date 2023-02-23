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
        
        if(left >= 1) viable.left = left;
        if(right <= 8) viable.right = right;

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
        
        if(down >= 1) viable.down = down;
        if(up <= 8) viable.up = up;

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
 
         return yMovements
    }

    exploreAxis(root){
        const oldLocation = this.coords;
        this.coords = root;
        this.x = root[0]
        this.y = root[1]
        let a = this.exploreX();
        const b = this.exploreY()
        a = a.concat(b).sort((a,b) => a[0] - b[0]);
        this.coords = oldLocation;
        return a
    }

    populateBoard(){
        const list = {};
        let keyCounter = 1;
        let y = 1;
        for (; y <= 8; y++){
            let x = 1;
            if(!list[keyCounter]) list[keyCounter] = [];
            while(x <= 8){
                const coords = [x,y];
                list[keyCounter] = {
                    location: coords,
                    adjacencies: this.exploreAxis(coords)
                };
                x++
                keyCounter++
            }
        }
        console.log(list)
        return list
    }
}

class Movement{
    constructor(){

    }
}

const first = new Knight([7,4]);
first.populateBoard()