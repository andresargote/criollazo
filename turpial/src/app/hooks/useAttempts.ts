type UseAttemptsProps = {
    wordLength: number,
}

export default function useAttempts({
    wordLength
}: UseAttemptsProps) {
    // Para palabras de 6+ letras, máximo 6 intentos
    // Para palabras más cortas, palabra.length + 1 intentos
    const maxAttempts = wordLength >= 6 ? 6 : wordLength + 1;

    return {
        maxAttempts
    }
}