export function astar(grid, startNode, finishNode) {
  startNode.distanceF = 0;
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);

  // console.log(unvisitedNodes);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // manDist = manhattanDistance(closestNode, finishNode);

    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distanceF === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, startNode, finishNode);

    //FOREACH NEIGHBOUR WE CALC THE MANHATTAN DISTANCE
    //FROM THE NEIGHBOUR TO THE FINISH NODE.
  }

  console.log(visitedNodesInOrder);
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distanceF - nodeB.distanceF);
}

function manhattanDistance(nodeOne, nodeTwo) {
  const { col, row } = nodeOne;

  const { col: finishCol, row: finishRow } = nodeTwo;

  let xChange = Math.abs(finishCol - col);
  let yChange = Math.abs(finishRow - row);

  //   console.log(xChange);
  //   console.log(yChange);
  return xChange + yChange;
}

function updateUnvisitedNeighbors(closestNode, grid, startNode, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);

  for (const neighbor of unvisitedNeighbors) {
    // neighbor.distanceG = manhattanDistance(closestNode, startNode);
    neighbor.distanceH = manhattanDistance(neighbor, finishNode);

    neighbor.distanceF = neighbor.distanceH;
    neighbor.previousNode = closestNode;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  //   console.log(nodes);
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
