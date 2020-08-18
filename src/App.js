// TODO:
// ghost facing
// restart button
// winning cherry, turn ghost to eatable

import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.initialState);
  }

  initialState = {
    pacmanPos: [5, 5],
    ghostPos: [2, 1],
    isFaceLeft: true,
    isOpen: true,
    hasDot: [
      [0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0]
    ],
    isGameOver: false,
    score: 1,
    isGhostFaceLeft: false,
    isGhostTurned: false,
    isGhostEaten: false
  };

  gridBlocks = [
    // [row, col] -> [top, right, bot, left], 1 = has border
    // grid is numbered 11, 15, ... 55 from the top left
    [
      [1, 0, 1, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 1, 0, 0]
    ],
    [
      [1, 0, 0, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 1, 0]
    ],
    [
      [0, 0, 1, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 1, 0, 0]
    ],
    [
      [1, 0, 0, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 1, 0]
    ],
    [
      [0, 0, 1, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [1, 1, 1, 0]
    ]
  ];

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress);
  };

  handleKeyPress = e => {
    if (this.state.isGameOver) return;
    const handleThese = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!handleThese.includes(e.key)) return;
    // console.log(e.key);
    const key = e.key;
    const curPos = [...this.state.pacmanPos];

    // console.log(curPos);
    // console.log(this.gridBlocks);
    const col = curPos[1] - 1;
    const row = curPos[0] - 1;
    const curBlockInfo = this.gridBlocks[col][row];
    let isOpen = this.state.isOpen;
    let isFaceLeft = this.state.isFaceLeft;
    if (key == "ArrowLeft" && curBlockInfo[3] != 1) {
      curPos[0]--;
      isFaceLeft = true;
    } else if (key == "ArrowRight" && curBlockInfo[1] != 1) {
      curPos[0]++;
      isFaceLeft = false;
    } else if (key == "ArrowUp" && curBlockInfo[0] != 1) {
      curPos[1]--;
    } else if (key == "ArrowDown" && curBlockInfo[2] != 1) {
      curPos[1]++;
    } else {
      return;
    }
    isOpen = !isOpen;
    const hasDot = JSON.parse(JSON.stringify(this.state.hasDot));
    let score = this.state.score;
    if (hasDot[curPos[1] - 1][curPos[0] - 1]) {
      score++;
      hasDot[curPos[1] - 1][curPos[0] - 1] = 0;
    }

    this.setState({
      pacmanPos: curPos,
      isOpen,
      isFaceLeft,
      hasDot,
      score
    });

    // move ghost
    if (this.state.isGhostEaten) return;
    const ghostPos = [...this.state.ghostPos];
    const ghostPosCol = ghostPos[1] - 1;
    const ghostPosRow = ghostPos[0] - 1;
    const ghostBlockInfo = this.gridBlocks[ghostPosCol][ghostPosRow];
    const possibleMoves = ghostBlockInfo.reduce((a, c, i) => {
      if (c == 0) a.push(i);
      return a;
    }, []);
    possibleMoves.push(-1); // stay
    // console.log({ possibleMoves });
    // [up, right, down, left]
    const ghostMove =
      possibleMoves[getRandomIntInclusive(0, possibleMoves.length - 1)];
    // console.log({ ghostMove });
    let isGhostFaceLeft = this.state.isGhostFaceLeft;
    if (ghostMove == 0) {
      // up
      ghostPos[1]--;
    } else if (ghostMove == 1) {
      // right
      ghostPos[0]++;
      isGhostFaceLeft = false;
    } else if (ghostMove == 2) {
      // down
      ghostPos[1]++;
    } else if (ghostMove == 3) {
      // left
      ghostPos[0]--;
      isGhostFaceLeft = true;
    }
    // console.log({ curPos, ghostPos });

    if (
      // even rows col less = game over, vice verse for odd
      (ghostPos[1] % 2 == 0 &&
        ghostPos[0] <= curPos[0] &&
        ghostPos[1] >= curPos[1]) ||
      (ghostPos[1] % 2 != 0 &&
        ghostPos[0] >= curPos[0] &&
        ghostPos[1] >= curPos[1])
    ) {
      if (this.state.isGhostTurned) {
        console.log("ghost eaten");
        score += 100;
        this.setState({ isGhostEaten: true });
      } else {
        console.log("game over");
        this.setState({ isGameOver: true });
        return;
      }
    }

    console.log({ ghostPos });
    let isGhostTurned = this.state.isGhostTurned;
    if (ghostPos[0] == 1 && ghostPos[1] == 1 && !this.state.isGhostTurned) {
      console.log("ghost turned");
      isGhostTurned = true;
    }

    this.setState({
      ghostPos,
      score,
      isGhostFaceLeft,
      isGhostTurned
    });
  };

  resetGame = () => {
    console.log("reset game");
    this.setState(this.initialState);
  };

  render() {
    return (
      <div>
        <GameGrid
          pacmanPos={this.state.pacmanPos}
          ghostPos={this.state.ghostPos}
          isFaceLeft={this.state.isFaceLeft}
          isOpen={this.state.isOpen}
          gridBlocks={this.gridBlocks}
          hasDot={this.state.hasDot}
          isGameOver={this.state.isGameOver}
          score={this.state.score}
          isGhostFaceLeft={this.state.isGhostFaceLeft}
          resetGame={this.resetGame}
          isGhostTurned={this.state.isGhostTurned}
          isGhostEaten={this.state.isGhostEaten}
        />
      </div>
    );
  }
}

const GameMessage = props => {
  return (
    <div id="score">
      <div>
        Score: <span className="green">{props.score}</span>
      </div>
      {props.isGameOver ? (
        <>
          <div className="red">Game Over</div>
          <button onClick={() => props.resetGame()}>Play Again</button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

const GameGrid = props => {
  const borderTypes = [
    "has-top-border",
    "has-right-border",
    "has-bottom-border",
    "has-left-border"
  ];

  let row = 0;
  let col = 0;

  return (
    <div id="game-container">
      <GameMessage
        score={props.score}
        isGameOver={props.isGameOver}
        resetGame={props.resetGame}
      />
      <div id="game-grid">
        {props.gridBlocks.map(gbRows => {
          row++;
          col = 0;
          return gbRows.map(gbCols => {
            col++;
            let blockCss = "";
            gbCols.map((colData, i) => {
              if (colData == 1) {
                if (i == 1 || i == 3) blockCss += " " + borderTypes[i];
                else if ((i == 0 || i == 2) && row % 2 != 0) {
                  // dont draw top/bottom every other row to avoid overlap
                  blockCss += " " + borderTypes[i];
                }
              }
            });
            // console.log({ row, col });
            let ret;
            if (
              col == props.pacmanPos[0] &&
              row == props.pacmanPos[1] &&
              !props.isGameOver
            ) {
              ret = (
                <div
                  id="pacman"
                  className={
                    props.isFaceLeft
                      ? props.isOpen
                        ? "pacman-open-left"
                        : "pacman-close-left"
                      : props.isOpen
                      ? "pacman-open-right"
                      : "pacman-close-right"
                  }
                ></div>
              );
            } else if (
              col == props.ghostPos[0] &&
              row == props.ghostPos[1] &&
              !props.isGhostEaten
            ) {
              ret = (
                <div
                  id="ghost"
                  className={
                    props.isGhostTurned
                      ? "ghost-dead"
                      : props.isGhostFaceLeft
                      ? "ghost-left"
                      : "ghost-right"
                  }
                ></div>
              );
            } else if (row == 1 && col == 1 && !props.isGhostTurned) {
              ret = <div className="cherry"></div>;
            } else if (props.hasDot[row - 1][col - 1]) {
              ret = <div className="dot">{String.fromCharCode(9711)}</div>;
            } else {
              ret = "";
            }
            return (
              <div key={`${row}${col}`} className={blockCss}>
                {ret}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
