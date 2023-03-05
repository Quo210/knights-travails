class Knight {
    constructor(location = [0,0], board = [8,8]){
        {
            this.coords = location; // [x,y]
            this.board;
            this.steps = 6;// Expected max number of steps
        }
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

    };
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
    };
    predictMoves(coordinates){//Expecting an array that contains (2) integers as the coordinates of a chess board: [1,2]
        let a = this.exploreX(coordinates);
        const b = this.exploreY(coordinates);
        a = a.concat(b).sort((a,b) => a[0] - b[0]);
        return a
    };
    saveSort(root){
        let isRepeated = this.tracker.visited.includes(root.toString());
        if(isRepeated == false) this.tracker.visited.push(root.toString());
        this.saveRoute(root);
        this.sortVisited()
        return this.tracker.visited
    };
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
    saveRoute(num){
        return this.tracker.route.push(num)
    };
    parsifyArraysOfStrings(bigArr){
        let arrayedStrings = bigArr.map(str => str.split(','));
        return arrayedStrings.map(array => array.map(str => parseInt(str)))
    };
    routeIntoString(){
        let str = 'Start';
        this.tracker.route.forEach(set => str+= ' -> ' + set.toString())
        return str + ' | End'
    }
};//End of Class


class BetterKnight extends Knight{
    constructor(adjList = {}){
        super(adjList);
        this.adjList = this.createAdjList()
    };


    stringifyArrayOfCoordinates(array){// turns [[1,2],[1,3]] into ['1,2','1,3'];
        return array.map(coordinate => `${coordinate[0]},${coordinate[1]}`)
    }

    createAdjList(){//Creates a list of adjacencies, as the chosen form to store a graph
        //It will contain all the possible moves for all the locations in a normal 8 * 8 board. This will be used later.
        const pointer = {
            x: 1,
            y: 1
        };//1 as starter because I decided for the first position of each board axis to be 1 instead of 0, so the end is 8 and not 7. This is a personal preference and can be done with 0-7
        const adjList = {};
        for (let i = 1; i <= 64; i++){
            const coordinate = `${pointer.x},${pointer.y}`;
            const parsedCoordinates = coordinate.split(',').map(str => parseInt(str));
            let ongoingMoves = this.predictMoves(parsedCoordinates);
            //console.log(['On going moves:',ongoingMoves,'For',parsedCoordinates])//A visual aid

            adjList[i] = {
                coordinate,
                moves: this.stringifyArrayOfCoordinates(ongoingMoves)
            };// Create an entry into the list with a name of 1 to 64. Fill it with the corresponding coordinate and its possible moves, which are the adjacencies. 

            //and now adjust variables for the next cycle
            if(pointer.x >= 8){
                pointer.x = 1;
                pointer.y++
            } else {
                pointer.x++
            }
        }
        return adjList //when done, return the list
    };

    binarySearchAdjList(coordinate, list = this.adjList){//It is expecting a coordinate as a str inside an array ['1,1']
        if(!coordinate) return 'Undefined Coordinate';
        if(typeof coordinate == 'string') coordinate = [coordinate];

        const parsedCoor = this.parsifyArraysOfStrings(coordinate)[0];//Switch back to integers
        const array = (typeof list == 'object')? Array.from(Object.values(list)) : list; //Tree of Interest as an Array from AdjList
        const middlePoint = Math.floor( array.length / 2 );
        const pointer = array[middlePoint].coordinate;
        const parsedPointer = this.parsifyArraysOfStrings([pointer])[0];

        if(parsedPointer[1] > parsedCoor[1]){//Refine until we are on the correct Y coordinate
            return this.binarySearchAdjList(coordinate, array.slice(0, middlePoint)) 
        } else if (parsedPointer[1] < parsedCoor[1]){
            return this.binarySearchAdjList(coordinate, array.slice(middlePoint + 1));
        } else {//when on the correct Y coordinate, explore X
            if(parsedPointer[0] > parsedCoor[0]){
                return this.binarySearchAdjList(coordinate, array.slice(0, middlePoint)) 
            } else if (parsedPointer[0] < parsedCoor[0]){
                return this.binarySearchAdjList(coordinate, array.slice(middlePoint + 1));
            } else {//Until sucessful, then return the node
                return array[middlePoint]
            }
        }
    };

    exploreMove(start,end, obj = { route: [], found: null }){//Expecting an array containing a string of coordinates: ['1,1']
        if(!start || !end) return console.error('received an undefined parameter.');
        const startingPos = this.binarySearchAdjList(start);//Get the Adjacencies of starting position
        if(obj.route.length > this.steps) return obj;
        obj.route.push(start[0])
        if( startingPos.moves.includes(end[0]) ){
            obj.route.push(end[0]);
            obj.found = 1;
            this.steps = (obj.route.length < this.steps)? obj.route.length : this.steps;
            console.log(['Match found!', obj.route])
            return obj;
        };//if we find it here, return
        //exploreGrandChildren
        const grandChildren = {};
        for (let i = 0; i < startingPos.moves.length - 1; i++){
            let thisNum = startingPos.moves[i];
            if(!obj.route.includes(thisNum)){
                let tracker = JSON.parse(JSON.stringify(obj));
                grandChildren[i] = this.exploreMove([thisNum], end, tracker);
            } else {
                obj.route.push()
                grandChildren[i] = obj;
            }
        };

        const shortestRoutes = Array.from( Object.values(grandChildren) )
        .filter(obj => (obj.found == 1 && obj.route.length > 1)? true : false)
        .sort( (a,b) => a.route.length - b.route.length);
        
        if(shortestRoutes.length > 0){
            obj.route = shortestRoutes[0].route;
            obj.found = 1;
        }

        return obj
    }


};//End of Class


const first = new BetterKnight([1,1]);
console.log(
first.exploreMove (['8,8'],['1,8'])
)