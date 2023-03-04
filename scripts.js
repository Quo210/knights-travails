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
                visited: [],
                found: false
            }
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
    predictMoves(coordinates){
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
    findRoute(start,end){//Finds a route from a given initial position towards an end position
        if(!start || !end) return 'A value was undefined. Check for Errors';// if initial position or end position are missing, abort execution because it would throw an error down the line
        if(start == end) return 'A route finder is not necesary for this case.';
        if(this.steps > 64) return 'Should not take more than 64 steps';

        this.steps++; // Each execution of this function is a movement of the piece.
        this.saveSort(start);// Store the current coordinates into the 'visited' array
        
        const possibleMovesArr = this.predictMoves(start).map(move => move.toString());//Get an array with the coordinates to all locations to where we can move from start coordinates. Stringify them for easy comparison

        const successfulRoute = () => [`Within ${this.steps} steps I found the goal:`,this.routeIntoString(), 'Method used: Brute Force/Knights Tour'];//In a function form, this can be dynamically generated when requested, changed by all the code below

        if(possibleMovesArr.includes(end.toString())){
            this.steps++
            this.saveSort(end)
            return successfulRoute()
        }//If end is found within the moves of start, return route

        //If not, begin exploring the moves of start's possible moves
        const ongoingPossibleMovesArr = possibleMovesArr.map(coordinates =>{
            let parsedCoordinates = coordinates.split(',').map(str => parseInt(str));
            let ongoingMoves = this.predictMoves(parsedCoordinates);
            return ongoingMoves.map(arrayOfMoves => arrayOfMoves.toString())
        });//An array that contains arrays with all the coordinates of the possible moves for the possible moves of starting coordinates for this function call. Read that again if necesary
        let index = 0; // To find the position of a potential route
        for (; index < ongoingPossibleMovesArr.length - 1; index++){
            if(ongoingPossibleMovesArr[0].includes(end.toString())){
                this.saveSort(possibleMovesArr[index]);
                this.steps++;
                this.saveSort(end);
                return successfulRoute()
            }
        };//Loop through the coordinates and if found, save the route

        //if not found yet, select from the inmediate moves the one with the least possible ongoing moves
        
        const ongoingByLength = this.parsifyArraysOfStrings(possibleMovesArr).map(array => {
            return {
                array,
                length: this.predictMoves(array).length
            }
        })// Take an array of possible moves, and turn its contents into strings. Then map through it to return an object with the properties of the original coordinate and the number of possible moves it can make
        .sort((a,b) => a.length - b.length);//Then sort these objects by the number of possible moves each can make

        let nextIndex = 0;
        let nextCoordinate = ongoingByLength[nextIndex].array;//Points to the first (fewer possible moves) element of ongoingByLength array
        while(this.tracker.visited.includes(nextCoordinate.toString())){
            if(nextIndex >= ongoingByLength.length - 1) return 'Infinite Loop Error';
            nextIndex++;
            nextCoordinate = ongoingByLength[nextIndex].array;
        };//While the selected coordinate can be found within the 'visited' array, reasign nextCoordinate to the next option. If running out of options, stop and return an error.

        console.log(start, '->', nextCoordinate)//A visual aid for the Dev
        
        return this.findRoute(nextCoordinate, end)//A recursive call using the unvisited move with the least future moves
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
        console.log([`List is a ${typeof list}`, list])
        if(!coordinate) return 'Undefined Coordinate';

        const parsedCoor = this.parsifyArraysOfStrings(coordinate)[0];//Switch back to integers
        const array = (typeof list == 'object')? Array.from(Object.values(list)) : list; //Tree of Interest as an Array from AdjList
        const middlePoint = Math.floor( array.length / 2 );
        const pointer = array[middlePoint].coordinate;
        const parsedPointer = this.parsifyArraysOfStrings([pointer])[0];

        if(parsedPointer[1] > parsedCoor[1]){//Refine until we are on the correct Y coordinate
            console.log(['Returning first half of tree'])
            return this.binarySearchAdjList(coordinate, array.slice(0, middlePoint)) 
        } else if (parsedPointer[1] < parsedCoor[1]){
            console.log(['Returning second half of tree'])
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
    }

    navigateRoute(start,end){

    }


};//End of Class


const first = new BetterKnight([1,1]);
console.log(
first.binarySearchAdjList(['6,5'])
)