/*
TODO PARA MVP JUGABLE (1-2 DIAS MAX):

ESTADO ACTUAL:
✓ Algoritmo de evaluacion (HIT/CLOSE/MISS) - FUNCIONA PERFECTO
✓ Grid funcional con navegacion
✓ Teclado virtual
✓ Validacion de entrada
✓ Estado de attempts guardandose

MINIMO PARA VERSION JUGABLE:
2. LOGICA DE FIN DE JUEGO
   - Boton "Jugar de nuevo"

3. ARRAY DE PALABRAS
   - Lista local de ~20 palabras
   - Funcion getRandomWord()
   - Reemplazar SECRET_WORD hardcodeada
*/

"use client"
import styles from "./styles/page.module.css";
import { useEffect, useMemo, useState } from "react";
import { Key, GridPosition, LetterCount, LetterState, Cell, GameState } from "./types";
import useBoard from "./hooks/useBoard";
import { useBoardNavigation } from "./hooks/useBoardNavigation";


const KEYBOARD_LAYOUT: Key[][] = [
  [
    { key: 'Q', value: 'Q' },
    { key: 'W', value: 'W' },
    { key: 'E', value: 'E' },
    { key: 'R', value: 'R' },
    { key: 'T', value: 'T' },
    { key: 'Y', value: 'Y' },
    { key: 'U', value: 'U' },
    { key: 'I', value: 'I' },
    { key: 'O', value: 'O' },
    { key: 'P', value: 'P' }
  ],
  [
    { key: 'A', value: 'A' },
    { key: 'S', value: 'S' },
    { key: 'D', value: 'D' },
    { key: 'F', value: 'F' },
    { key: 'G', value: 'G' },
    { key: 'H', value: 'H' },
    { key: 'J', value: 'J' },
    { key: 'K', value: 'K' },
    { key: 'L', value: 'L' },
    { key: "Ñ", value: "Ñ" }
  ],
  [
    { key: 'Enter', value: 'ENTER' },
    { key: 'Z', value: 'Z' },
    { key: 'X', value: 'X' },
    { key: 'C', value: 'C' },
    { key: 'V', value: 'V' },
    { key: 'B', value: 'B' },
    { key: 'N', value: 'N' },
    { key: 'M', value: 'M' },
    { key: 'Backspace', value: '←' }
  ]
]

const SECRET_WORD = "TUCUSO"

export default function Home() {

  const { isLoading, board, updateBoard, maxCellIndex, maxRowIndex } = useBoard({
    cellsPerRow: SECRET_WORD.length,
    totalRows: SECRET_WORD.length > 6 ? 6 : SECRET_WORD.length + 1
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

  const letterCount = useMemo(() => {
    const count: LetterCount = {}

    for (const letter of SECRET_WORD) {
      count[letter] = (count[letter] || 0) + 1
    }

    return count


  }, [SECRET_WORD])

  useEffect(() => {
    if (gameStatus === GameState.WON) {
      setTimeout(() => {
        alert("Ganaste!")
      }, 500)
    }

    if (gameStatus === GameState.LOST) {
      setTimeout(() => {
        alert("Perdiste!")
      }, 500)
    }

  }, [gameStatus])

  const moveCursorToCell = (row: number, cell: number) => {
    if (row !== cursorPosition.row || gameStatus !== GameState.PLAYING) return

    setCursorPosition({
      row: cursorPosition.row,
      cell
    })
  }

  const isValidLetter = (character: string) => {
    return /^[A-ZÑ]$/u.test(character)
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

  const processKeyInput = (key: string) => {
    if (gameStatus !== GameState.PLAYING) return
    const canFillCell = isValidLetter(key) && canMoveToNextCell(cursorPosition.cell)
    const canEnterRow = key === "Enter" && canMoveToNextRow(cursorPosition.row) && isValidWord()
    const canBackspace = key === "Backspace"

    if (canFillCell) {
      const updatedBoard = [...board]
      updatedBoard[cursorPosition.row][cursorPosition.cell] = {
        value: key,
        state: LetterState.FILLED
      }

      updateBoard(updatedBoard)
      setCursorPosition(advanceToNextCell())
      return
    }

    if (canEnterRow) {
      const currentRow = board[cursorPosition.row]
      const hasEmptyCell = currentRow.find((cell) => cell.state === LetterState.EMPTY)

      if (hasEmptyCell) return

      const availableLetters = { ...letterCount }

      const attemptEvaluation: Cell[] = []
      currentRow.forEach(({ value }, index) => {
        const secretLetter = SECRET_WORD[index]
        if (value === secretLetter) {
          availableLetters[secretLetter] -= 1
          attemptEvaluation.push({
            value,
            state: LetterState.HIT
          })
        } else if (availableLetters[value] && availableLetters[value] > 0) {
          availableLetters[value] -= 1
          attemptEvaluation.push({
            value,
            state: LetterState.CLOSE
          })
        } else {
          attemptEvaluation.push({
            value,
            state: LetterState.MISS
          })
        }
      })


      const hasWon = attemptEvaluation.every(cell => cell.state === LetterState.HIT)
      const updatedBoard = [...board]
      updatedBoard[cursorPosition.row] = attemptEvaluation
      updateBoard(updatedBoard)


      if (hasWon) {
        setGameStatus(GameState.WON)
      } else {
        if (cursorPosition.row === maxRowIndex) {
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

  const isValidWord = (): boolean => {
    const word = board[cursorPosition.row].map((cell) => cell.value).join('').toLowerCase();

    const invalidPatterns = [
      /[bcdfghjklmnpqrstvwxyzñ]{4,}/i,

      /(.)\1{2,}/i,


      /^[aeiou]+$/i,


      /^[bcdfghjklmnpqrstvwxyzñ]+$/i,


      /[aeiou]{4,}/i,


      /q(?!u)/i,

      /[wxz]/i
    ];

    return !invalidPatterns.some(pattern => pattern.test(word));
  };


  return (

    <main className={styles.game}>
      {isLoading ? <p>Cargando tablero...</p> : (

        <>
          <section className={styles.board}>
            {
              board.map((row, rowIndex) => {
                return (
                  <div key={`row_${rowIndex}`} className={styles.row}>
                    {
                      row.map((cell, cellIndex) => {
                        return (
                          <div key={`row_${rowIndex}_col${cellIndex}`} className={`${styles.cell} ${cellIndex === cursorPosition.cell && rowIndex === cursorPosition.row && styles.cellCurrent} ${cell.state !== LetterState.EMPTY && cell.state !== LetterState.FILLED ? cellStyle(cell.state) : ''}`}

                            onClick={() => moveCursorToCell(rowIndex, cellIndex)}
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
          <section className={styles.keyboard}>
            {KEYBOARD_LAYOUT.map((row, rowIndex) => {
              return (
                <div className={styles.keyboardRow} key={`keyboard_${rowIndex}`}>
                  {row.map((key) => {
                    return (
                      <button key={key.key} className={styles.key} onClick={() => processKeyInput(key.key)}>
                        {key.value}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </section>
        </>
      )}
    </main>

  );
}
