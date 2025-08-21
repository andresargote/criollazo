import { Cell, CellState } from "../types";

export function generateBoard(cellsPerRow: number, totalRows: number): Array<Cell[]> {
    return Array(totalRows).fill(null).map(() =>
        Array(cellsPerRow).fill(null).map(() => ({
            value: "",
            state: CellState.EMPTY
        }))
    )
}