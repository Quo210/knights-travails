last ideas

i see two main ways of completing this

recursively generate an entire BST and look in and back up every single node until a shortest path can be defined

or

using the adjacency list generator i already made i can depart from the initial position and explore each individual available path until i find the final spot i'm looking for, then compare each find against each other and choose the closest

thinking of going 

first option
search adj
if not found
search adj of first adj
if not found
repeat until found
then trace back generating a list with return arguments 
do this with all elements within all options until fully mapped out and shortest is found

sounds like a lot of work i'm not sure if this is the most efficient way

it looks like a lot from human POV perhaps from big O notation it wouldn't be this much