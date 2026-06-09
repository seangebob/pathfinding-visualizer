import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css'; 


function Dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: [],
          mouseIsPressed: false,
        };
    }

    componentDidMount() {
      const grid = getInitialGrid();
      this.setState({grid});
    }

    handleMouseDown(row, col) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed) return;
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }

    handleMouseUp() {
      console.log('ARE WE MOUSING UP');
      this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder) {
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      const newGrid = this.state.grid.slice();
      const newNode = {
        ...node,
        isVisited: true,
      };
      newGrid[node.row][node.col] = newNode;
      console.log(document.getElementById(`node-${node.row}-${node.col}`));
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-visited';
      // this.setState({grid: newGrid});
    }, 20 * i);
  }
}

    visualizeDijkstra() {
      const {grid} = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
      this.animateDijkstra(visitedNodesInOrder);
    }

    render() {
      const {grid} = this.state;
      console.log(grid);

      return (
        <div className="grid" onMouseUp={() => this.handleMouseUp()}>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {isStart, isFinish, isWall, isVisited} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      isVisited={isVisited}
                      onMouseDown={() => this.handleMouseDown(rowIdx, nodeIdx)}
                      onMouseEnter={() => this.handleMouseEnter(rowIdx, nodeIdx)}
                      onMouseUp={() => this.handleMouseUp()}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.map((r, rIdx) => (rIdx === row ? r.slice() : r));
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};