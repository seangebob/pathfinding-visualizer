import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar, getNodesInShortestPathOrder as getAstarNodesInShortestPathOrder } from '../algorithms/astar';

import './PathfindingVisualizer.css';

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
      isAnimating: false,
    };
    // Track all pending timeouts so they can be cleaned up
    this.timeoutIds = [];
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  componentWillUnmount() {
    // Clear all pending timeouts to prevent memory leaks and
    // setState-on-unmounted-component warnings
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
  }

  handleMouseDown(row, col) {
    // Block interaction while animation is running
    if (this.state.isAnimating) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    // Block interaction while animation is running
    if (this.state.isAnimating) return;
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    // Block interaction while animation is running
    if (this.state.isAnimating) return;
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const id = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-visited';
      }, 10 * i);
      this.timeoutIds.push(id);
    }
    // After all visited nodes are animated, animate the shortest path
    const id = setTimeout(() => {
      this.animateShortestPath(nodesInShortestPathOrder);
    }, 10 * visitedNodesInOrder.length);
    this.timeoutIds.push(id);
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const id = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-shortest-path';
      }, 50 * i);
      this.timeoutIds.push(id);
    }
    // Re-enable interaction after animation completes
    const id = setTimeout(() => {
      this.setState({ isAnimating: false });
    }, 50 * nodesInShortestPathOrder.length);
    this.timeoutIds.push(id);
  }

  visualizeDijkstra() {
    // Prevent running again while an animation is in progress
    if (this.state.isAnimating) return;
    this.setState({ isAnimating: true });
    const { grid } = this.state;
    // Deep clone the grid so the algorithm can mutate freely
    // without corrupting React state
    const gridClone = deepCloneGrid(grid);
    const startNode = gridClone[START_NODE_ROW][START_NODE_COL];
    const finishNode = gridClone[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(gridClone, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    // Prevent running again while an animation is in progress
    if (this.state.isAnimating) return;
    this.setState({ isAnimating: true });
    const { grid } = this.state;
    // Deep clone the grid so the algorithm can mutate freely
    // without corrupting React state
    const gridClone = deepCloneGrid(grid);
    const startNode = gridClone[START_NODE_ROW][START_NODE_COL];
    const finishNode = gridClone[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(gridClone, startNode, finishNode);
    const nodesInShortestPathOrder = getAstarNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearBoard() {
    // Prevent clearing while animation is running
    if (this.state.isAnimating) return;
    // Cancel any lingering animation timeouts
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
    const grid = getInitialGrid();
    // Reset all DOM node classes back to default
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        const el = document.getElementById(`node-${row}-${col}`);
        if (el) {
          el.className = 'node' +
            (node.isStart ? ' node-start' : '') +
            (node.isFinish ? ' node-finish' : '');
        }
      }
    }
    this.setState({ grid, isAnimating: false });
  }

  render() {
    const { grid, mouseIsPressed, isAnimating } = this.state;

    return (
      <>
        <button
          onClick={() => this.visualizeDijkstra()}
          disabled={isAnimating}
          style={{ opacity: isAnimating ? 0.5 : 1, cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
          Visualize Dijkstra's Algorithm
        </button>
        <button
          onClick={() => this.visualizeAstar()}
          disabled={isAnimating}
          style={{ marginLeft: '10px', opacity: isAnimating ? 0.5 : 1, cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
          Visualize A* Algorithm
        </button>
        <button
          onClick={() => this.clearBoard()}
          disabled={isAnimating}
          style={{ marginLeft: '10px', opacity: isAnimating ? 0.5 : 1, cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
          Clear Board
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={`node-${row}-${col}`}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// Deep clone the grid so algorithms can freely mutate node properties
// (distance, isVisited, previousNode) without corrupting React state objects
const deepCloneGrid = (grid) => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      previousNode: null,
    }))
  );
};

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
  // Properly clone the affected row so the original state array is not mutated
  const newGrid = grid.map((r, rIdx) => (rIdx === row ? r.slice() : r));
  const node = newGrid[row][col];
  // Do not allow toggling start or finish nodes as walls
  if (node.isStart || node.isFinish) return grid;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};