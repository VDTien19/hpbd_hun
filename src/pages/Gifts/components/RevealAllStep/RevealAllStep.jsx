import {
    useEffect,
    useState,
} from 'react';

import GiftVisual from '../GiftVisual/GiftVisual';

import styles from './RevealAllStep.module.scss';

function RevealAllStep({
    gifts,
    selectedGift,
    onContinue,
}) {
    const [
        stage,
        setStage,
    ] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(
                () =>
                    setStage(1),
                500,
            ),

            setTimeout(
                () =>
                    setStage(2),
                1000,
            ),

            setTimeout(
                () =>
                    setStage(3),
                1600,
            ),

            setTimeout(
                () =>
                    setStage(4),
                2150,
            ),

            setTimeout(
                () =>
                    setStage(5),
                2700,
            ),

            setTimeout(
                () =>
                    setStage(6),
                3350,
            ),
        ];

        return () => {
            timers.forEach(
                clearTimeout,
            );
        };
    }, []);

    /*
     * Trước stage 3:
     * chỉ render gift user chọn.
     *
     * Như vậy selected gift thực sự
     * xuất hiện một mình ở giữa.
     */
    const visibleGifts =
        stage < 3
            ? [selectedGift]
            : gifts;

    return (
        <section
            className={
                styles.wrapper
            }
        >
            <header
                className={
                    styles.heading
                }
            >
                <span
                    className={
                        styles.eyebrow
                    }
                >
                    Chờ chút ✧
                </span>

                <h1>
                    À mà khoan...
                </h1>

                <p
                    className={[
                        styles.forgot,

                        stage >= 1
                            ? styles.visible
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    Tôi quên mất một
                    chuyện =)))
                </p>
            </header>

            <div
                className={[
                    styles.gifts,

                    stage < 3
                        ? styles.single
                        : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {visibleGifts.map(
                    (gift) => {
                        const selected =
                            gift.id ===
                            selectedGift.id;

                        return (
                            <div
                                key={
                                    gift.id
                                }
                                className={[
                                    styles.gift,
                                    styles[
                                        gift
                                            .theme
                                    ],

                                    stage >= 2
                                        ? styles.giftVisible
                                        : '',

                                    selected &&
                                    stage === 2
                                        ? styles.giftSelected
                                        : '',
                                ]
                                    .filter(
                                        Boolean,
                                    )
                                    .join(
                                        ' ',
                                    )}
                            >
                                <span
                                    className={
                                        styles.number
                                    }
                                >
                                    {
                                        gift.number
                                    }
                                </span>

                                <GiftVisual
                                    gift={gift}
                                    variant="reveal"
                                />

                                <div
                                    className={
                                        styles.text
                                    }
                                >
                                    {stage < 6 ? (
                                        <span>
                                            {
                                                gift.hint
                                            }
                                        </span>
                                    ) : (
                                        <>
                                            <small>
                                                Gift{' '}
                                                {
                                                    gift.number
                                                }
                                            </small>

                                            <strong>
                                                {
                                                    gift.reveal
                                                }
                                            </strong>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    },
                )}
            </div>

            <div
                className={
                    styles.payoff
                }
            >
                <p
                    className={[
                        styles.lineOne,

                        stage >= 4
                            ? styles.visible
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    Ai bảo bạn chỉ được
                    nhận một món? =)))
                </p>

                <h2
                    className={[
                        styles.lineTwo,

                        stage >= 5
                            ? styles.visible
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    Cả 3 đều là của bạn ♡
                </h2>

                <button
                    type="button"
                    className={[
                        styles.button,

                        stage >= 6
                            ? styles.visible
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onClick={
                        onContinue
                    }
                >
                    Nhận hết vậy =))) ♡
                </button>
            </div>
        </section>
    );
}

export default RevealAllStep;