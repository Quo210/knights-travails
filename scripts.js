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
            this.coords = location; // [x,y]
            this.x = this.coords[0]
            this.y = this.coords[1]
            this.board = [8,8];
            this.steps = 0;
            this.tracker = {
                route: [],
                visited: []
            }
        }
        console.log(
            'A new Knight has entered the board!',
            `Currently located at X:${this.x} Y:${this.y}`
        )
    }

    exploreX(coordinates,secondMove = false){//coordinates is expected to be an array with 2 numbers, in a format of [x,y] coordinates
        let [left,right] = [undefined];
        let steps = 2;
        const x = coordinates[0];
        const viable = {
            left: null,
            right: null,
        };
        if(secondMove) steps = 1;

        left = x - steps;
        right = x + steps;
        
        if(left >= 1) viable.left = left;
        if(right <= 8) viable.right = right;

        if(secondMove){
            return viable
        }

        const yViable = this.exploreY(coordinates, true);
        
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

    exploreY(coordinates, secondMove = false){
        let [down,up] = [undefined];
        let steps = 2;
        const y = coordinates[1];
        const viable = {
            down: null,
            up: null
        };
        if(secondMove) steps = 1;
        down = y - steps;
        up = y + steps;
        
        if(down >= 1) viable.down = down;
        if(up <= 8) viable.up = up;

        if(secondMove) return viable;

        const xViable = this.exploreX(coordinates, true);

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
        if(root){
            this.coords = root
        } else {
            this.coords = oldLocation;
            root = oldLocation
        }
        this.x = root[0]
        this.y = root[1]
        let a = this.exploreX();
        const b = this.exploreY()
        a = a.concat(b).sort((a,b) => a[0] - b[0]);
        this.coords = oldLocation;
        let isRepeated = this.tracker.visited.includes(root.toString());
        if(isRepeated == false) this.tracker.visited.push(root.toString());
        this.sortVisited()
        console.log('Tracker Status', this.tracker)
        return a
    };// This version is reliant on the coordinates of the Knight and uses its properties for execution
    predictMoves(coordinates){
        let a = this.exploreX(coordinates);
        const b = this.exploreY(coordinates);
        a = a.concat(b).sort((a,b) => a[0] - b[0]);
        return a
    }
    sortVisited(){
        const zeroSort = this.tracker.visited.sort((a,b) => {
            const f = a.split(',').map(num => parseInt(num));//first
            const s = b.split(',').map(num => parseInt(num));//second
            return f[0] - s[0]
        });
        const oneSort = zeroSort.sort((a,b) => {
            const f = a.split(',').map(num => parseInt(num));//first
            const s = b.split(',').map(num => parseInt(num));//second;
            if(f[0] == s[0]){
                return f[1] - s[1]
            } else {
                return f[0] - s[0]
            }
            
        });
        this.tracker.visited = oneSort;
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
    };
    findRoute(starting = [4,4],ending){
        this.coords = starting; // update knight's position to the one passed
        const macro = {
            found: false,
            route: null,
            depth: null,
            init: this.exploreAxis(starting, macro),
            visited: [starting]
        };
        if(macro.init.includes(ending)) return 1;

        macro.init.forEach(move => {
            const micro = {
                start: move,
                depth: 1,
                maxDepth: null,
                route: [move],
                best: [],
                found: false
            };
            
            while(depth < 10){
                depth++
                let moveSet = this.exploreAxis(micro.start, macro);
                if(moveSet.includes(ending)) return [moveset, depth];
                let childMoves = moveSet.map( move => {
                    if (macro.visited.includes(move)) return [];
                    return this.exploreAxis(move);
                });
                for (let i = 0; i < childMoves.length - 1; i++){
                    if(childMoves[i].includes(ending)){

                    }
                }
            }


        })
        
    };
    pathFinder(start,end){

        try {
        this.steps++;
        this.tracker.route.push(start.toString())
        if(start == undefined || end == undefined ) {
            console.log('A value was undefined, returning null')
            return null;
        }
        if(this.steps > 64){
            console.error('Too long, stopping');
            return null
        }
        let moves = this.exploreAxis(start);
        console.log('pathFinder Called: starting exploration for', start)
        console.log('moves found: ', moves)
        let found;

        const verification = moves.map(arr => arr.toString());
        const verification2 = verification.includes(end.toString());

        console.log('Looking for matches, verification 1 and 2: ',verification,verification2)

        if(verification2){
            found = moves.filter(move => move.toString() == end.toString())[0];
            console.log('Found it')
            this.tracker.route.push(end.toString())
            return this.tracker.route
        } else {
            console.log(start,'Target not here, starting exploration')
            let childrenMoves = moves.map(move =>{
                let a = this.exploreAxis(move);
                console.log('childrenMoves',a,'for',move)
                return a
            });
            console.log('current contents of childrenMoves:',childrenMoves)
            console.log('STARTING: childrenMoves FILTER to remove visited ones')
            let sorted;
            childrenMoves.forEach(moveArr => {
                let fArr = moveArr.filter(xyNum => {
                        const isRepeated = this.tracker.visited.includes(xyNum.toString());
                        //console.log(xyNum,'is Repeated?', isRepeated)
                        return (isRepeated)? false : true;
                    }); // Filtered Array of Moves 
                console.log(moveArr,'ARRAY FILTERED INTO',fArr)
                sorted = fArr.sort((a,b) => a.length - b.length)
                console.log('SORTING', sorted)
                if(fArr.includes(end)) {
                    console.log('A match was found')
                    return this.pathFinder(fArr.find(end), end)
                }
            });
            if (sorted.length == 0){
                console.error('Ran out of tries.')
                return false
            } else {
                console.log('Recursive Call Initiating')
                return this.pathFinder(sorted[0], end)
            }
            
        }
        } catch (error) {
            console.error(error)
        }
    };
}

class Movement{
    constructor(){

    }
}

const first = new Knight([1,1]);
console.log(
first.predictMoves([4,4])
)