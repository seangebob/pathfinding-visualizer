// Performs Breadth-First Search algorithm; returns an array of nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (!!queue.length) {
    const currentNode = queue.shift();

    // Skip walls — they should never be in the queue in the first place,
    // but guard against it just in case.
    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  // Return visited nodes in case loop exhausts without reaching finishNode
  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  // Filter out both visited nodes AND walls so walls never enter the queue
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the bfs method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}