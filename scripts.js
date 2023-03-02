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
    };// This version is reliant on the coordinates of the Knight and uses its properties for execution. Ignoring for this branchg
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
        if(start == undefined || end == undefined ) {
            console.log('A value was undefined, returning null')
            return null;
        }
        this.steps++;
        this.saveSort(start)
        if(this.steps > 64){
            console.error('Too long, stopping');
            return null
        }
        let moves = this.predictMoves(start);
        this.saveSort(start)
        console.log('pathFinder Called: starting exploration for', start)
        console.log('Predictions: ', moves)
        let found;

        const foundMatch = moves.map(arr => arr.toString()).includes(end.toString());
        console.log('is the goal found within the current predictions? ',foundMatch)

        if(foundMatch){
            found = moves.filter(move => move.toString() == end.toString())[0];
            console.log('Found it')
            this.saveSort(end.toString())
            return tracker
        } else {
            console.log(start,'Target not here, starting exploration')
            let childrenMoves = moves.map(move =>{
                let predictions = this.predictMoves(move);
                console.log('For',move,'Predictions',predictions)
                return predictions
            });
            console.log('current contents of childrenMoves:',childrenMoves)
            console.log('STARTING: childrenMoves FILTER to remove visited ones')
            let sortedByLength = [];
            childrenMoves.forEach(moveArr => {
                let filteredArrayOfMoves = moveArr.filter(xyNum => {
                        const isRepeated = this.tracker.visited.includes(xyNum.toString());
                        //console.log(xyNum,'is Repeated?', isRepeated)
                        return (isRepeated)? false : true;
                    }); // Filtered Array of Moves 
                console.log(moveArr,'ARRAY FILTERED INTO',filteredArrayOfMoves)
                const stringifiedFilterArray = filteredArrayOfMoves.map(arr => arr.toString());
                console.log('Stringified: ', stringifiedFilterArray)
                if(stringifiedFilterArray.includes(end.toString())) {
                    console.log('A match was found', filteredArrayOfMoves);
                    let position = childrenMoves.indexOf(moveArr);
                    this.saveSort(moves[position])
                    this.saveSort(end)
                    this.tracker.found = true;
                    return this.tracker
                } else
                sortedByLength.push( filteredArrayOfMoves.sort((a,b) => a.length - b.length) )
                console.log('A match was not found, returning sortedByLength array of possible moves sortedByLength by number of on going moves', sortedByLength);
            });
            if(this.tracker.found == true) return ['Congratulations on finding a route', this.tracker];
            if (sortedByLength.length == 0){
                console.error('Dead end')
                return false
            } else {
                let target = sortedByLength[0];
                console.log('Recursive Call Initiating for: ',target)
                return this.pathFinder(target, end)
            }
            
        }
        } catch (error) {
            console.error(error)
        }
    };
    saveRoute(num){
        return this.tracker.route.push(num)
    };
    parsifyArraysOfStrings(bigArr){
        let arrayedStrings = bigArr.map(str => str.split(','));
        return arrayedStrings.map(array => array.map(str => parseInt(str)))
    }
    findRoute(start,end){//Finds a route from a given initial position towards an end position
        if(!start || !end) return 'A value was undefined. Check for Errors';// if initial position or end position are missing, abort execution because it would throw an error on future code.
        if(start == end) return 'A route finder is not necesary for this case.';
        if(this.steps > 64) return 'Should not take more than 64 steps';

        this.steps++; // Each execution of this function is a movement of the piece.
        this.saveSort(start);// Store the current coordinates into the 'visited' array
        
        const possibleMovesArr = this.predictMoves(start).map(move => move.toString());//Get an array with the coordinates to all locations to where we can move from start coordinates

        const successfulRoute = ['Found a route: ',this.tracker];

        if(possibleMovesArr.includes(end.toString())){
            this.saveSort(end)
            return successfulRoute
        }//If end is found within the moves of start, return route

        //If not, begin exploring the moves of start's possible moves
        const ongoingPossibleMovesArr = possibleMovesArr.map(coordinates =>{
            let parsedCoordinates = coordinates.split(',').map(str => parseInt(str));
            let ongoingMoves = this.predictMoves(parsedCoordinates);
            return ongoingMoves.map(arrayOfMoves => arrayOfMoves.toString())
        });//An array that contains arrays with all the coordinates of the possible moves for the possible moves of start coordinates of this function call
        let index = 0; // To find the position of a potential route
        for (; index < ongoingPossibleMovesArr.length - 1; index++){
            if(ongoingPossibleMovesArr[0].includes(end.toString())){
                this.saveSort(possibleMovesArr[index]);
                this.saveSort(end);
                return successfulRoute
            }
        };//Loop through the coordinates and if found, save the route

        //if not found yet, select from the inmediate moves the one with the least possible ongoing moves
        
        const ongoingByLength = this.parsifyArraysOfStrings(possibleMovesArr).map(array => {
            return {
                array,
                length: this.predictMoves(array).length
            }
        })
        .sort((a,b) => a.length - b.length);

        let nextIndex = 0;
        let nextCoordinate = ongoingByLength[nextIndex].array;
        while(!this.tracker.visited.includes(nextCoordinate)){
            if(nextIndex >= ongoingByLength.length - 1) return 'Infinite Loop Error';
            nextIndex++;
            nextCoordinate = ongoingByLength[nextIndex].array;
        }


        //return ;

        console.log(start, possibleMovesArr, nextCoordinate)
        
        return this.findRoute(nextCoordinate, end)
    }
}

Array.prototype.str

const first = new Knight([1,1]);
console.log(
first.findRoute([8,4],[8,1]),
//first.predictMoves([2,3])
)