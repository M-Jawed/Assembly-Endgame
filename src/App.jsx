import { useState } from 'react'
import './App.css'
import { languages } from './languages'
import { getFarewellText, getRandomWord } from './utils'
import clsx from 'clsx'
import Confetti from 'react-confetti'

function App(){
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetter, setGuessedLetter] = useState([])

  const wrongGuessCount = guessedLetter.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split('').every(letter => guessedLetter.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1 
  const isGameOver = isGameLost || isGameWon
  const lastGuessedLetter = guessedLetter[guessedLetter.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)


  const alphabets = 'abcdefghijklmnopqrstuvwxyz'

  const languagesElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }

    const isEliminated = wrongGuessCount > index
    const className = clsx({
      eliminated: isEliminated
    })
    return (
      <span key={index} style={styles} className={className}> {lang.name} </span>
    )
  })

  const letterElements = currentWord.split('').map((letter, index) => {
    const isGuessed = guessedLetter.includes(letter)
    return (
      <span key={index}> {isGuessed ? letter.toUpperCase() : ''} </span>
    )
  })

  const keyboardElements = alphabets.split('').map((letter, index) => {
    const isGuessed = guessedLetter.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })

    return (
      <button 
        key={index} 
        className={className} 
        onClick={() => addGuessedLetter(letter)}
        disabled = {isGameOver}
      > 
      {letter.toUpperCase()} 
      </button>
    )
  })

  const gameStatus = clsx('game-status',{
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function addGuessedLetter(letter){
    setGuessedLetter(prev => {
      return guessedLetter.includes(letter) ? prev : [...prev, letter]
    })
  }

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect){
      return (
        <p className='farewell-message'> 
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }
    
    if(isGameWon){
      return (
        <>
          <h3>You win!</h3>
          <p>Well done!</p>
        </>
      )
    } 

    if(isGameLost){
      return (
        <>
          <h3>You lost!</h3>
          <p>Better luck next time!</p>
        </>
      )
    }

    return null
  }

  function newGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetter([])
  }

  return (
    <>
      {isGameWon ? <Confetti width={window.innerWidth} /> : ''}
      <main>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>

          <section className={gameStatus}>
            {renderGameStatus()}
          </section>

        </header>

        <section className='languages-section'>
          {languagesElements}
        </section>

        <section className='words'>
          {letterElements}
        </section>

        <section className='keyboard'>
          {keyboardElements}
        </section>

      {isGameOver ? <button className='new-game' onClick={newGame}>New game</button> : ''}
      </main>
    </>
  )
}

export default App