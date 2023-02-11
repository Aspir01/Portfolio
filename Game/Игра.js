const moveCells = document.getElementsByName("moveSquare");
const result = document.getElementById("result");
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const circle = `
  <svg id="circle">
    <circle r="45" cx="58" cy="58" stroke = "#0303ac" stroke-width="16" fill = "none"/>
  </svg>
`;
const cross = `
  <svg id="cross">
    <line x1="15" y1="15" x2="100" y2="100" stroke="red" stroke-width="16" />
    <line x1="100" y1="15" x2="15" y2="100" stroke="red" stroke-width="16" />
  </svg>
`;

let gameStarted = true;

//0 - X, 1 - O
let currentTeam = 0;
let teamMoves = [[], []];

const init = () => {
  for (let cell of moveCells) {
    cell.addEventListener("click", move);
  }
};

const clearBoard = () => {
  result.innerHTML = "";

  if (!result.classList.contains("hided")) {
    result.classList.add("hided");
  }

  for (let cell of moveCells) {
    updateCell(cell);
  }
};

const updateCell = (cell, team = null) => {
  if (typeof team !== "number") {
    cell.classList.remove("x", "o", "active");
    cell.innerHTML = "";
    return;
  }

  cell.innerHTML = team ? circle : cross;
  cell.classList.add(team ? "o" : "x");
};

const move = (e) => {
  if (!gameStarted) {
    return;
  }

  const cell = e.target.closest('.square');
  const id = Number(cell.id);

  if (teamMoves[0].includes(id) || teamMoves[1].includes(id)) {
    return;
  }

  teamMoves[currentTeam].push(id);
  updateCell(cell, currentTeam);

  const winner = getWinner();

  if (winner) {
    setWin(winner.team, winner.combo);
    return;
  } else if (teamMoves[0].length + teamMoves[1].length === 9) {
    setDraw();
    return;
  }

  currentTeam = Number(!currentTeam);
};

const getWinner = () => {
  for (let combo of winCombos) {
    if (
      moveCells[combo[0]].classList.contains("x") &&
      moveCells[combo[1]].classList.contains("x") &&
      moveCells[combo[2]].classList.contains("x")
    ) {
      return { team: 0, combo };
    }

    if (
      moveCells[combo[0]].classList.contains("o") &&
      moveCells[combo[1]].classList.contains("o") &&
      moveCells[combo[2]].classList.contains("o")
    ) {
      return { team: 1, combo };
    }
  }

  return null;
};

const finish = (message = "") => {
  gameStarted = false;
  result.innerHTML = message;
  result.classList.remove("hided");
};

const setWin = (winnerTeam, combo) => {
  finish(`Победил игрок ${winnerTeam ? "O" : "X"}!`);

  for (let cellIndex of combo) {
    moveCells[cellIndex].classList.add("active");
  }
};

const setDraw = () => {
  finish(`Ничья!`);
};

const startGame = () => {
  gameStarted = true;
  currentTeam = 0;
  teamMoves = [[], []];
  clearBoard();
};

function getRandom(min = 0, max = 255) {
  return Math.random() * (max - min) + min;
}

const changeBackground = () => {
  document.body.style.backgroundColor = `rgb(${getRandom()} ${getRandom()} ${getRandom()})`
};

init();