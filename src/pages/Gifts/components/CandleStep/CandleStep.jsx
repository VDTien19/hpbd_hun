import {
    useEffect,
    useRef,
    useState,
} from 'react';

import styles from './CandleStep.module.scss';

function CandleStep({
    onComplete,
}) {
    /*
     * idle
     * wish
     * flicker
     * out
     */
    const [
        phase,
        setPhase,
    ] = useState('idle');

    const [
        blowing,
        setBlowing,
    ] = useState(false);

    const [
        black,
        setBlack,
    ] = useState(false);

    const timersRef =
        useRef([]);

    const completedRef =
        useRef(false);

    useEffect(() => {
        return () => {
            timersRef.current
                .forEach(
                    clearTimeout,
                );
        };
    }, []);

    const handleBlow = () => {
        if (blowing) {
            return;
        }

        setBlowing(true);

        setPhase('wish');

        const flicker =
            setTimeout(() => {
                setPhase(
                    'flicker',
                );
            }, 300);

        const out =
            setTimeout(() => {
                setPhase(
                    'out',
                );
            }, 850);

        const fade =
            setTimeout(() => {
                setBlack(true);
            }, 1400);

        const finish =
            setTimeout(() => {
                if (
                    completedRef.current
                ) {
                    return;
                }

                completedRef.current =
                    true;

                onComplete();
            }, 2100);

        timersRef.current = [
            flicker,
            out,
            fade,
            finish,
        ];
    };

    const flamesOut =
        phase === 'out';

    const flickering =
        phase === 'flicker';

    return (
        <>
            <section
                className={
                    styles.wrapper
                }
            >
                <span
                    className={
                        styles.eyebrow
                    }
                >
                    Xong phần quà ✧
                </span>

                <h1>
                    Vậy là xong phần quà
                    rồi ♡
                </h1>

                <div
                    className={
                        styles.message
                    }
                >
                    {!flamesOut ? (
                        <p>
                            Bây giờ...
                            <br />

                            <strong>
                                Sinh nhật mà chưa
                                thổi nến
                                <br />
                                thì chưa tính đâu
                                nhé!
                            </strong>
                        </p>
                    ) : (
                        <p
                            className={
                                styles.secret
                            }
                        >
                            Điều ước thì giữ
                            bí mật nhé ♡
                        </p>
                    )}
                </div>

                <div
                    className={
                        styles.scene
                    }
                    aria-hidden="true"
                >
                    <div
                        className={
                            styles.cake
                        }
                    >
                        <div
                            className={
                                styles.candles
                            }
                        >
                            {Array.from({
                                length: 5,
                            }).map(
                                (
                                    _,
                                    index,
                                ) => (
                                    <span
                                        key={
                                            index
                                        }
                                        className={
                                            styles.candle
                                        }
                                    >
                                        <i
                                            className={[
                                                styles.flame,

                                                flickering
                                                    ? styles.flicker
                                                    : '',

                                                flamesOut
                                                    ? styles.out
                                                    : '',
                                            ]
                                                .filter(
                                                    Boolean,
                                                )
                                                .join(
                                                    ' ',
                                                )}
                                        />

                                        {flamesOut && (
                                            <i
                                                className={
                                                    styles.smoke
                                                }
                                            />
                                        )}
                                    </span>
                                ),
                            )}
                        </div>

                        <div
                            className={
                                styles.cakeTop
                            }
                        />

                        <div
                            className={
                                styles.cakeBody
                            }
                        >
                            <span />
                            <span />
                            <span />
                        </div>

                        <div
                            className={
                                styles.plate
                            }
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className={
                        styles.button
                    }
                    onClick={
                        handleBlow
                    }
                    disabled={
                        blowing
                    }
                >
                    {blowing
                        ? '✨ Ước đi...'
                        : 'Thổi nến nào ♡'}
                </button>
            </section>

            <div
                className={[
                    styles.blackOverlay,

                    black
                        ? styles.black
                        : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
                aria-hidden="true"
            />
        </>
    );
}

export default CandleStep;