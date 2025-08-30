import styles from "./styles.module.css"

export function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>
                <span className={`${styles.tile} close`}>C</span>
                <span className={`${styles.tile} close`}>R</span>
                <span className={`${styles.tile} close`}>I</span>
                <span className={`${styles.tile} hit`}>O</span>
                <span className={`${styles.tile} hit`}>L</span>
                <span className={`${styles.tile} hit`}>L</span>
                <span className={`${styles.tile} miss`}>A</span>
                <span className={`${styles.tile} miss`}>Z</span>
                <span className={`${styles.tile} miss`}>O</span>
            </h1>
        </header>
    )
}