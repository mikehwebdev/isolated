import { useEffect, useState } from "react"
import { initialLayout } from "./levelLayouts"
import { ventArray } from "./levelLayouts"
import { codeDatabase } from "./miniGameData"
function App() {
  
function alienExit(){
   return ventArray[random(ventArray.length)]
}

let alienExitValue = alienExit()
const [textAlert, setTextAlert] = useState(false)
const [gamesMachineToggled, setGamesMachineToggled] = useState(false)
const [scannerToggled, setScannerToggled] = useState(false)
const [gameToggled, setGameToggled] = useState(false)
const [pingToggled, setPingToggled] = useState(false)
const [pingRevealed, setPingRevealed] = useState(false)
const [alienPaused, setAlienPaused] = useState(false)
const [textAlertContents, setAlertContents] = useState('This is a state message')
const [alienAlerted, setAlienAlerted] = useState(false)
const [alienExitedVent, setAlienExitedVent] = useState(false)
const [levelLayout, setLevelLayout] = useState(initialLayout)
const [playerTargetPosition, setPlayerTargetPosition] =useState(null)
const [currentPlayerPosition, setCurrentPlayerPosition] = useState(32)
const [showModal, setShowModal] = useState(false)
const [move, setMove] = useState(0)
const [currentAlienPosition, setCurrentAlienPosition] = useState(alienExitValue)
const [timer, setTimer] = useState(0)
const [keyCode, setKeyCode] = useState([ 
  {
    index:0,
    letter:codeDatabase[random(codeDatabase.length)],
    toggled:false
  },
  {
    index:1,
    letter:codeDatabase[random(codeDatabase.length)],
    toggled:false
  },
  {
    index:2,
    letter:codeDatabase[random(codeDatabase.length)],
    toggled:false
  }
])

console.log(keyCode)
function time(){
  setTimer(prev => prev+1)
}

//Utils

function random(num){
  return Math.floor(Math.random()* num ) 
}


  useEffect(()=>{
  setTimeout(time, 1000)
  },[timer])

function adjacentTileCalculator(e){
  
  let target = e.target.id
  
  const up = Number(target) - 12
  const down = Number(target) + 12
  const left = Number(target) - 1
  const right = Number(target) + 1
  
  function checkForJourney() {
    return levelLayout[up] && levelLayout[up].contents.includes('journey') || levelLayout[down] &&levelLayout[down].contents.includes('journey')|| levelLayout[left].contents.includes('journey') || levelLayout[right].contents.includes('journey') ? true : false 
  }
  
  function checkForPlayer() {
    return levelLayout[up].contents === 'player'|| levelLayout[down].contents === 'player'|| levelLayout[left].contents === 'player'|| levelLayout[right].contents === 'player' ? true : false 
  }
  
   return checkForJourney() || checkForPlayer() ? true : false
}  

function clearFog(){
  setLevelLayout(prev => {
    return prev.map(square =>{
      
      if (square.id === currentPlayerPosition || square.id === currentPlayerPosition -13 || square.id === currentPlayerPosition -12|| square.id === currentPlayerPosition -11 || square.id === currentPlayerPosition -1 || square.id === currentPlayerPosition +1 || square.id === currentPlayerPosition +11 || square.id === currentPlayerPosition +12 || square.id === currentPlayerPosition +13) {
         return {...square, background:square.background === 'fog' ? 'torch' : 'torch'}
        
      } else {
        return {...square, background:square.background.replace('torch', '') }
      }
    })
  })
}

function journeyRoute(e){
  const atc = adjacentTileCalculator(e)
 
  setLevelLayout(prev =>
    {
     return prev.map(square => {     

      function finishPlayerMove () {
        if (square.id == e.target.id && !square.contents.includes('journey') && !square.contents.includes('wall')) {
          setPlayerTargetPosition(square.id)
        } 
      }
      function result (){
        
        if (atc && !square.contents.includes('journey') && !square.contents.includes('wall')) {
              if (move === 0) {
                finishPlayerMove()
                return 'journey'
              } else if (move === 1){
                finishPlayerMove()
                return 'journey1'
              } else if (move === 2) {
                finishPlayerMove()
                return 'journey2'
                } else if (move > 2){
                  
                  return ''
                }
              } else {
                
                return square.contents
              }
             }  
          
     return square.id == e.target.id ?
     {
       ...square,
       contents:result()
     }
     :
     square
    })
  }
    )

  
}


  function checkMoves(){
    setMove(0)
    levelLayout.map(square => {
      if (square.contents.includes('journey'))
      {
        setMove(prev=> prev+1)  
      
      }
  })
} 

function movePlayer(){
  setShowModal(false)
  flushPlayer()
  flushJourney()
  setCurrentPlayerPosition(playerTargetPosition)
}

useEffect(()=>{
  checkMoves()
},[time])

//Player

function flushPlayer(){
  setLevelLayout(prev => {
    return prev.map(square => {
      return {
        ...square,
        contents: square.contents.replace('player', '')
    }
  })
 }
 ) 

}

function flushJourney(){
  setLevelLayout(prev => {
    return prev.map(square => {
      return {
        ...square,
        contents: square.contents.replace('journey', '')
    }
  })
 }
 ) 
}

function addPlayer(){
  setLevelLayout(prev => {
    return prev.map(square => {
      return (square.id === currentPlayerPosition) ?
    {...square,
      contents:'player'
    }
    :
    square
   }
     )
 }
 ) 
}

//Alien



function flushAlien(){
  setLevelLayout(prev => {
    return prev.map(square => {
      return {
        ...square,
        contents: square.contents.replace('alien', '')
    }})})  
}

function addAlien(){
  setLevelLayout(prev => {
    return prev.map(square => {
      return (square.id === currentAlienPosition) ?
    {...square,
      contents:'alien'
    }
    :
    square
})}) 
}

function alienMove(){
  
 function direction (){
    let direction = random(4)
    if (direction === 0) {
      return -12
    } else if (direction === 1) {
      return +1 
    } else if (direction === 2) {
      return +12
    } else if (direction ===3){
      return -1
    }
  } 

function newAlienPosition(){
  let directionInteger = direction()
  let distanceInteger = 1
  let positionChange = directionInteger * distanceInteger
  return currentAlienPosition + positionChange 
}
let verifiedPosition = null
do {
  verifiedPosition = newAlienPosition()
  
}
while (levelLayout[verifiedPosition].contents.includes('wall')) 

 return verifiedPosition
}

useEffect(()=> {
  flushPlayer()
  addPlayer()  
  clearFog()
}, [currentPlayerPosition])

useEffect(()=> {
      if (levelLayout[currentAlienPosition].background.includes('vent') && alienExitedVent ) {
        flushAlien()  
        setAlienExitedVent(false)
        setCurrentAlienPosition(alienExit())
        playVentIn()
      } else if (levelLayout[currentAlienPosition].background.includes('vent') && !alienExitedVent) {
        setAlienPaused(true)
        let randomExit = random(10)
        if (randomExit === 1) {
        setCurrentAlienPosition(alienMove())
          setAlienExitedVent(true)
          addAlien()
          playVentOut()
          setAlienPaused(false)
        }
      
      }  else if (alienAlerted) {

        setTimeout(()=>{
          setAlienAlerted(false)
          setAlienPaused(false)
        },4050)
        flushAlien()
            setAlienPaused(true)
            setLevelLayout(prev => {
            return prev.map(square => {
              return (square.id === currentAlienPosition) ?
            {...square,
              contents:'alien ceilingJump'
            }
            :square
               })}
        ) 
        setTimeout(flushAlien, 1050)
        
        let alertPosition = currentPlayerPosition        
        setCurrentAlienPosition(alertPosition)
        
          setTimeout(()=>{
            setLevelLayout(prev => {
              return prev.map(square => {
                return (square.id === alertPosition) ?
              {...square,
                contents:'alien ceilingDrop'
              }
              :
              square
             })}
        )   
          }, 3000)
          playAlienScreech()
          setAlienAlerted(false)
      } else {
        flushAlien()
        setCurrentAlienPosition(alienMove())
        addAlien()
      } 
}, [timer])

//Sounds
const ventOutSound = new Audio("./src/sounds/ventOut.wav")
const ventInSound = new Audio("./src/sounds/ventIn.wav")
const alienScreechSound = new Audio("./src/sounds/alienScreech.wav")
const spookyRandom = new Audio("./src/sounds/spook rattle.wav")

useEffect(()=>{
  let randomScarySound = random(150)
  if (randomScarySound === 1) {
    spookyRandom.play()
  } 
}, [timer])
  

function playVentOut(){
  ventOutSound.play()
}

function playVentIn(){
  ventInSound.play()
}

function playAlienScreech(){
  alienScreechSound.play()
}

function scrollText(){
  setTextAlert(prev=> !prev)
  setTimeout(()=>{
    setTextAlert(prev => !prev)
}, 3000)
}

function ping(){
  setPingRevealed(true)
  //add motion animation here - position absolute
}

const pingDisplayRevealed = levelLayout.map(square => {
  if (square.contents.includes('computer')) {
    return <div key={square.id} className="pinged"></div>
  } else {
    return <div key={square.id} className="not-pinged"></div>
  }
}) 

const pingDisplay = levelLayout.map(square => {
    return <div key={square.id} className="not-pinged"></div>

}) 

function scanner(){
  setScannerToggled(prev => !prev)
  setTimeout(()=>{
    if (pingToggled) {
      setPingToggled(!pingToggled)
      setPingRevealed(!pingRevealed)
    }
  },1000)
}

function gamesMachine(){
  setGamesMachineToggled(prev => !prev)
  
  
}

function dragStart() {
  console.log('drag start')
}

function dragDrop() {
  console.log('dropped')
    setShowModal(true)
}


function dragEnter(e){
journeyRoute(e)
}



const displayLayout = levelLayout.map(square => 
  <div 
  key={square.id}
  id={square.id} 
  className={`square ${square.background} ${square.contents}`}
  draggable={square.contents === 'player'? true : false}
  onDragStart={dragStart}
  onDragOver={e=> e.preventDefault()}
  onDragEnter={e=> dragEnter(e)}
  onDrop={dragDrop}
  onDragEnd={e=> e.preventDefault()}
  >
    
  </div>
)


const keyHoleElements = keyCode.map(keyHole => <div key={keyHole.index} className={`keyhole ${keyHole.toggled? 'keyhole-toggled' : ''}`}>{keyHole.letter}</div>)

function codeSelector(e){
console.log('test')
setKeyCode(prev => {
  return prev.map(key =>{
  return key.letter === e.target.textContent? {...key, toggled:true} : key
  }
)})
//add static background
//if all keyholes are filled play good npise and flash squares before shutting down console
}



const keyElements = codeDatabase.map(key => 
  <div 
  key={key} 
  className="key"
  onMouseDown={(e) => codeSelector(e)}
  >
  {key}
  </div>
)

  return (
    <div className="app">
    <div className="container">
      <div className="action-buttons-container">
        <button>Up</button>
        <br/>
        <button>Down</button>
        <button>Left</button>
        <button>Right</button>
      </div>
      <div className="game-board">
        {displayLayout}
        
        { showModal && <div className="modal">
          Are you sure?
          <a onClick={movePlayer}> Yes / No</a>
        </div>}
        <div className={`games-machine ${gamesMachineToggled? "games-machine-engaged" : ''}`}>
        <div className={`games-machine-welcome ${gamesMachineToggled? "games-machine-welcome-engaged" : ''}`}>
            MichaelSoft
            <div className={` games-machine-intro-message ${gamesMachineToggled? "games-machine-intro-message-engaged": ''}`}>Cunning game based hacking system</div>
            <div className="progress-bar-container">{gamesMachineToggled  && <div className="progress-bar"
            onClick={() => {
              setGameToggled(prev => !prev)
            }} >HACK</div>}</div>
          </div>
          <div className={`game-grid ${gameToggled? "game-grid-engaged" : '' }`}>
            <h2>Match the code</h2>
            <div className="keyholes-container">
              {keyHoleElements}
            </div>
            <div className="keys-container">
              {keyElements}
            </div>
          </div>
        </div>
        <div className="">

        </div>
        <div className={`scanner-container ${scannerToggled? "scanner-container-engaged": ''}`}>
          <div className={`scanner-welcome ${scannerToggled? "scanner-welcome-engaged" : ''}`}>
            MichaelSoft
            <div className={` scanner-intro-message ${scannerToggled? "scanner-intro-message-engaged": ''}`}>Object Detection System</div>
            <div className="progress-bar-container">{scannerToggled  && <div className="progress-bar" onClick={() => {
              setPingToggled(prev => !prev)

              }}>START</div>}</div>
          </div>
          <div className={`ping-grid ${pingToggled ? "ping-grid-engaged": ''} `}>
            {pingRevealed ? pingDisplayRevealed : pingDisplay}
          </div>
        
        </div>
      </div>
      
      
        <div className="action-buttons-container"><button onClick={() => {
          if (alienExitedVent) {
            setAlienAlerted(true)
        }
          }}>Alien Alerted</button>
          <button onClick={scrollText}>Scolling text activte</button>
          <button onClick={scanner}>Scanner</button>
          <button onClick={gamesMachine}>PC access</button>
          <button onClick={ping}>Ping</button>
          
          </div>
    </div>
    <div className={`scrolling-text-container ${textAlert ? "scroll-text-active" : ''}`}>{textAlertContents}</div>
    </div>
  )
}

export default App
