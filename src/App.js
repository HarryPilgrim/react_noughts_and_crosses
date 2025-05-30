import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button onClick={onSquareClick} className="square">
      {value}
    </button>
  );
}

export default function Game() {
  //const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  function toggleHistory() {
    setIsAscending(!ascending);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "go to move #" + move;
    } else {
      description = "go to game start";
    }

    if (move === currentMove) {
      return (
        <li key={move}>
          <span>you are at move {move}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  if (!ascending) {
    moves = [...moves].reverse();
  }

  return (
    <div className="game">
      <div className="gameBoard">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>
        <button title="toggleHistory" onClick={() => toggleHistory()}>
          Toggle History
        </button>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  // set up the constants and click handling in the parent function
  // can then store the values in the squares in the board, rather than
  // having to fetch them from child components
  function handleClick(i) {
    const nextSquares = squares.slice();
    if (
      nextSquares[i] == "X" ||
      nextSquares[i] == "O" ||
      calculateWinner(squares)
    ) {
      return;
    }
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let board = [];
  for (let row = 0; row < 3; row++) {
    let rowSquares = [];
    for (let column = 0; column < 3; column++) {
      let index = row * 3 + column;
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]} // assuming `squares` is passed in properly
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    //using the arrow function, means the function only called when clicked
    // if not using, the function would be called automatically and would loop infinetly
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

// <>
//   <div className="board-row">
//     <Square value={squares[0]} onSquareCLick={() => handleClick(0)} />
//     <Square value={squares[1]} onSquareCLick={() => handleClick(1)} />
//     <Square value={squares[2]} onSquareCLick={() => handleClick(2)} />
//   </div>
//   <div className="board-row">
//     <Square value={squares[3]} onSquareCLick={() => handleClick(3)} />
//     <Square value={squares[4]} onSquareCLick={() => handleClick(4)} />
//     <Square value={squares[5]} onSquareCLick={() => handleClick(5)} />
//   </div>
//   <div className="board-row">
//     <Square value={squares[6]} onSquareCLick={() => handleClick(6)} />
//     <Square value={squares[7]} onSquareCLick={() => handleClick(7)} />
//     <Square value={squares[8]} onSquareCLick={() => handleClick(8)} />
//   </div>
// </>
//   );
// }

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
