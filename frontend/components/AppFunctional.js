import React, {useState} from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const initialGrid = [  
    [1, 1], [2, 1], [3, 1],
    [1, 2], [2, 2], [3, 2],
    [1, 3], [2, 3], [3, 3],
  ]
  const URL = 'http://localhost:9000/api/result'
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [index, setIndex] = useState(4)
  const [grid, setGrid] = useState(initialGrid)


  function getXY(grid) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return grid[index]
  }

  function getXYMessage(grid) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `(${getXY(grid)[0]}, ${getXY(grid)[1]})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMoves(0)
    setIndex(4)
    setEmail('')
    setMessage()
    setGrid(initialGrid)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
     if (direction === "left" && index !== 0 && index !== 3 && index !== 6) {
      setIndex(index - 1)
      setMoves(moves + 1)
    } else if (direction === "right" && index !== 2 && index !== 5 && index !== 8) {
      setIndex(index + 1)
      setMoves(moves + 1)
    } else if (direction === "up" && index !== 0 && index !== 1 && index !== 2) {
      setIndex(index - 3) 
      setMoves(moves + 1)
    } else if (direction === "down" && index !== 6 && index !== 7 && index !== 8){
      setIndex(index + 3)
      setMoves(moves + 1)
    } else {
      setMessage(`You can't go ${direction}`)
    }
  }
 

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target
    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const payload = {"x": getXY(grid)[0], "y": getXY(grid)[1], "steps": moves, "email": email}
    axios.post(URL, payload)
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage(error.response.data.message))
    setEmail('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXYMessage(grid)}</h3>
        <h3 id="steps">You moved {moves} time{moves === 1? null: "s"}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex("left")}>LEFT</button>
        <button id="up" onClick={() => getNextIndex("up")}>UP</button>
        <button id="right" onClick={() => getNextIndex("right")}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex("down")}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}