import { GridPosition } from "../types"

type UseBoardNavigationProps = {
    position: GridPosition
    maxCellIndex: number
    maxRowIndex: number
}

export function useBoardNavigation({
    position,
    maxCellIndex,
    maxRowIndex
}: UseBoardNavigationProps) {

    const getNextCellIndex = () => {
        let cellIndex = position.cell
        if (canMoveToNextCell(cellIndex)) {
            cellIndex += 1
            return cellIndex
        }

        return cellIndex
    }

    const getPreviousCellIndex = () => {
        let cellIndex = position.cell
        if (canMoveToPreviousPosition(cellIndex)) {
            cellIndex -= 1
            return cellIndex
        }

        return cellIndex
    }

    const getNextRowIndex = () => {
        let rowIndex = position.row
        if (canMoveToNextRow(rowIndex)) {
            rowIndex += 1
            return rowIndex
        }

        return rowIndex
    }

    const canMoveToNextCell = (position: number) => {
        return position <= maxCellIndex
    }

    const canMoveToNextRow = (position: number) => {
        return position <= maxRowIndex
    }

    const canMoveToPreviousPosition = (position: number) => {
        return position > 0
    }


    return {
        getNextCellIndex,
        getPreviousCellIndex,
        getNextRowIndex,
        canMoveToNextCell,
        canMoveToNextRow,
        canMoveToPreviousPosition
    }

}