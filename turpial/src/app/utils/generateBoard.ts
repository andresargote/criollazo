import { Cell, LetterState } from "../types";

export function generateBoard(cellsPerRow: number, totalRows: number): Array<Cell[]> {
    return Array(totalRows).fill(null).map(() =>
        Array(cellsPerRow).fill(null).map(() => ({
            value: "",
            state: LetterState.EMPTY
        }))
    )
}