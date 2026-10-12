import {
    useEffect,
    useRef,
    useState,
} from 'react';

import music from '@/assets/music/birthday.mp3';

import styles from './MusicPlayer.module.scss';

function MusicPlayer() {
    const audioRef =
        useRef(null);

    const hasAutoStartedRef =
        useRef(false);

    const [
        isPlaying,
        setIsPlaying,
    ] = useState(false);

    const [
        currentTime,
        setCurrentTime,
    ] = useState(0);

    const [
        duration,
        setDuration,
    ] = useState(0);

    /*
     * =====================================================
     * GLOBAL FIRST CLICK → START MUSIC
     * =====================================================
     *
     * User click/tap lần đầu ở bất kỳ đâu
     * trên website thì nhạc bắt đầu.
     *
     * Riêng nếu click vào MusicPlayer,
     * để button tự xử lý nhằm tránh:
     *
     * pointerdown → play
     * onClick      → pause
     */

    useEffect(() => {
        const handleFirstInteraction =
            async (event) => {
                /*
                 * Nếu click bên trong
                 * music player thì bỏ qua.
                 *
                 * Nút Play/Pause sẽ tự xử lý.
                 */

                if (
                    event.target.closest?.(
                        '[data-music-player="true"]',
                    )
                ) {
                    return;
                }

                if (
                    hasAutoStartedRef.current
                ) {
                    return;
                }

                const audio =
                    audioRef.current;

                if (!audio) {
                    return;
                }

                try {
                    audio.volume = 0.35;

                    await audio.play();

                    /*
                     * Chỉ đánh dấu sau khi
                     * browser cho play thành công.
                     */

                    hasAutoStartedRef.current =
                        true;

                    window.removeEventListener(
                        'pointerdown',
                        handleFirstInteraction,
                    );
                } catch (error) {
                    /*
                     * Nếu browser vẫn block,
                     * listener còn tồn tại và
                     * sẽ thử lại ở interaction sau.
                     */

                    console.warn(
                        'Music autoplay was blocked:',
                        error,
                    );
                }
            };

        window.addEventListener(
            'pointerdown',
            handleFirstInteraction,
        );

        return () => {
            window.removeEventListener(
                'pointerdown',
                handleFirstInteraction,
            );
        };
    }, []);

    /*
     * =====================================================
     * PLAY / PAUSE
     * =====================================================
     */

    const handleTogglePlay =
        async () => {
            const audio =
                audioRef.current;

            if (!audio) {
                return;
            }

            /*
             * PAUSE
             */

            if (!audio.paused) {
                audio.pause();

                return;
            }

            /*
             * PLAY
             */

            try {
                audio.volume = 0.35;

                await audio.play();

                /*
                 * Nếu user chủ động bấm Play
                 * trước khi click chỗ khác,
                 * coi như music đã được unlock.
                 */

                hasAutoStartedRef.current =
                    true;
            } catch (error) {
                console.warn(
                    'Cannot play music:',
                    error,
                );
            }
        };

    /*
     * =====================================================
     * SEEK
     * =====================================================
     */

    const handleSeek = (
        event,
    ) => {
        const audio =
            audioRef.current;

        if (
            !audio ||
            !duration
        ) {
            return;
        }

        const value =
            Number(
                event.target.value,
            );

        audio.currentTime =
            value;

        setCurrentTime(
            value,
        );
    };

    const progress =
        duration > 0
            ? (
                  currentTime /
                  duration
              ) *
              100
            : 0;

    return (
        <>
            <audio
                ref={audioRef}
                src={music}
                loop
                preload="auto"

                onLoadedMetadata={(
                    event,
                ) => {
                    setDuration(
                        event
                            .currentTarget
                            .duration,
                    );
                }}

                onDurationChange={(
                    event,
                ) => {
                    setDuration(
                        event
                            .currentTarget
                            .duration,
                    );
                }}

                onTimeUpdate={(
                    event,
                ) => {
                    setCurrentTime(
                        event
                            .currentTarget
                            .currentTime,
                    );
                }}

                onPlay={() => {
                    setIsPlaying(
                        true,
                    );
                }}

                onPause={() => {
                    setIsPlaying(
                        false,
                    );
                }}
            />

            <div
                className={
                    styles.player
                }
                data-music-player="true"
            >
                {/*
                 * PLAY / PAUSE
                 */}

                <button
                    type="button"
                    className={
                        styles.playButton
                    }
                    onClick={
                        handleTogglePlay
                    }
                    aria-label={
                        isPlaying
                            ? 'Tạm dừng nhạc'
                            : 'Phát nhạc'
                    }
                >
                    <span
                        className={
                            isPlaying
                                ? styles.pauseIcon
                                : styles.playIcon
                        }
                    >
                        {isPlaying
                            ? 'Ⅱ'
                            : '▶'}
                    </span>
                </button>

                {/*
                 * PROGRESS
                 *
                 * Mobile vẫn được CSS
                 * ẩn như bản trước.
                 */}

                <div
                    className={
                        styles.progressWrapper
                    }
                >
                    <input
                        type="range"
                        min="0"
                        max={
                            duration ||
                            0
                        }
                        step="0.1"
                        value={
                            currentTime
                        }
                        onChange={
                            handleSeek
                        }
                        className={
                            styles.progress
                        }
                        style={{
                            '--progress':
                                `${progress}%`,
                        }}
                        aria-label="Tiến trình bài hát"
                    />
                </div>

                {/*
                 * MUSIC WAVE
                 */}

                <div
                    className={[
                        styles.wave,

                        isPlaying
                            ? styles.wavePlaying
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    aria-hidden="true"
                >
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </>
    );
}

export default MusicPlayer;