import React, { useState, useEffect, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

function App() {
  const [grid, setGrid] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600)
  const [genNum, setGenNum] = useState(1)
  const [palette, setPalette] = useState(['#2f5f2e', '#86a70f'])
  const defaultRows = 32;
  const defaultCols = 68;
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
            setGenNum(genNum + 1)
          }
        }
      })
    })
    setTimeout(startGame, speed);
  }

  //inits our grid
  useEffect(() => {
    setGrid(handleGridSize())
  }, [])
    
  console.log('GRID: ', grid)
  console.log(speed)

  return (
    <div className="App">
      <button onClick={() => {
        setIsPlaying(!isPlaying)
        if(!isPlaying) {
          isPlayingRef.current = true;
          startGame()
        }}}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => {
        setIsPlaying(false)
        isPlayingRef.current = false;
        handleClear()
      }}>
        Clear
      </button>
      <button onClick={()=>{handleRand()}}>Random</button>
      <button onClick={() => {setSpeed(speed + 100)}}>Slower</button>
      <button onClick={() => {setSpeed(speed - 100)}}>Faster</button>
      <button onClick={() => {setPalette(['#2f5f2e', '#86a70f'])}}>GameBoy</button>
      <button onClick={() => {setPalette(['lightblue', 'pink'])}}>Cotton Candy</button>
      <p>{genNum}</p>
      <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${defaultCols}, 20px)`
          }}>
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div 
            className="grid"
            key={`${i}-${j}`}
            onClick={() => {handleCell(i, j)}}
            style={{
              width: 17,
              height: 15,
              backgroundColor: grid[i][j] ? palette[0] : palette[1],
              border: 'solid 1px grey'
            }}
            ></div>
          ))
          )}
      </div>
    </div>
  );
}

export default App;
