"use client"
import styles from "./styles/page.module.css";
import { useEffect, useRef, useState } from "react";

const ROW = 6
const COLUMS = 5

enum CellState {
  EMPTY = 'empty',
  FILLED = 'filled',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  WRONG_POSITION = 'wrong-position'
}

type Cell = {
  value: string;
  state: CellState;
}

type Position = {
  row: number;
  cell: number;
}

type KeyboardKey = {
  key: string;
  value: string
}



export default function Home() {
  // en el futuro se va generar de forma dinamica
  const [board, setBoard] = useState<Array<Cell[]>>([])
  const [currentBoardPosition, setCurrentBoardPosition] = useState<Position>({
    row: 0,
    cell: 0
  })

  const keyboardLayout = useRef<KeyboardKey[][]>([
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

  const generateBoard = (rows: number, columns: number): Array<Cell[]> => {
    return Array(rows).fill(null).map(() =>
      Array(columns).fill(null).map(() => ({
        value: "",
        state: CellState.EMPTY
      }))
    )
  }

  useEffect(() => {
    setBoard(generateBoard(ROW, COLUMS))
  }, [])

  const handleKeyPress = (key: string) => {
    if (currentBoardPosition.row >= ROW) return


    if (/^[A-ZÑ]$/u.test(key) && currentBoardPosition.cell <= (COLUMS - 1)) {

      const newBoard = [...board]
      newBoard[currentBoardPosition.row][currentBoardPosition.cell] = {
        value: key,
        state: CellState.FILLED
      }

      setBoard(newBoard)



      setCurrentBoardPosition({
        ...currentBoardPosition,
        cell: currentBoardPosition.cell !== (COLUMS - 1) ? currentBoardPosition.cell + 1 : COLUMS - 1
      })
    } else if (key === "Enter") {
      const getRow = board[currentBoardPosition.row]
      // esto funciona bien solo si no puede seleccionar la celda manualmente en un siguiente update dejara de funcionar
      const isRowUnfilled = getRow[getRow.length - 1].state === CellState.EMPTY

      if (isRowUnfilled) return

      // validar la palabra y actualizar el board

      setCurrentBoardPosition({
        cell: 0,
        row: currentBoardPosition.row + 1
      })
    } else if (key === "Backspace" && currentBoardPosition.cell >= 0) {
      const newBoard = [...board]

      if (newBoard[currentBoardPosition.row][currentBoardPosition.cell]?.state === CellState.FILLED) {
        console.log("here")
        newBoard[currentBoardPosition.row][currentBoardPosition.cell] = {
          value: "",
          state: CellState.EMPTY
        }
      } else {
        newBoard[currentBoardPosition.row][currentBoardPosition.cell - 1] = {
          value: "",
          state: CellState.EMPTY
        }
      }


      setBoard(newBoard)
      setCurrentBoardPosition({
        ...currentBoardPosition,
        cell: currentBoardPosition.cell === 0 ? 0 : currentBoardPosition.cell - 1
      })
    }
  }

  const handleCellPress = (row: number, cell: number) => {
    if (row !== currentBoardPosition.row) return

    setCurrentBoardPosition({
      row: currentBoardPosition.row,
      cell
    })
  }



  return (
    <>
      <header>
        <h1>Criollazo</h1>
      </header>
      <main>
        <section className={styles.board}>
          {
            board.map((row, rowIndex) => {
              return (
                <div key={`row_${rowIndex}`} className={styles.row}>
                  {
                    row.map((cell, cellIndex) => {
                      return (
                        <div key={`row_${rowIndex}_col${cellIndex}`} className={`${styles.cell} ${cellIndex === currentBoardPosition.cell && rowIndex === currentBoardPosition.row && styles.cellCurrent}`}

                          onClick={() => handleCellPress(rowIndex, cellIndex)}
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
                    <button key={key.key} className={styles.key} onClick={() => handleKeyPress(key.key)}>
                      {key.value}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </section>
      </main>
    </>
  );
}
