import { GameState, Key } from "@/app/types"
import styles from "./styles.module.css"

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
        { key: "Ñ", value: "Ñ" },
        { key: 'BACKSPACE', value: '⌫' }
    ],
    [

        { key: 'Z', value: 'Z' },
        { key: 'X', value: 'X' },
        { key: 'C', value: 'C' },
        { key: 'V', value: 'V' },
        { key: 'B', value: 'B' },
        { key: 'N', value: 'N' },
        { key: 'M', value: 'M' },
        { key: 'ENTER', value: 'ENTER' },
    ]
]

type KeyboardProps = {
    gameStatus: GameState
    onKeyPressed: (key: string) => void
}

export function Keyboard({ gameStatus, onKeyPressed }: KeyboardProps) {

    return (
        <section className={styles.keyboard} role="group" aria-label="Teclado virtual">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => {
                return (
                    <div className={styles.keyboardRow} key={`keyboard_${rowIndex}`}>
                        {row.map((key) => {
                            return (
                                <button
                                    key={key.key}
                                    className={`${styles.key} ${key.key === "ENTER" && styles.keyLarge}`}
                                    onClick={() => onKeyPressed(key.key)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            onKeyPressed(key.key)
                                        }
                                    }}
                                    aria-label={
                                        key.key === 'ENTER' ? 'Confirmar palabra' :
                                            key.key === 'BACKSPACE' ? 'Borrar letra' :
                                                `Escribir letra ${key.value}`
                                    }
                                    disabled={gameStatus !== GameState.PLAYING}
                                >
                                    {key.value}
                                </button>
                            )
                        })}
                    </div>
                )
            })}
        </section>
    )

}