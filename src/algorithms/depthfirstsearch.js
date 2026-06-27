// Performs Depth-First Search algorithm; returns an array of nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the path
// by backtracking from the finish node.
//
// Note: DFS does NOT guarantee the shortest path — it explores as deep as
// possible along each branch before backtracking. The path it finds is valid
// but may be longer than optimal.

export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (!!stack.length) {
    const currentNode = stack.pop();

    // Skip walls and already-visited nodes
    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.previousNode = currentNode;
      stack.push(neighbor);
    }
  }

  // Return visited nodes in case loop exhausts without reaching finishNode
  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  // Push in reverse order (down, right, up, left) so that when popped from
  // the stack the exploration order is: up, left, down, right — giving a
  // natural top-left preference.
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

// Backtracks from the finishNode to find the path.
// Only works when called *after* the dfs method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}