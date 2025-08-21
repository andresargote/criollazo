import { useEffect, useState } from "react"
import { Cell } from "../types"
import { generateBoard } from "../utils"

type UseBoardProps = {
    cellsPerRow: number,
    totalRows: number
}


export default function useBoard({
    cellsPerRow,
    totalRows
}: UseBoardProps) {

    const [isLoading, setIsLoading] = useState(true)
    const [board, setBoard] = useState<Cell[][]>([])

    useEffect(() => {

        setBoard(generateBoard(cellsPerRow, totalRows))
        setIsLoading(false)


    }, [cellsPerRow, totalRows])

    const updateBoard = (updatedBoard: Cell[][]) => {
        setBoard(updatedBoard)
    }



    return {
        board,
        updateBoard,
        isLoading,
        maxCellIndex: cellsPerRow - 1,
        maxRowIndex: totalRows - 1
    }
}