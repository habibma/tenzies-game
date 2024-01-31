import React from "react";
import './App.css'
import { useEffect, useState } from "react";
import Die from "./Die";
import { Mode } from './Switch';
import { nanoid } from 'nanoid';

function App() {

  const [tenzies, setTenzies] = useState(false)
  const [diceType, setDiceType] = useState("numbers")
  const [darkMode, setDarkMode] = useState(false)
  const [rollCount, setRollCount] = useState(0);
  const [time, setTime] = useState({start: false, count: 0, clock: "00:00"})

  function toggleDarkMode() {
      setDarkMode(prevMode => !prevMode)
  }

  useEffect(() => {
    if (!time.start) {
      return;
    }
    const i = setInterval(() => {
      setTime(prevTime => ({...prevTime, count: prevTime.count + 1}))
    }, 1000)
    return ()=> clearInterval(i)
  }, [time.start])

  //seconds to clock format
  const secondsToClock = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaider = seconds % 60;
    setTime(prevTime => ({...prevTime, clock: `${minutes} : ${remaider}`}) );
  }

  // To initialize first dice faces
  const allNewDice = () => {
    const newArray = [];
    for (let i = 1; i <= 10; i++ ){
      newArray.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      });
    }
    return newArray
  }

  const [dice, setDice] = useState([])

  // End Game
  useEffect(() => {
    const allAreHeld = dice.every(die => die.isHeld)
    const allAreSame = dice.every(die => die.value === dice[0].value)
    if (allAreHeld && allAreSame) {
      setTenzies(true)
      setTime(prevTime => ({...prevTime, start: false}))
      secondsToClock(time.count)
    }
  },[dice])


  const rollDice = ()=>{
    if(!tenzies){
      setDice(prevDice => prevDice.map(die => die.isHeld ? die : {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      }));
      setRollCount(prevCount => prevCount + 1)
    } else {
      setTenzies(false)
      setDice(allNewDice());
      setRollCount(1)
      setTime({start: true, count: 0})
    }
  }

  const holdDice = (id) => {
    setDice(prevDice => prevDice.map(die => id === die.id ? {...die, isHeld:!die.isHeld} : die))
  }

  const diceElements = dice.map(
    die => <Die
             key={die.id}
             value={die.value}
             isHeld={die.isHeld}
             id={die.id}
             handleHold= {holdDice}
             diceType={diceType}
             darkMode={darkMode}
           />
  )

  return (
    <div className={darkMode ? "container dark": "container"}>
      <main>
            <p className="timer">Timer: {time.count}</p>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
            {diceElements}
        </div>
        {tenzies && dice[0] && <p><strong>YOU WON!</strong><br/><b>Number of Rolls: </b>{rollCount} | <b>Total Time: </b>{time.clock}</p>}
        <button className="roll-dice" onClick={rollDice}>{!dice[0] ? "Start" :tenzies ? "New Game" : "Roll"}</button>
        <p> Number of Rolls: {rollCount}</p>
        <div className="options">
            <label htmlFor="dice-type">Dice Type: </label>
            <select id="dice-type" value={diceType} onChange={({target}) => setDiceType(target.value)}>
              <option value="numbers">Numbers</option>
              <option value="dots">Dots</option>
            </select>
            <Mode
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
        </div>
      </main>
    </div>
  )
}

export default App
