#PseudoCode

search a route for an specific destination in a graph using starting and end point as input


1. find moveset for starting location
1.1 before starting the search save somewhere the current route, a limit of searches
for this make an object that stores the information
1.2 save this initial moveset as the starting point to branch out

2. once obtaining moveset to begin, confirm if the current moveset includes the desired ending location
2.1 if true, return the information of 1 step

3. if it doesn't, forEach loop the initial moveset so they are all travelled in order

4. It's time to explore each initial move at least 10 times. Inside the forEach loop, create a tracker object whom will record the progress of each journey. The exploration can be done through a loop or recursion
4.1 Tracker will have: 
- Current starting point
- current Depth travelled
- Best depth with results
- A storage [] for the current route being explored

5. Create a function that 


// new PseudoCode attempt

1. from starting position, find all possible moves. Each time all moves from a location are explored, save visited location in an function scoped object that can be referenced

2. check if any of the resulting moves contain the desired coordinates, if not

3. find the moves for all the children locations. Sort to choose the ones with the fewer amount of paths, excluding visited locations

4. Travel the selected path, repeat until coordinate is found. Store somewhere the number of moves made and the route followed.