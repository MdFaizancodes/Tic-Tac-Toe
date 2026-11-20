function gameBoard() {
  let row = 3;
  let column = 3;
  const board = [];
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i][j] = cell();
    }
  }
  function getBoard() {
    return board;
  }
  function displayBoard() {
    return board.map((row) => row.map((cell) => cell.getValue()));
  }

  function markBoard(row, column, marker) {
    if (
      board[row][column].getValue() !== 0 ||
      board[row][column].getValue() == 1 ||
      board[row][column].getValue() == 2
    ) {
      return false;
    }
    board[row][column].dropValue(marker);
    return true;
  }

  function cell() {
    let value = 0;

    function dropValue(token) {
      value = token;
    }

    const getValue = () => value;

    return { dropValue, getValue };
  }

  return { getBoard, displayBoard, markBoard };
}

function gameController() {
  const board = gameBoard();
  let playerMove = 9;

  const players = [
    {
      marker: 1,
    },
    {
      marker: 2,
    },
  ];
  let currentPlayer = players[0];

  function switchPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  function playRound(row, column) {
    let currentMark = currentPlayer.marker;
    let result;
    if (board.markBoard(row, column, currentMark)) {
      result = winLogic();
      switchPlayer();
      return { currentMark, result };
    }
  }

  function winLogic() {
    const winCase = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    let playerPositions = board
      .getBoard()
      .flatMap((row, rowIndex) =>
        row.flatMap((cell, cellIndex) =>
          cell.getValue() == currentPlayer.marker
            ? [[rowIndex, cellIndex]]
            : [],
        ),
      );

    playerMove--;
    let check = winCase.some((value) =>
      value.every(([row, col]) =>
        playerPositions.some(([r, c]) => row == r && col == c),
      ),
    );
    if (check && playerMove >= 0) {
      return "win";
    } else if (playerMove <= 0 && !check) {
      return "draw";
    } else {
      return "playing";
    }
  }

  return { playRound};
}



(function () {
  let game;
  let newButton = document.querySelector(".newGameButton");
  const totalWin = {
    playerOne: 0,
    playerTwo: 0,
  };
  let player1WinScore = document.querySelector(".player1WinScore");
  let player2WinScore = document.querySelector(".player2WinScore");
  let startButton = document.querySelector(".submit");
  let firstName;
  let secondName;
  let restart = document.querySelector(".restartButton");
  let updateMsg = document.querySelector(".msg");

  newButton.addEventListener("click", () => {
    document.querySelector("#firstPlayerName").value = "";
    document.querySelector("#secondPlayerName").value = "";
    document.querySelector("#firstPlayerName").placeholder =
      "First Player Name";
    document.querySelector("#secondPlayerName").placeholder =
      "Second Player Name";
  });

  startButton.addEventListener("click", () => {
    game = gameController();
    player1WinScore.textContent = "Win: 0";
    player2WinScore.textContent = "Win: 0";
    totalWin.playerOne = 0;
    totalWin.playerTwo = 0;
    firstName = document.querySelector("#firstPlayerName").value;
    secondName = document.querySelector("#secondPlayerName").value;
    let player1NameElement = document.querySelector(".playerName1");
    let player2NameElement = document.querySelector(".playerName2");

    player1NameElement.textContent = "Name:";
    player2NameElement.textContent = "Name:";
    if (firstName === "") {
      firstName = "First Player";
    }
    if (secondName === "") {
      secondName = "Second Player";
    }
    player1NameElement.textContent += " " + firstName;

    player2NameElement.textContent += " " + secondName;

   

    startGame();
  });

   restart.addEventListener("click", () => {
      if (!game) return;
      game = gameController();
      startGame();
    });


  let cells = document.querySelectorAll(".cell");
  cells.forEach((Element) => {
    Element.addEventListener("click", markBoard);
  });
  function startGame() {
    cells.forEach((Element) => {
      Element.textContent = "";
      Element.classList.remove("o", "x");
      updateMsg.textContent = "";
      updateMsg.textContent = `${firstName}'s  Turn `;
    });
  }
  function markBoard(event) {
    if (!game) return;
    let row = Number(event.target.dataset.x);
    let col = Number(event.target.dataset.y);
    if (
      updateMsg.textContent !== firstName + " Win" &&
      updateMsg.textContent !== secondName + " Win" &&
      updateMsg.textContent !== "Draw"
    ) {
      let gameState = game.playRound(row, col);
      let mark = gameState?.currentMark;
      let gameResult = gameState?.result;

      if (gameResult == "win") {
        if (mark === 1) {
          event.target.textContent = "O";
          event.target.classList.add("o");
          updateMsg.textContent = firstName + " Win";
          totalWin.playerOne++;
          player1WinScore.textContent = "Win: " + totalWin.playerOne;
        } else if (mark === 2) {
          event.target.textContent = "X";
          event.target.classList.add("x");
          updateMsg.textContent = secondName + " Win";
          totalWin.playerTwo++;
          player2WinScore.textContent = "Win: " + totalWin.playerTwo;
        }
      } else if (gameResult == "draw") {
        updateMsg.textContent = "Draw";
        if (mark === 1) {
          event.target.textContent = "O";
          event.target.classList.add("o");
        } else if (mark === 2) {
          event.target.textContent = "X";
          event.target.classList.add("x");
        }
      } else if (gameResult !== "win" && gameResult !== "draw") {
        if (mark === 1) {
          updateMsg.textContent = `${secondName}'s  Turn `;
          event.target.textContent = "O";
          event.target.classList.add("o");
        } else if (mark === 2) {
          updateMsg.textContent = `${firstName}'s  Turn `;
          event.target.textContent = "X";
          event.target.classList.add("x");
        }
      }
    }
  }
})();
