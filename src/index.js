import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

function Square(props) {
    const checkXorY = (val) => {
        if (val === 'X') { return ' X' }
        if (val === 'Y') { return ' Y' }
        return ''
    }
    return (
      <button
        onClick={props.onClick}
        className= {'square' + checkXorY(props.value)}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
    )
  }

  render() { //render 9 squares
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

const initialState = { //the initial State for the game
    history: [{
        squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
    players: false, //players is false if player buttons have not been clicked
};

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState; //sets state of the Game parent component to initialState
    }
    handleClick(i){ // handles the clicking of each square
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i] || this.state.players == false){
            return; //prevents squared from getting clicked after the game is over or before the game starts.
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // determines if the X player is next to go
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber:history.length,
            xIsNext: !this.state.xIsNext,
        });
        console.log(squares);
        let random_array = squares[Math.floor(Math.random()*squares.length)];
        console.log(random_array);
    }
    jumpTo(step){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    twoplayers(){
        this.setState({
            players: 2
        });
    }
    oneplayer(){
        this.setState({
            players: 1
        });
    }
    renderTwoPlayerButtons(i){
        return(
            [
                <button className= "oneplayer" onClick={() => this.oneplayer()}>1 Player</button>,
                <button className= "twoplayers" onClick={() => this.twoplayers()}>2 Players</button>
            ]
        )
    }
    renderRestartButton(winner, draw){
        return(
            <button className= { winner || draw ? "show" : "hidden"} onClick={() => this.restart()}>Restart Game</button>
        )
    }
    restart(){ //reset all states to initial if the game ends and button is clicked
        this.setState(initialState);
    }
  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const draw = calculateDraw(current.squares);
      const moves = history.map((step, move) => {
          if(move > 0){
              return(
                  <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{'Go to move #' + move}</button>
                  </li>
              )
          }
      });

      let status;
      if (winner){
          status=  'Player '+ winner + ' wins!'
      }
      else if (draw) {
          status= 'The match is a draw!'
      }
      else{
          status= 'Turn: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    return (
      <div className="game">
        <h1>Tic-tac-toe</h1>
        <div className={`status ${ this.state.players ? "show" : "hidden"}`}>{status}</div>
        <div className = "middle_buttons">
            { this.state.players ? this.renderRestartButton(winner, draw) : this.renderTwoPlayerButtons()}
        </div>
        <div className= {`game-container ${ this.state.players ? "show" : "hidden"}`}>
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick= {(i) => this.handleClick(i)}
              />
            </div>
            <div className={`game-info ${moves.length > 1 ? "show" : "hidden"}`}>
              <p className = "history">History:</p>
              <ul>{moves}</ul>
            </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function calculateDraw(squares){
    if(squares.includes(null)){
        return null;
    }
    else{
        return true;
    }
}
