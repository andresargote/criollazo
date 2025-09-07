"use client"
import styles from "./styles/page.module.css";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { LetterState, GameState, WordWithHint } from "./types";
import useAttempts from "./hooks/useAttempts";
import {
  playSound,
  initializeAudio,
  getRandomWordWithHint,
  isValidLetter,
  isValidWord,
  evaluateAttempt,
  hasWon,
  calculateLetterCount
} from "./utils";
import { Keyboard } from "./components/Keyboard";
import { Header } from "./components/Header";

export default function Home() {
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [currentWordData, setCurrentWordData] = useState<WordWithHint | null>(null)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const secretWord = currentWordData?.word || ""
  const hint = currentWordData?.hint || ""
  const wordLength = currentWordData?.wordLength || 0

  const [attempts, setAttempts] = useState<{
    value: string
    state: LetterState
  }[][]>([])
  const [currentInput, setCurrentInput] = useState<Array<string>>([]);
  const currentInputRef = useRef<Array<string>>([]);
  const gameStatusRef = useRef<string>(GameState.PLAYING);

  const { maxAttempts } = useAttempts({
    wordLength: wordLength
  })

  const [gameStatus, setGameStatus] = useState<string>(GameState.PLAYING)

  const letterCount = useMemo(() => calculateLetterCount(secretWord), [secretWord])

  useEffect(() => {
    setCurrentWordData(getRandomWordWithHint())
  }, [])

  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === GameState.WON) {
      setTimeout(() => {
        playSound('win')
        setShowGameOver(true)
      }, 500)
    }

    if (gameStatus === GameState.LOST) {
      setTimeout(() => {
        playSound('lose')
        setShowGameOver(true)
      }, 500)
    }

  }, [gameStatus])


  const handleInitializeAudio = () => {
    if (!audioInitialized) {
      const initialized = initializeAudio();
      if (initialized) {
        setAudioInitialized(true);
      }
    }
  };

  const startNewGame = () => {
    const newWordData = getRandomWordWithHint();
    setCurrentWordData(newWordData);
    setGameStatus(GameState.PLAYING);
    setAttempts([]);
    setCurrentInput([]);
    setShowGameOver(false);
  };


  const processKeyInput = useCallback((key: string) => {
    if (gameStatusRef.current !== GameState.PLAYING) return;
    handleInitializeAudio();
    const currentWordLetters = currentInputRef.current;
    const attemptCount = attempts.length + 1;

    if (isValidLetter(key)) {
      handleLetterInput(key, currentWordLetters);
      return;
    }

    if (key === "BACKSPACE") {
      handleBackspace(currentWordLetters);
      return;
    }

    if (key === "ENTER") {
      handleEnterKey(currentWordLetters, attemptCount);
      return;
    }
  }, [secretWord, wordLength, letterCount, maxAttempts, attempts.length]);

  const handleLetterInput = (key: string, currentLetters: string[]) => {
    if (currentLetters.length >= wordLength) return;
    playSound('key');
    const updatedLetters = [...currentLetters, key];
    setCurrentInput(updatedLetters);
    setShowCursor(updatedLetters.length < wordLength);
  };

  const handleBackspace = (currentLetters: string[]) => {
    if (currentLetters.length === 0) return;
    playSound('key');
    const updatedLetters = [...currentLetters];
    updatedLetters.pop();
    setCurrentInput(updatedLetters);
    setShowCursor(true);
  };

  const handleEnterKey = (currentLetters: string[], attemptCount: number) => {
    const isComplete = currentLetters.length === wordLength;
    const isValid = isValidWord(currentLetters.join(""));
    if (!isComplete || !isValid) return;
    playSound('enter');
    const attempt = evaluateAttempt({
      letterCount,
      secretWord,
      attempt: currentLetters
    });
    setCurrentInput([]);
    setAttempts(prev => [...prev, attempt]);
    const won = hasWon(attempt);
    if (won) {
      setGameStatus(GameState.WON);
      setShowCursor(false);
    } else if (attemptCount === maxAttempts && !won) {
      setGameStatus(GameState.LOST);
      setShowCursor(false);
    } else {
      setShowCursor(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()

      if (event.key === 'Escape') {
        if (showHowToPlay) {
          setShowHowToPlay(false)
          return
        }
        if (showGameOver) {
          setShowGameOver(false)
          return
        }
      }

      if (event.target && (event.target as HTMLElement).tagName === 'BUTTON') {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey || (event.shiftKey && key !== event.key.toUpperCase())) {
        return
      }

      if (key === "ENTER" || key === "BACKSPACE" || isValidLetter(key)) {
        event.preventDefault()
        processKeyInput(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [processKeyInput, showHowToPlay, showGameOver])

  const letterStyle = (state: LetterState) => {
    if (state === LetterState.HIT) return "hit"

    if (state === LetterState.CLOSE) return "close"

    if (state === LetterState.MISS) return "miss"

    return ""
  }

  if (!currentWordData) {
    return (
      <div className={styles.game}>
        <Header />
        <div className={styles.gameContainer}>
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Cargando palabra venezolana...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.game}>
      <Header />

      <div className={styles.gameContainer}>
        <div className={styles.hintSection}>
          <h2 className={styles.hintTitle}>Pista:</h2>
          <p className={styles.hintText}>{hint}</p>
          <p className={styles.letterCount}>Palabra de {wordLength} letras</p>
        </div>

        <div className={styles.board}>
          <div className={styles.attemptContainer}>
            {attempts.map((attempt, i) => (
              <p key={`attemp_${i}`} className={styles.word}>
                {attempt.map((letter, i) => (
                  <span
                    key={`${letter.value}_${letter.state}_${i}`}
                    className={`${styles.tile} ${letterStyle(letter.state)}`}
                  >{letter.value}</span>
                ))}
              </p>
            ))}
          </div>
          {gameStatus === GameState.PLAYING && (
          <div className={styles.input}>
            <p className={styles.word}>
              {currentInput.map((letter, i) => (
                <span key={`${letter}_${i}`} className={styles.tile}>{letter}</span>
              ))}
            </p>
            {showCursor && (
              <div className={styles.cursors}>
                <div className={`${styles.cursor} ${styles.active}`} />
              </div>
            )}
          </div>
          )}
        </div>
      </div>
      <Keyboard onKeyPressed={processKeyInput} gameStatus={gameStatus as GameState} />
    </div>


  );
}
