import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pacmanPos: [5, 5],
      isFaceLeft: true,
      isOpen: true
    };
  }

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
    const handleThese = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!handleThese.includes(e.key)) return;
    // console.log(e.key);
    const key = e.key;
    const curPos = [...this.state.pacmanPos];
    // console.log(curPos);
    // console.log(this.gridBlocks);
    const curBlockInfo = this.gridBlocks[curPos[1] - 1][curPos[0] - 1];
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
    this.setState({ pacmanPos: curPos, isOpen, isFaceLeft });
  };

  render() {
    return (
      <div>
        <GameGrid
          pacmanPos={this.state.pacmanPos}
          isFaceLeft={this.state.isFaceLeft}
          isOpen={this.state.isOpen}
          gridBlocks={this.gridBlocks}
        />
      </div>
    );
  }
}

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

            return (
              <div key={`${row}${col}`} className={blockCss}>
                {col == props.pacmanPos[0] && row == props.pacmanPos[1] ? (
                  // <div id="pacman">{String.fromCharCode(9711)}</div>
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
                ) : (
                  ""
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
