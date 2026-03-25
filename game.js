const HUMAN_PLAYER = "X";
const AI_PLAYER = "O";
const EMPTY_CELL = "";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createInitialState() {
  return {
    board: Array(9).fill(EMPTY_CELL),
    currentPlayer: HUMAN_PLAYER,
    startingPlayer: HUMAN_PLAYER,
    winner: null,
    winningCombo: [],
    isDraw: false,
    isLocked: false,
    scores: {
      human: 0,
      ai: 0,
      ties: 0,
    },
  };
}

function availableMoves(board) {
  return board.reduce((moves, value, index) => {
    if (value === EMPTY_CELL) {
      moves.push(index);
    }

    return moves;
  }, []);
}

function getWinningCombo(board) {
  return WINNING_COMBINATIONS.find((combination) => {
    const [first, second, third] = combination;
    return (
      board[first] !== EMPTY_CELL &&
      board[first] === board[second] &&
      board[second] === board[third]
    );
  }) || null;
}

function getWinner(board) {
  const combination = getWinningCombo(board);

  if (!combination) {
    return null;
  }

  return {
    player: board[combination[0]],
    combination,
  };
}

function isBoardFull(board) {
  return board.every((cell) => cell !== EMPTY_CELL);
}

function evaluateBoard(board) {
  const result = getWinner(board);

  if (!result) {
    return 0;
  }

  return result.player === AI_PLAYER ? 10 : -10;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  const score = evaluateBoard(board);

  if (score === 10) {
    return score - depth;
  }

  if (score === -10) {
    return score + depth;
  }

  if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const move of availableMoves(board)) {
      board[move] = AI_PLAYER;
      bestScore = Math.max(bestScore, minimax(board, depth + 1, false, alpha, beta));
      board[move] = EMPTY_CELL;
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (const move of availableMoves(board)) {
    board[move] = HUMAN_PLAYER;
    bestScore = Math.min(bestScore, minimax(board, depth + 1, true, alpha, beta));
    board[move] = EMPTY_CELL;
    beta = Math.min(beta, bestScore);

    if (beta <= alpha) {
      break;
    }
  }

  return bestScore;
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves(board)) {
    board[move] = AI_PLAYER;
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[move] = EMPTY_CELL;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function nextTurnMessage(currentPlayer) {
  return currentPlayer === HUMAN_PLAYER
    ? "Din tur. Saet dit kryds."
    : "Computeren taenker over sit traek...";
}

function createGame(rootDocument) {
  const boardElement = rootDocument.querySelector("#board");
  const cellElements = Array.from(rootDocument.querySelectorAll(".cell"));
  const statusElement = rootDocument.querySelector("#status-message");
  const resetButton = rootDocument.querySelector("#reset-button");
  const starterButtons = Array.from(rootDocument.querySelectorAll(".starter-button"));
  const humanScoreElement = rootDocument.querySelector("#human-score");
  const aiScoreElement = rootDocument.querySelector("#ai-score");
  const tieScoreElement = rootDocument.querySelector("#tie-score");

  const state = createInitialState();

  function syncScoreboard() {
    humanScoreElement.textContent = String(state.scores.human);
    aiScoreElement.textContent = String(state.scores.ai);
    tieScoreElement.textContent = String(state.scores.ties);
  }

  function renderBoard() {
    cellElements.forEach((cell, index) => {
      const value = state.board[index];
      cell.textContent = value;
      cell.dataset.value = value;
      cell.disabled =
        state.isLocked ||
        state.currentPlayer === AI_PLAYER ||
        value !== EMPTY_CELL;
      cell.classList.toggle("is-winning", state.winningCombo.includes(index));
    });

    boardElement.classList.toggle("is-locked", state.isLocked);
  }

  function renderStarterButtons() {
    starterButtons.forEach((button) => {
      const isActive = button.dataset.starter === (state.startingPlayer === HUMAN_PLAYER ? "human" : "ai");
      button.classList.toggle("is-active", isActive);
    });
  }

  function renderStatus(message) {
    statusElement.textContent = message;
  }

  function concludeRound(result) {
    state.isLocked = true;

    if (result) {
      state.winner = result.player;
      state.winningCombo = result.combination;

      if (result.player === HUMAN_PLAYER) {
        state.scores.human += 1;
        renderStatus("Du vandt partiet. Maskinen maa pudse sine gear.");
      } else {
        state.scores.ai += 1;
        renderStatus("Computeren vandt. Endnu et traek bedre end forventet.");
      }
    } else {
      state.isDraw = true;
      state.scores.ties += 1;
      renderStatus("Remis. Braettet er fyldt uden en vinder.");
    }

    syncScoreboard();
    renderBoard();
  }

  function evaluateGameState() {
    const result = getWinner(state.board);

    if (result) {
      concludeRound(result);
      return true;
    }

    if (isBoardFull(state.board)) {
      concludeRound(null);
      return true;
    }

    return false;
  }

  function placeMove(index, player) {
    if (state.isLocked || state.board[index] !== EMPTY_CELL) {
      return false;
    }

    state.board[index] = player;
    state.currentPlayer = player === HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER;
    renderBoard();
    return true;
  }

  function handleAiTurn() {
    if (state.isLocked || state.currentPlayer !== AI_PLAYER) {
      return;
    }

    renderStatus(nextTurnMessage(AI_PLAYER));
    state.isLocked = true;
    renderBoard();

    window.setTimeout(() => {
      state.isLocked = false;
      const move = findBestMove([...state.board]);

      if (move === null || move === undefined) {
        evaluateGameState();
        return;
      }

      placeMove(move, AI_PLAYER);

      if (!evaluateGameState()) {
        renderStatus(nextTurnMessage(HUMAN_PLAYER));
        renderBoard();
      }
    }, 420);
  }

  function resetBoard(startingPlayer = state.startingPlayer) {
    state.board = Array(9).fill(EMPTY_CELL);
    state.currentPlayer = startingPlayer;
    state.startingPlayer = startingPlayer;
    state.winner = null;
    state.winningCombo = [];
    state.isDraw = false;
    state.isLocked = false;

    renderStarterButtons();
    renderBoard();
    renderStatus(nextTurnMessage(state.currentPlayer));

    if (state.currentPlayer === AI_PLAYER) {
      handleAiTurn();
    }
  }

  function handleHumanMove(event) {
    const index = Number(event.currentTarget.dataset.index);

    if (!Number.isInteger(index) || state.currentPlayer !== HUMAN_PLAYER) {
      return;
    }

    const hasMoved = placeMove(index, HUMAN_PLAYER);

    if (!hasMoved) {
      return;
    }

    if (!evaluateGameState()) {
      handleAiTurn();
    }
  }

  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleHumanMove);
  });

  starterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextStarter = button.dataset.starter === "ai" ? AI_PLAYER : HUMAN_PLAYER;
      resetBoard(nextStarter);
    });
  });

  resetButton.addEventListener("click", () => {
    resetBoard(state.startingPlayer);
  });

  syncScoreboard();
  resetBoard(HUMAN_PLAYER);

  return {
    state,
    resetBoard,
    placeMove,
    handleAiTurn,
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    createGame(document);
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    AI_PLAYER,
    HUMAN_PLAYER,
    WINNING_COMBINATIONS,
    availableMoves,
    createInitialState,
    evaluateBoard,
    findBestMove,
    getWinner,
    isBoardFull,
    minimax,
  };
}