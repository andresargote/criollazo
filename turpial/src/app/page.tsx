"use client"
import styles from "./styles/page.module.css";
import { useRef, useState } from "react";
import { CellState, Key, GridPosition } from "./types";
import useBoard from "./hooks/useBoard";

/**
 * Hook useBoardNavigation:
 * 
 * 1. Recibe el cursorPosition actual y los límites del board.
 * 2. Expone funciones puras que calculan los siguientes movimientos:
 *    - Calcular la siguiente celda
 *    - Calcular la siguiente fila
 *    - Calcular la celda anterior
 * 3. Incluye funciones de validación para verificar si es posible 
 *    moverse a la siguiente celda o fila.
 * 
 * Las funciones de cálculo manejan automáticamente los límites del tablero,
 * retornando posiciones válidas dentro de los rangos permitidos.
 */


export default function Home() {

  const { isLoading, board, updateBoard, maxCellIndex, maxRowIndex } = useBoard({
    cellsPerRow: 2,
    totalRows: 2
  })

  const [cursorPosition, setCursorPosition] = useState<GridPosition>({
    row: 0,
    cell: 0
  })

  const keyboardLayout = useRef<Key[][]>([
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
  ])

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

  const canMoveToNextCell = (currentCell: number, maxIndex: number) => {
    return currentCell <= maxIndex
  }

  const canMoveToNextRow = (currentRow: number, maxIndex: number) => {
    return currentRow < maxIndex
  }

  const advanceToNextCell = (): GridPosition => {
    return {
      ...cursorPosition,
      cell: cursorPosition.cell + 1
    }
  }

  const advanceToNextRow = (): GridPosition => {
    return {
      cell: 0,
      row: cursorPosition.row + 1
    }
  }

  const moveToPreviousCell = (): GridPosition => {
    return {
      ...cursorPosition,
      cell: cursorPosition.cell > 0 ? cursorPosition.cell - 1 : 0
    }
  }


  const processKeyInput = (key: string) => {
    const canFillCell = isValidLetter(key) && canMoveToNextCell(cursorPosition.cell, maxCellIndex)
    const canEnterRow = key === "Enter" && canMoveToNextRow(cursorPosition.row, maxRowIndex)
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



      setCursorPosition(advanceToNextRow())
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
      <main>
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
              {keyboardLayout.current.map((row, rowIndex) => {
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
