export type SoundType = 'key' | 'enter' | 'backspace' | 'win' | 'lose' | 'error';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API no está disponible:', error);
            return null;
        }
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    return audioContext;
};

export const playSound = (type: SoundType) => {
    const context = getAudioContext();
    if (!context) return;

    try {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        switch (type) {
            case 'key':
                oscillator.frequency.setValueAtTime(800, context.currentTime);
                gainNode.gain.setValueAtTime(0.08, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
                oscillator.type = 'sine';
                break;
            case 'enter':
                oscillator.frequency.setValueAtTime(600, context.currentTime);
                oscillator.frequency.setValueAtTime(900, context.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.12, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
                oscillator.type = 'triangle';
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(523, context.currentTime);
                oscillator.frequency.setValueAtTime(659, context.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(784, context.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.15, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
                oscillator.type = 'sine';
                break;
            case 'lose':
                oscillator.frequency.setValueAtTime(300, context.currentTime);
                oscillator.frequency.setValueAtTime(200, context.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.12, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
                oscillator.type = 'square';
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(200, context.currentTime);
                gainNode.gain.setValueAtTime(0.08, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
                oscillator.type = 'square';
                break;
        }

        oscillator.start();
        oscillator.stop(context.currentTime + (type === 'win' ? 0.5 : type === 'lose' ? 0.4 : type === 'enter' ? 0.15 : 0.1));
    } catch (error) {
        console.warn('Error reproduciendo sonido:', error);
    }
};

export const initializeAudio = (): boolean => {
    const context = getAudioContext();
    return !!context;
};
