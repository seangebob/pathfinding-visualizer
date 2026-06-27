// Performs A* algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, finishNode);
  // Proper A*: open list starts with only the start node,
  // not all nodes in the grid
  const openList = [startNode];

  while (!!openList.length) {
    sortNodesByFScore(openList, finishNode);
    const closestNode = openList.shift();

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, finishNode, openList);
  }
  return visitedNodesInOrder;
}

// f(n) = g(n) + h(n)
// g(n) = distance from start, h(n) = heuristic (manhattan distance to finish)
function sortNodesByFScore(openList, finishNode) {
  openList.sort((nodeA, nodeB) => {
    const fA = nodeA.distance + manhattanDistance(nodeA, finishNode);
    const fB = nodeB.distance + manhattanDistance(nodeB, finishNode);
    return fA - fB;
  });
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function updateUnvisitedNeighbors(node, grid, finishNode, openList) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const tentativeDistance = node.distance + 1;
    // Only update if we found a shorter path to this neighbor
    if (tentativeDistance < neighbor.distance) {
      neighbor.distance = tentativeDistance;
      neighbor.previousNode = node;
      // Add to open list if not already queued
      if (!openList.includes(neighbor)) {
        openList.push(neighbor);
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the astar method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}