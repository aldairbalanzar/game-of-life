import React, { useState, useEffect, useCallback, useRef } from 'react';
import gameboy from './media/gameboy_graphic.png'
import produce from 'immer';
// import './App.css';
import './App.scss';

function App() {
  const [grid, setGrid] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500)
  const [genNum, setGenNum] = useState(1)
  const [palette, setPalette] = useState(['#2f5f2e', '#86a70f'])
  const defaultRows = 25;
  const defaultCols = 25;
  const neighbors = [
    [0,1],
    [0,-1],
    [1,-1],
    [1,0],
    [1,1],
    [-1,1],
    [-1,-1],
    [-1,0]
  ];

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying

  //handles grid size
  const handleGridSize = (rowNum, colNum) => {
    const rows = [];
    rowNum = rowNum ? rowNum : defaultRows
    colNum = colNum ? colNum : defaultCols
    for(let i = 0; i < rowNum; i++){
      rows.push(Array.from(Array(colNum), () => 0))
    }
    return rows
  }
  
  
  //hanndles alive or dead state of cell
  const handleCell = (row, col) => {
    // let newGrid = [...grid, grid[row][col] = grid[row][col] ? 0 : 1]
    // setGrid(newGrid)
    if(!isPlayingRef.current) {
      let newGrid = produce(grid, gridDraft => {
        gridDraft[row][col] = grid[row][col] ? 0 : 1
      })
      setGrid(newGrid)
    }else {
      window.alert('please stop game before clicking on cells')
    }
  }

  //handles value of each cell to be 1 or 0 randomly
  const handleRand = (rowNum, colNum) => {
    const rows = [];
    rowNum = rowNum ? rowNum : defaultRows
    colNum = colNum ? colNum : defaultCols
    for(let i = 0; i < rowNum; i++) {
      rows.push(Array.from(Array(colNum), () => Math.floor(Math.random() * Math.floor(2))))
    }
    setGrid(rows)
  }

  //clears grid, stops game, and resets genNum to 1
  const handleClear = (rowNum, colNum) => {
    const rows = [];
    rowNum = rowNum ? rowNum : defaultRows
    colNum = colNum ? colNum : defaultCols
    for(let i = 0; i < rowNum; i++) {
      rows.push(Array.from(Array(colNum), () => 0))
    }
    setGrid(rows)
    setGenNum(1)
  }

  //Starts game and handles cell living/dying logic
  const startGame = () => {
    if(!isPlayingRef.current) {
      return
    }
    setGrid(current => {
      return produce(current, gridDraft => {
        for(let i = 0; i < defaultRows; i++) {
          for(let j = 0; j < defaultCols; j++) {
            let neighborsNum = 0;
            neighbors.forEach(([x,y]) => {
              const newI = i + x;
              const newJ = j + y;

              if(newI >= 0 && newI < defaultRows && newJ >= 0 && newJ < defaultCols) {
                neighborsNum += current[newI][newJ];
              }
            });

            if(neighborsNum < 2 || neighborsNum > 3) {
              gridDraft[i][j] = 0;
            } else if(gridDraft[i][j] === 0 && neighborsNum === 3) {
              gridDraft[i][j] = 1;
            }
          }
        }
      })
    })
    setTimeout(startGame, speed);
  }

  const genCount = () => {
    if(isPlayingRef.current){
      setGenNum(genNum + 1)
      // console.log(genNum)
    }
    return
  }

  //inits our grid
  useEffect(() => {
    setGrid(handleGridSize())
  }, [])

  //rerenders our counter with updated state of genNum
  useEffect(() => {
    genCount()
  }, [grid])
    
  // console.log('GRID: ', grid)

  return (
    <div className="game-container">

      <div className="game-info">
        <div className="generation-container">
          <p>Generation: {genNum}</p>
        </div>
        <div className="speed-container">
          <p>Speed: {speed}</p>
          <button className="game-button" onClick={() => {setSpeed(speed + 50)}}>Slower</button>
          <button className="game-button" onClick={() => {speed <= 50 ? setSpeed(50) : setSpeed(speed - 50) }}>Faster</button>
        </div>
      </div>

      <div className="game-container">

        <div className="grid-container">
          <img className="gameboy" src={gameboy} alt="OG gameboy"/>
          <div className="grid"
              style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${defaultCols}, 8px)`
              }}>
            {grid.map((rows, i) =>
              rows.map((col, j) => (
                <div className="cell"
                key={`${i}-${j}`}
                onClick={() => {handleCell(i, j)}}
                style={{
                  width: 7,
                  height: 5,
                  backgroundColor: grid[i][j] ? palette[0] : palette[1],
                  border: 'solid 1px grey'
                }}
                ></div>
              ))
              )}
          </div> 
        </div>

        <div className="game-rules">
          <h1>Rules</h1>
          <ol>
            <li>If a live cell has less than 2 live neighbors, it'll die</li>
            <li>If a live cell has more than 3 live neighbors, it'll also die</li>
            <li>If a live cell has 2-3 live neighbors, it'll keeli living</li>
            <li>However, if a dead cell has 3 live neighbors, it'll be reborn</li>
          </ol>

          <div className="button-container">
            <h3>Controls: </h3>
            <button className="game-button" onClick={() => {
              setIsPlaying(!isPlaying)
              if(!isPlaying) {
                isPlayingRef.current = true;
                startGame()
              }}}>
              {isPlaying ? 'Stop' : 'Start'}
            </button>
            <button className="game-button"
              onClick={() => {
              setIsPlaying(false)
              isPlayingRef.current = false;
              handleClear()
            }}>
              Clear
            </button>
            <button className="game-button" onClick={()=>{handleRand()}}>Random</button>
          </div>
          <div className="palette-container"> 
            <h3>Color palette: </h3>
            <button className="game-button" onClick={() => {setPalette(['#2f5f2e', '#86a70f'])}}>GameBoy</button>
            <button className="game-button" onClick={() => {setPalette(['lightblue', 'pink'])}}>Cotton Candy</button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
