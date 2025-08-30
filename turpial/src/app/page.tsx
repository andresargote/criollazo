"use client"
import styles from "./styles/page.module.css";
import { useEffect, useMemo, useState } from "react";
import { GridPosition, LetterState, GameState } from "./types";
import useBoard from "./hooks/useBoard";
import { useBoardNavigation } from "./hooks/useBoardNavigation";
import {
  playSound,
  initializeAudio,
  getRandomWord,
  isValidLetter,
  isValidWord,
  evaluateAttempt,
  hasWon,
  calculateLetterCount
} from "./utils";
import { Keyboard } from "./components/Keyboard";
import { Header } from "./components/Header";


export default function Home() {
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [secretWord, setSecretWord] = useState(getRandomWord())
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const { isLoading, board, updateBoard, maxCellIndex, maxRowIndex } = useBoard({
    cellsPerRow: secretWord.length,
    totalRows: secretWord.length >= 6 ? 6 : secretWord.length + 1
  })

  const [cursorPosition, setCursorPosition] = useState<GridPosition>({
    row: 0,
    cell: 0
  })

  const { getNextCellIndex, getPreviousCellIndex, getNextRowIndex, canMoveToNextCell, canMoveToNextRow } = useBoardNavigation({
    position: cursorPosition,
    maxCellIndex,
    maxRowIndex

  })

  const [gameStatus, setGameStatus] = useState<string>(GameState.PLAYING)

  const letterCount = useMemo(() => calculateLetterCount(secretWord), [secretWord])

  useEffect(() => {
    if (gameStatus === GameState.WON) {
      setTimeout(() => {
        playSound('win')
        setShowGameOver(true)
      }, 500)
    }

    if (gameStatus === GameState.LOST) {
      setTimeout(() => {
        playSound('lose')
        setShowGameOver(true)
      }, 500)
    }

  }, [gameStatus])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()

      if (event.key === 'Escape') {
        if (showHowToPlay) {
          setShowHowToPlay(false)
          return
        }
        if (showGameOver) {
          setShowGameOver(false)
          return
        }
      }

      if (event.target && (event.target as HTMLElement).tagName === 'BUTTON') {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey || (event.shiftKey && key !== event.key.toUpperCase())) {
        return
      }

      if (showHowToPlay || showGameOver) {
        return
      }

      if (key === "ENTER" || key === "BACKSPACE" || isValidLetter(key)) {
        event.preventDefault()
        processKeyInput(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [board, gameStatus, cursorPosition, showHowToPlay, showGameOver])

  const moveCursorToCell = (row: number, cell: number) => {
    handleInitializeAudio();
    if (row !== cursorPosition.row || gameStatus !== GameState.PLAYING) return

    setCursorPosition({
      row: cursorPosition.row,
      cell
    })
  }

  const advanceToNextCell = (): GridPosition => {
    return {
      ...cursorPosition,
      cell: getNextCellIndex()
    }
  }

  const advanceToNextRow = (): GridPosition => {

    return {
      cell: 0,
      row: getNextRowIndex()
    }
  }

  const moveToPreviousCell = (): GridPosition => {
    return {
      ...cursorPosition,
      cell: getPreviousCellIndex()
    }
  }

  const handleInitializeAudio = () => {
    if (!audioInitialized) {
      const initialized = initializeAudio();
      if (initialized) {
        setAudioInitialized(true);
      }
    }
  };

  const startNewGame = () => {
    const newWord = getRandomWord();
    setSecretWord(newWord);
    setGameStatus(GameState.PLAYING);
    setAttempts(0);
    setCursorPosition({ row: 0, cell: 0 });
    setShowGameOver(false);

    window.location.reload();
  };

  const processKeyInput = (key: string) => {
    handleInitializeAudio();
    if (gameStatus !== GameState.PLAYING) return
    const canFillCell = isValidLetter(key) && canMoveToNextCell(cursorPosition.cell)
    const currentWord = board[cursorPosition.row].map((cell) => cell.value).join('')
    const canEnterRow = key === "ENTER" && canMoveToNextRow(cursorPosition.row) && isValidWord(currentWord)
    const canBackspace = key === "BACKSPACE"

    if (key === "ENTER" && (!canMoveToNextRow(cursorPosition.row) || !isValidWord(currentWord))) {
      playSound('error')
      return
    }

    if (isValidLetter(key) && !canMoveToNextCell(cursorPosition.cell)) {
      playSound('error')
      return
    }

    if (canFillCell) {
      const updatedBoard = [...board]
      updatedBoard[cursorPosition.row][cursorPosition.cell] = {
        value: key,
        state: LetterState.FILLED
      }

      updateBoard(updatedBoard)
      setCursorPosition(advanceToNextCell())
      playSound('key')
      return
    }

    if (canEnterRow) {
      const currentRow = board[cursorPosition.row]
      const hasEmptyCell = currentRow.find((cell) => cell.state === LetterState.EMPTY)

      if (hasEmptyCell) {
        playSound('error')
        return
      }

      const attemptEvaluation = evaluateAttempt(currentRow, secretWord, letterCount)
      const gameWon = hasWon(attemptEvaluation)
      const updatedBoard = [...board]
      updatedBoard[cursorPosition.row] = attemptEvaluation
      updateBoard(updatedBoard)
      playSound('enter')

      if (gameWon) {
        setAttempts(cursorPosition.row + 1)
        setGameStatus(GameState.WON)
      } else {
        if (cursorPosition.row === maxRowIndex) {
          setAttempts(cursorPosition.row + 1)
          setGameStatus(GameState.LOST)
        } else {
          setCursorPosition(advanceToNextRow())
        }
      }
    }

    if (canBackspace) {
      const updatedBoard = [...board]

      if (updatedBoard[cursorPosition.row][cursorPosition.cell]?.state === LetterState.FILLED) {
        updatedBoard[cursorPosition.row][cursorPosition.cell] = {
          value: "",
          state: LetterState.EMPTY
        }
      } else {
        updatedBoard[cursorPosition.row][cursorPosition.cell - 1] = {
          value: "",
          state: LetterState.EMPTY
        }
      }


      updateBoard(updatedBoard)
      setCursorPosition(moveToPreviousCell())
      playSound('backspace')
      return
    }
  }

  const cellStyle = (state: LetterState) => {
    if (state === LetterState.HIT) {
      return styles.hit
    }

    if (state === LetterState.CLOSE) {
      return styles.close
    }

    if (state === LetterState.MISS) {
      return styles.miss
    }

    return null
  }




  return (
    <>
      <Header />
      <main className={styles.game} role="main" aria-label="Juego de palabras Criollazo">
        {isLoading ? <p>Cargando tablero...</p> : (

          <>
            <div className={styles.gameHeader}>
              <button
                className={styles.howToPlayButton}
                onClick={() => setShowHowToPlay(true)}
                aria-label="Mostrar instrucciones del juego"
              >
                ¿Cómo jugar?
              </button>
            </div>
            <section className={styles.board} role="grid" aria-label={`Tablero de juego, palabra secreta de ${secretWord.length} letras`}>
              {
                board.map((row, rowIndex) => {
                  return (
                    <div key={`row_${rowIndex}`} className={styles.row} role="row" aria-label={`Fila ${rowIndex + 1}`}>
                      {
                        row.map((cell, cellIndex) => {
                          return (
                            <div
                              key={`row_${rowIndex}_col${cellIndex}`}
                              className={`${styles.cell} ${cellIndex === cursorPosition.cell && rowIndex === cursorPosition.row && styles.cellCurrent} ${cell.state !== LetterState.EMPTY && cell.state !== LetterState.FILLED ? cellStyle(cell.state) : ''}`}
                              onClick={() => moveCursorToCell(rowIndex, cellIndex)}
                              tabIndex={gameStatus === GameState.PLAYING && rowIndex === cursorPosition.row ? 0 : -1}
                              role="button"
                              aria-label={`Celda ${cellIndex + 1} de la fila ${rowIndex + 1}${cell.value ? `, contiene ${cell.value}` : ', vacía'}${cell.state === LetterState.HIT ? ', correcta' : cell.state === LetterState.CLOSE ? ', letra correcta posición incorrecta' : cell.state === LetterState.MISS ? ', letra incorrecta' : ''}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  moveCursorToCell(rowIndex, cellIndex)
                                }
                              }}
                            >
                              {cell.value}
                            </div>
                          )
                        })
                      }

                    </div>
                  )
                })
              }
            </section>
            <Keyboard onKeyPressed={processKeyInput} gameStatus={gameStatus as GameState} />
          </>
        )}

        {showHowToPlay && (
          <div className={styles.modalOverlay} role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 id="modal-title">¿Cómo jugar Criollazo?</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowHowToPlay(false)}
                  aria-label="Cerrar modal"
                >
                  ×
                </button>
              </div>
              <div className={styles.modalContent}>
                <p>¡Bienvenido a <strong>Criollazo</strong>! El juego de palabras venezolanas.</p>

                <h3>Objetivo:</h3>
                <p>Adivina la palabra venezolana secreta de 5 letras en máximo 6 intentos.</p>

                <h3>Cómo jugar:</h3>
                <ul>
                  <li>• Escribe una palabra de 5 letras y presiona Enter</li>
                  <li>• Las letras cambiarán de color para darte pistas:</li>
                </ul>

                <div className={styles.colorGuide}>
                  <div className={styles.exampleRow}>
                    <div className={`${styles.exampleCell} ${styles.hit}`}>A</div>
                    <span>Verde: La letra está en la posición correcta</span>
                  </div>
                  <div className={styles.exampleRow}>
                    <div className={`${styles.exampleCell} ${styles.close}`}>R</div>
                    <span>Amarillo: La letra está en la palabra pero en otra posición</span>
                  </div>
                  <div className={styles.exampleRow}>
                    <div className={`${styles.exampleCell} ${styles.miss}`}>E</div>
                    <span>Gris: La letra no está en la palabra</span>
                  </div>
                </div>

                <h3>Palabras:</h3>
                <p>Solo palabras <strong>venezolanas</strong> como: AREPA, CHAMO, PANA, VAINA...</p>

                <p><strong>¡Échale bolas y a jugar!</strong></p>
              </div>
            </div>
          </div>
        )}

        {showGameOver && (
          <div className={styles.modalOverlay} role="dialog" aria-labelledby="gameover-title" aria-modal="true">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 id="gameover-title">
                  {gameStatus === GameState.WON ? '¡Ganaste, pana!' : '¡Se acabó la vaina!'}
                </h2>
              </div>
              <div className={styles.modalContent}>
                {gameStatus === GameState.WON ? (
                  <>
                    <p>¡Brutal! Adivinaste la palabra <strong>{secretWord}</strong></p>
                    <p>Lo lograste en <strong>{attempts}</strong> {attempts === 1 ? 'intento' : 'intentos'}</p>
                  </>
                ) : (
                  <>
                    <p>No pudiste adivinar la palabra</p>
                    <p>La palabra era: <strong>{secretWord}</strong></p>
                  </>
                )}

                <button
                  className={styles.playAgainButton}
                  onClick={startNewGame}
                  aria-label="Iniciar nuevo juego"
                >
                  Jugar de nuevo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>Criollazo</h3>
          <p>&copy; 2025 Todos los derechos reservados</p>
          <p className={styles.credits}>
            Creado por: <strong>Andrés Argote</strong> y vibecodeado con <strong>Claude</strong>
          </p>
        </div>
      </footer>
    </>


  );
}
