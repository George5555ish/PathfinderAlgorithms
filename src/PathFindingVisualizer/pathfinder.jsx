import React, { useState } from "react";
import Node from "./Node/node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { astar } from "../algorithms/astar";
import NodeValues from "./NodeValues";
import Modal from "./Modal/modal";
import "./pathfinder.css";

export default function Pathfinder() {
  const START_NODE_ROWDEFAULT = 12;
  const START_NODE_COLDEFAULT = 28;
  const FINISH_NODE_ROWDEFAULT = 12;
  const FINISH_NODE_COLDEFAULT = 38;

  const [fullNodes, setFullNode] = useState({
    startNodeRow: START_NODE_ROWDEFAULT,
    startNodeCol: START_NODE_COLDEFAULT,
    finishNodeRow: FINISH_NODE_ROWDEFAULT,
    finishNodeCol: FINISH_NODE_COLDEFAULT,
  });

  // const [showModal, setModal] = useState(true);
  const [nodeValues, setNodeValues] = useState({
    startNodeRow: START_NODE_ROWDEFAULT,
    startNodeCol: START_NODE_COLDEFAULT,
    finishNodeRow: FINISH_NODE_ROWDEFAULT,
    finishNodeCol: FINISH_NODE_COLDEFAULT,
  });

  const createNode = (col, row) => {
    const {
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    } = nodeValues;
    // const {  } = fullNodes;

    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      distanceF: Infinity,
      distanceG: Infinity,
      distanceH: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      // hasImageOn: row === IMAGE_NODE_ROW && col === IMAGE_NODE_COL,
    };
  };

  const getInitialGrid = (rowsA, colsA, rowsB, colsB) => {
    const gridTest = [];

    const {
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    } = nodeValues;
    // const { } = finishNodeValues;

    rowsA = startNodeRow;
    colsA = startNodeCol;
    rowsB = finishNodeRow;
    colsB = finishNodeCol;
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 60; col++) {
        currentRow.push(createNode(col, row));
      }
      gridTest.push(currentRow);
    }
    return gridTest;
  };

  const gridBox = getInitialGrid(
    fullNodes.startNodeRow,
    fullNodes.startNodeCol,
    fullNodes.finishNodeRow,
    fullNodes.finishNodeCol
  );

  const [firstGrid, setGrid] = useState(gridBox);
  const [mouseIsPressed, setPressed] = useState(false);
  const [hasExecuted, setExecuted] = useState(false);
  const [allowOnce, setAllowOnce] = useState(true);
  const [astarActive, setAstarActive] = useState(false);
  const [dijkstraActive, setdijkstraActive] = useState(false);
  const [startNodePressed, setSNodePressed] = useState(false);
  const [finishNodePressed, setFNodePressed] = useState(false);
  const [dontShowWall, setDontShowWall] = useState(false);
  const [seeModal, setModal] = useState(true);

  //Normally, you'd write the {grid: grid}, but because
  //react allows shortening, we leave it as {grid}

  // const newGrid = getNewGridWithWallToggled(firstGrid, row, col);

  //     setGrid(newGrid);

  if (seeModal) {
    showModal();
  }

  function handleMouseDown(row, col) {
    const startNode = findNewStartNode(firstGrid);
    const finishNode = findNewFinishNode(firstGrid);

    const startNodeRow = startNode.row;
    const startNodeCol = startNode.col;
    const finishNodeRow = finishNode.row;
    const finishNodeCol = finishNode.col;

    // const { } = finishNodeValues;
    if ((row === startNodeRow) & (col === startNodeCol)) {
      console.log("startNode");
      setSNodePressed(true);
      setFNodePressed(false);
      setDontShowWall(true);
    } else if ((row === finishNodeRow) & (col === finishNodeCol)) {
      console.log("finishNode");
      setFNodePressed(true);
      setSNodePressed(false);
      setDontShowWall(true);
    } else if (!dontShowWall) {
      const newGrid = getNewGridWithWallToggled(firstGrid, row, col);

      setGrid(newGrid);
    }
    setPressed(true);
  }

  function handleMouseEnter(row, col) {
    // const {  } = finishNodeValues;

    // console.log(dontShowWall);
    if (!mouseIsPressed) return;
    if (!dontShowWall) {
      // console.log(row, col);
      const newGrid = getNewGridWithWallToggled(firstGrid, row, col);

      setGrid(newGrid);
    } else if (startNodePressed) {
      console.log("start node pressed");
      console.log(row, col);

      // if (hasExecuted) {
      //   console.log("has executed");
      // }

      changeStartNode(firstGrid, row, col);
      setNodeValues((prevNodes) => {
        return {
          ...prevNodes,
          startNodeRow: row,
          startNodeCol: col,
        };
      });
    } else if (finishNodePressed) {
      console.log(" finish node pressed");

      changeFinishNode(firstGrid, row, col);
      setNodeValues((prevNodes) => {
        return {
          ...prevNodes,
          finishNodeRow: row,
          finishNodeCol: col,
        };
      });
    }
  }

  function handleMouseUp(row, col) {
    // console.log(startNodePressed);
    // console.log(finishNodePressed);
    if (hasExecuted && (startNodePressed || finishNodePressed)) {
      // console.log(nodeValues);

      resetBoard(row, col);

      if (astarActive) {
        const startNode = findNewStartNode(firstGrid);
        const finishNode = findNewFinishNode(firstGrid);
        let visitedNodesInOrder = astar(firstGrid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(
          finishNode
        );

        console.log(visitedNodesInOrder);
        if (visitedNodesInOrder.length === 3) {
          console.log("first Time");
          console.log(nodesInShortestPathOrder);
        } else {
          function animateAstar(visitedNodesInOrder, nodesInShortestPathOrder) {
            // if ()
            for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
              if (i === visitedNodesInOrder.length - 1) {
                setTimeout(() => {
                  animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
              }
              setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nodeDiv = document.getElementById(
                  `node-${node.row}-${node.col}`
                );
                if (nodeDiv !== null) {
                  nodeDiv.className = "node node-visited";
                } else if (nodeDiv === undefined) {
                  console.log(nodeDiv);
                }
              }, 10 * i);
            }
          }

          animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);
        }
      }
      if (dijkstraActive) {
        // const startNode = findNewStartNode(firstGrid);
        const finishNode = findNewFinishNode(firstGrid);
        // let visitedNodesInOrder = dijkstra(firstGrid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(
          finishNode
        );
        if (nodesInShortestPathOrder.length === 3) {
          console.log("first Time");
          console.log(nodesInShortestPathOrder);
        } else {
          visualizeDijkstra();
        }
      }
    }
    // console.log("mouse out");
    // console.log(row, col);
    setPressed(false);
    setDontShowWall(false);

    setFNodePressed(false);
    setSNodePressed(false);
  }

  function findNewStartNode(grid) {
    const newGrid = grid.slice();
    for (var j = 0; j < newGrid.length; j++) {
      const node = newGrid[j];

      for (var i = 0; i < node.length; i++) {
        const { isStart } = node[i];
        if (isStart) {
          return node[i];
        }
        // const { isStart } = node[i];
      }
    }
  }

  function findNewFinishNode(grid) {
    const newGrid = grid.slice();
    for (var j = 0; j < newGrid.length; j++) {
      const node = newGrid[j];

      for (var i = 0; i < node.length; i++) {
        const { isFinish } = node[i];
        if (isFinish) {
          return node[i];
        }
        // const { isStart } = node[i];
      }
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 30 * i);
    }
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  function animateAstar(visitedNodesInOrder, nodesInShortestPathOrder) {
    // if ()
    for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  function visualizeAstar() {
    if (!hasExecuted || allowOnce) {
      const startNode = findNewStartNode(firstGrid);
      const finishNode = findNewFinishNode(firstGrid);
      const visitedNodesInOrder = astar(firstGrid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);
      // console.log(visitedNodesInOrder);
      setExecuted(true);
      setAstarActive(true);
    } else {
      console.log("board should be cleared");
    }
  }

  function visualizeDijkstra() {
    // const { finishNodeRow, finishNodeCol } = finishNodeValues;
    const startNode = findNewStartNode(firstGrid);
    const finishNode = findNewFinishNode(firstGrid);
    const visitedNodesInOrder = dijkstra(firstGrid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    setExecuted(true);
    setdijkstraActive(true);
  }

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const setStartNode = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: true,
    };

    newGrid[row][col] = newNode;

    return newGrid;
  };

  const setFinishNode = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isFinish: true,
    };

    newGrid[row][col] = newNode;

    return newGrid;
  };

  const renderNoStartNode = (grid, row) => {
    const newGrid = grid.slice();

    for (var j = 0; j < newGrid.length; j++) {
      let currentRow = newGrid[j];

      for (var i = 0; i < currentRow.length; i++) {
        const { isFinish } = currentRow[i];
        if (!isFinish) {
          const newNode = {
            ...currentRow[i],
            isStart: false,
          };

          currentRow[i] = newNode;
        }
        // const { isStart } = node[i];
      }
    }

    return newGrid;
  };

  const renderNoFinishNode = (grid, row) => {
    const newGrid = grid.slice();

    for (var j = 0; j < newGrid.length; j++) {
      let currentRow = newGrid[j];

      for (var i = 0; i < currentRow.length; i++) {
        const { isStart } = currentRow[i];
        if (!isStart) {
          const newNode = {
            ...currentRow[i],
            isFinish: false,
          };

          currentRow[i] = newNode;
        }
        // const { isStart } = node[i];
      }
    }

    return newGrid;
  };

  const changeStartNode = (grid, row, col) => {
    ///Just write a function to reset all the nodes to have only the start node gone.
    //then call the function below to re-initialize it as the new start node.
    var gridWithNoNode = renderNoStartNode(grid, row);
    setGrid(gridWithNoNode);
    // setTimeout(() => {

    // }, 100);
    var newStartNode = setStartNode(firstGrid, row, col);

    setGrid(newStartNode);
    // setTimeout(() => {

    // }, 100);
  };

  const changeFinishNode = (grid, row, col) => {
    ///Just write a function to reset all the nodes to have only the start node gone.
    //then call the function below to re-initialize it as the new start node.
    var gridWithNoNode = renderNoFinishNode(grid, row);
    setGrid(gridWithNoNode);
    // setTimeout(() => {

    // }, 100);
    var newStartNode = setFinishNode(firstGrid, row, col);

    setGrid(newStartNode);
    // setTimeout(() => {

    // }, 100);
  };

  function clearBoard() {
    const freshGrid = [];
    setGrid(freshGrid);

    setTimeout(() => {
      const answer = getInitialGrid(
        START_NODE_ROWDEFAULT,
        START_NODE_COLDEFAULT,
        FINISH_NODE_ROWDEFAULT,
        FINISH_NODE_COLDEFAULT
      );

      setGrid(answer);
    }, 100);

    //THIS VALUE BELOW IS FOR THE NodeValues component.
    //so that the start node and end node values are updated
    //when useState is called and passed as a prop.
    setNodeValues({
      startNodeRow: START_NODE_ROWDEFAULT,
      startNodeCol: START_NODE_COLDEFAULT,
      finishNodeRow: FINISH_NODE_ROWDEFAULT,
      finishNodeCol: FINISH_NODE_COLDEFAULT,
    });
    setExecuted(false);
    setAstarActive(false);
    setdijkstraActive(false);
  }

  function resetBoard(row, col) {
    const freshGrid = [];
    setGrid(freshGrid);

    const {
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    } = nodeValues;

    if (startNodePressed) {
      setTimeout(() => {
        const answer = getInitialGrid(row, col, finishNodeRow, finishNodeCol);

        setGrid(answer);
      }, 100);
    } else if (finishNodePressed) {
      setTimeout(() => {
        const answer = getInitialGrid(startNodeRow, startNodeCol, row, col);

        setGrid(answer);
      }, 100);
    }
  }

  function showModal() {
    window.onclick = function (event) {
      if (
        event.target.id === "myModal" ||
        event.target.id === "onClose" ||
        event.target.id === "learnMore"
      ) {
        setModal(false);
      }
    };
  }
  return (
    <div className="body">
      <Modal show={seeModal} />
      <NodeValues nodeValues={nodeValues} />
      <div>
        <button
          className={hasExecuted ? "disabled" : "button"}
          onClick={() => visualizeDijkstra()}
          disabled={hasExecuted}
        >
          Visualize Dijkstra's Algorithm
        </button>

        <button
          onClick={() => visualizeAstar()}
          disabled={hasExecuted}
          className={hasExecuted ? "disabled" : "button"}
        >
          Visualize A-Star's Algorithm
        </button>

        <button className="button" onClick={() => clearBoard()}>
          Clear Board
        </button>
      </div>
      <div className="grid">
        {firstGrid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {
                  row,
                  col,
                  isFinish,
                  isStart,
                  isWall,
                  distanceF,
                  distanceG,
                  distanceH,
                } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    distanceF={distanceF}
                    distanceG={distanceG}
                    distanceH={distanceH}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp(row, col)}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
