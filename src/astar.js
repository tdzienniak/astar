(function (global) {
    var MAX_PASSABILITY = 99,
        WORLD_HEIGHT,
        WORLD_WIDTH,
        world,
        nodes = [];

    function setMaxPassability (passability) {
        MAX_PASSABILITY = passability;
    }

    function setWorld (w) {
        world = w;

        WORLD_WIDTH = w.length;
        WORLD_HEIGHT = w[0].length;

        for (var x = 0; x < WORLD_WIDTH; x++) {
            nodes[x] = [];
            for (var y = 0; y < WORLD_HEIGHT; y++) {
                nodes[x][y] = {
                    x: x,
                    y: y,
                    parent: null,
                    status: "none",
                    g: 0,
                    f: 0,
                    h: 0
                };
            }
        }
    };

    function checkPassability (x, y) {
        if (world[x][y]) {
            if (world[x][y].passability > MAX_PASSABILITY) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * Calculates distance between two nodes.
     * 
     * @param  {Node} start        starting node
     * @param  {Node} end          target node
     * @param  {int} straitCost   cost
     * @param  {int} diagonalCost cost
     * @return {int}              distance
     */
    function distance (startX, startY, endX, endY, cost) {
        var straightCost = cost || 10,
            diagonalCost = (cost) ? Math.round(cost * Math.sqrt(2)) : 14,
            xDistance = Math.abs(startX - endX),
            yDistance = Math.abs(startY - endY);

        //Manhattan method
        /*
        return straightCost * (xDistance + yDistance);
        */
       
        //Diagonals shortcut method
        if (xDistance > yDistance) {
             return diagonalCost * yDistance + straightCost * (xDistance - yDistance);
        } else {
             return diagonalCost * xDistance + straightCost * (yDistance - xDistance);
        }
    }

    function getNeighbours (x, y) {
        var N = y - 1,
            S = y + 1,
            W = x - 1,
            E = x + 1,
            isN = N >= 0,
            isS = S <= WORLD_HEIGHT,
            isW = W >= 0,
            isE = E <= WORLD_WIDTH,
            neighbours = [];

            //N
            if (isN && checkPassability(x, N)) {
                neighbours.push({x: x, y: N});
            }

            //S
            if (isS && checkPassability(x, S)) {
                neighbours.push({x: x, y: S});
            }

            //W
            if (isW && checkPassability(W, y)) {
                neighbours.push({x: W, y: y});
            }

            //E
            if (isE && checkPassability(E, y)) {
                neighbours.push({x: E, y: y});
            }

            //NW
            if (isN && isW && checkPassability(W, N)) {
                neighbours.push({x: W, y: N});
            }

            //NE
            if (isN && isE && checkPassability(E, N)) {
                neighbours.push({x: E, y: N});
            }

            //SE
            if (isS && isE && checkPassability(E, S)) {
                neighbours.push({x: E, y: S});
            }

            //SE
            if (isS && isW && checkPassability(W, S)) {
                neighbours.push({x: W, y: S});
            }

            return neighbours;
    }

    /**
     * Finds the shortest path between two given nodes using A* algorithm.
     * 
     * @param  {2d array} world array world representation
     * @param  {node} start starting node
     * @param  {Node} end   ening node
     * @return {array}       array with path (objects with x and y properity)
     */
    function findPath (startX, startY, endX, endY) {
        var open = new OrderedLinkedList(),
            path = [];

        //console.log(world);
        //mark starting node as open and add it to OPEN priority list
        nodes[startX][startY].status = "open";
        open.append({x: startX, y: startY});

        while (true) {
            if (open.head.data.x === endX && open.head.data.y === endY) { //path found
                break;
            } else if (open.head === null) { //there is no path
                console.log("There is no path from (" + startX + ", " + startY + ") to (" + endX + " ," + endY + ").");
                return false;
            } else {
                //continue path-finding
            }
            
            var current = nodes[open.head.data.x][open.head.data.y],
                cX = current.x,
                cY = current.y;

            nodes[cX][cY].status = "closed";

            open.remove(open.head);

            var neighbours = getNeighbours(cX, cY);

            for (var i = 0, length = neighbours.length; i < length; i++) {
                var nX = neighbours[i].x,
                    nY = neighbours[i].y,
                    cost = current.g + distance(cX, cY, nX, nY) + world[nX][nY].passability;

                nodes[nX] = nodes[nX] || [];

                if (nodes[nX][nY].status === "none") {
                    var h = distance(nX, nY, endX, endY),
                        f = cost + h;

                    nodes[nX][nY].parent = nodes[cX][cY];
                    nodes[nX][nY].status = "open";
                    nodes[nX][nY].g = cost;
                    nodes[nX][nY].f = f;
                    nodes[nX][nY].h = h;

                    open.insert({x: nX, y: nY}, f);

                    continue;
                }

                if (nodes[nX][nY].status === "open" && cost < nodes[nX][nY].g) {
                    nodes[nX][nY].g = cost;
                    nodes[nX][nY].f = cost + nodes[nX][nY].h;
                    nodes[nX][nY].parent = nodes[cX][cY];

                    for (var node = open.head; node; node = node.next) {
                        if (node.x === nX && node.y === nY) {
                            open.remove(node);
                            open.insert(node, nodes[nX][nY].f);
                            
                            break;
                        }
                    }
                }
            }
        }

        for (var node = nodes[open.head.data.x][open.head.data.y]; node; node = node.parent) {
            path.push({x: node.x, y: node.y});
        }

        return path;
    }

    global["astar"] = {
        setMaxPassability: setMaxPassability,
        setWorld: setWorld,
        findPath: findPath
    };
})(this);