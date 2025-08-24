/*
TODO PARA MVP JUGABLE (1-2 DIAS MAX):

ESTADO ACTUAL:
✓ Algoritmo de evaluacion (HIT/CLOSE/MISS) - FUNCIONA PERFECTO
✓ Grid funcional con navegacion
✓ Teclado virtual
✓ Validacion de entrada
✓ Estado de attempts guardandose

MINIMO PARA VERSION JUGABLE:
1. APLICAR COLORES CSS a celdas segun LetterState (PRIORITARIO)
   - HIT = verde, CLOSE = amarillo, MISS = gris
   - Mostrar attempts previos con colores
   
2. LOGICA DE FIN DE JUEGO
   - Detectar cuando se acabaron los 6 intentos (PERDISTE)
   - Mostrar palabra secreta al perder
   - Boton "Jugar de nuevo"

3. ARRAY DE PALABRAS
   - Lista local de ~20 palabras
   - Funcion getRandomWord()
   - Reemplazar SECRET_WORD hardcodeada
*/

"use client"
import styles from "./styles/page.module.css";
import { useMemo, useState } from "react";
import { CellState, Key, GridPosition, LetterCount, LetterState } from "./types";
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

const SECRET_WORD = "CRIOLLO"

export default function Home() {

  const { isLoading, board, updateBoard, maxCellIndex, maxRowIndex } = useBoard({
    cellsPerRow: SECRET_WORD.length,
    totalRows: 6
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

  const [attempts, setAttempts] = useState<LetterState[][]>([])

  const letterCount = useMemo(() => {
    const count: LetterCount = {}

    for (const letter of SECRET_WORD) {
      count[letter] = (count[letter] || 0) + 1
    }

    return count


  }, [SECRET_WORD])

  const moveCursorToCell = (row: number, cell: number) => {
    if (row !== cursorPosition.row) return

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
    const canFillCell = isValidLetter(key) && canMoveToNextCell(cursorPosition.cell)
    const canEnterRow = key === "Enter" && canMoveToNextRow(cursorPosition.row)
    const canBackspace = key === "Backspace"

    if (canFillCell) {
      const updatedBoard = [...board]
      updatedBoard[cursorPosition.row][cursorPosition.cell] = {
        value: key,
        state: CellState.FILLED
      }

      updateBoard(updatedBoard)
      setCursorPosition(advanceToNextCell())
      return
    }

    if (canEnterRow) {
      const currentRow = board[cursorPosition.row]
      const hasEmptyCell = currentRow.find((cell) => cell.state === CellState.EMPTY)

      if (hasEmptyCell) return

      const availableLetters = { ...letterCount }



      const attemptEvaluation: LetterState[] = []
      currentRow.forEach(({ value }, index) => {
        const secretLetter = SECRET_WORD[index]
        if (value === secretLetter) {
          availableLetters[secretLetter] -= 1
          attemptEvaluation.push(LetterState.HIT)
        } else if (availableLetters[value] && availableLetters[value] > 0) {
          availableLetters[value] -= 1
          attemptEvaluation.push(LetterState.CLOSE)
        } else {
          attemptEvaluation.push(LetterState.MISS)
        }
      })


      const hasWon = attemptEvaluation.every(state => state === LetterState.HIT)
      setAttempts([...attempts, attemptEvaluation])

      if (!hasWon) {
        setCursorPosition(advanceToNextRow())
        return
      }

      // aqui entienod que hay que crear un estado para saber si el user gano, ademas probablemente hay que trabajar con el localStorage para poder tener un estado "persistente" de los intentos del usuario
      alert("GANASTE")
      return
    }

    if (canBackspace) {
      const updatedBoard = [...board]

      if (updatedBoard[cursorPosition.row][cursorPosition.cell]?.state === CellState.FILLED) {
        updatedBoard[cursorPosition.row][cursorPosition.cell] = {
          value: "",
          state: CellState.EMPTY
        }
      } else {
        updatedBoard[cursorPosition.row][cursorPosition.cell - 1] = {
          value: "",
          state: CellState.EMPTY
        }
      }


      updateBoard(updatedBoard)
      setCursorPosition(moveToPreviousCell())
      return
    }
  }


  return (
    <>
      <header>
        <h1>Criollazo</h1>
      </header>
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
                            <div key={`row_${rowIndex}_col${cellIndex}`} className={`${styles.cell} ${cellIndex === cursorPosition.cell && rowIndex === cursorPosition.row && styles.cellCurrent}`}

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
    </>
  );
}
