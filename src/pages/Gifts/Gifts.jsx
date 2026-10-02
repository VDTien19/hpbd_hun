import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './Gifts.module.scss';

const gifts = [
    {
        id: 1,
        number: '01',
        theme: 'pink',
        hint: 'Một thứ bạn có thể giữ thật lâu ♡',
    },
    {
        id: 2,
        number: '02',
        theme: 'lavender',
        hint: 'Một thứ tôi nghĩ bạn sẽ thích ✨',
    },
    {
        id: 3,
        number: '03',
        theme: 'blue',
        hint: 'Một thứ bạn chắc chắn không đoán ra =)))',
    },
];

function Gifts() {
    const navigate = useNavigate();

    /*
     * choose
     * confirm
     * selected
     * troll
     * final
     */
    const [step, setStep] =
        useState('choose');

    /*
     * Gift vừa click nhưng
     * chưa confirm.
     */
    const [
        candidateGift,
        setCandidateGift,
    ] = useState(null);

    /*
     * Gift đã confirm.
     */
    const [
        selectedGift,
        setSelectedGift,
    ] = useState(null);

    /*
     * Button "Không" chạy tối đa
     * 2 lần.
     *
     * Lần thứ 3 cho click.
     */
    const [
        noButtonAttempts,
        setNoButtonAttempts,
    ] = useState(0);

    /*
     * null | yes | no
     */
    const [
        trollAnswer,
        setTrollAnswer,
    ] = useState(null);

    const trollTimerRef =
        useRef(null);

    const confirmButtonRef =
        useRef(null);

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    useEffect(() => {
        return () => {
            clearTimeout(
                trollTimerRef.current,
            );
        };
    }, []);

    /*
     * =====================================================
     * CONFIRM MODAL KEYBOARD
     * =====================================================
     */

    useEffect(() => {
        if (step !== 'confirm') {
            return;
        }

        const frame =
            requestAnimationFrame(() => {
                confirmButtonRef.current
                    ?.focus();
            });

        const handleKeyDown = (
            event,
        ) => {
            if (event.key === 'Escape') {
                setStep('choose');
                setCandidateGift(null);
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown,
        );

        return () => {
            cancelAnimationFrame(frame);

            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
        };
    }, [step]);

    /*
     * =====================================================
     * GIFT VISUAL
     * =====================================================
     *
     * Helper render thôi,
     * chưa tách component.
     */

    const renderGiftVisual = (
        gift,
        variant = 'normal',
    ) => {
        if (!gift) return null;

        return (
            <div
                className={[
                    styles.giftVisual,
                    styles[gift.theme],
                    variant === 'large'
                        ? styles.giftVisualLarge
                        : '',
                    variant === 'modal'
                        ? styles.giftVisualModal
                        : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
                aria-hidden="true"
            >
                <span
                    className={
                        styles.giftGroundShadow
                    }
                />

                <span
                    className={
                        styles.giftBody
                    }
                />

                <span
                    className={
                        styles.giftLid
                    }
                />

                <span
                    className={
                        styles.ribbonVertical
                    }
                />

                <span
                    className={
                        styles.ribbonHorizontal
                    }
                />

                <span
                    className={
                        styles.bowLeft
                    }
                />

                <span
                    className={
                        styles.bowRight
                    }
                />

                <span
                    className={
                        styles.bowKnot
                    }
                />

                <span
                    className={
                        styles.giftSparkleOne
                    }
                >
                    ✦
                </span>

                <span
                    className={
                        styles.giftSparkleTwo
                    }
                >
                    ✧
                </span>
            </div>
        );
    };

    /*
     * =====================================================
     * CHOOSE GIFT
     * =====================================================
     */

    const handleGiftClick = (
        gift,
    ) => {
        setCandidateGift(gift);
        setStep('confirm');
    };

    const closeConfirm = () => {
        setCandidateGift(null);
        setStep('choose');
    };

    const confirmGift = () => {
        if (!candidateGift) {
            return;
        }

        setSelectedGift(
            candidateGift,
        );

        setCandidateGift(null);

        setStep('selected');
    };

    /*
     * =====================================================
     * SELECTED -> TROLL
     * =====================================================
     */

    const goToTroll = () => {
        setNoButtonAttempts(0);
        setTrollAnswer(null);
        setStep('troll');
    };

    /*
     * =====================================================
     * TROLL
     * =====================================================
     */

    const moveNoButton = () => {
        if (noButtonAttempts >= 2) {
            return;
        }

        setNoButtonAttempts(
            (prev) => prev + 1,
        );
    };

    const handleNoMouseEnter = () => {
        /*
         * Chỉ desktop/laptop thật sự
         * có hover mới chạy bằng hover.
         */
        const canHover =
            window.matchMedia(
                '(hover: hover) and (pointer: fine)',
            ).matches;

        if (!canHover) {
            return;
        }

        moveNoButton();
    };

    const finishTroll = (
        answer,
    ) => {
        if (trollAnswer) {
            return;
        }

        setTrollAnswer(answer);

        trollTimerRef.current =
            setTimeout(() => {
                setStep('final');
            }, 800);
    };

    const handleNoClick = () => {
        /*
         * Mobile:
         *
         * tap 1 -> move
         * tap 2 -> move
         * tap 3 -> cho chọn Không
         */
        if (noButtonAttempts < 2) {
            moveNoButton();
            return;
        }

        finishTroll('no');
    };

    const getNoButtonClass = () => {
        if (noButtonAttempts === 1) {
            return styles.noMoveOne;
        }

        if (noButtonAttempts >= 2) {
            return styles.noMoveTwo;
        }

        return '';
    };

    /*
     * =====================================================
     * FINAL
     * =====================================================
     */

    const goToCandle = () => {
        navigate('/candle');
    };

    /*
     * =====================================================
     * CHOOSE SCREEN
     * =====================================================
     */

    const renderChooseScreen = () => (
        <section
            className={[
                styles.screen,
                styles.choose,
            ].join(' ')}
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
                    Chương 4 ✧
                </span>

                <h1>
                    Đến phần quan trọng
                    nhất rồi{' '}
                    <span>🎁</span>
                </h1>

                <p
                    className={
                        styles.intro
                    }
                >
                    Tôi có chuẩn bị vài thứ
                    cho bạn.
                    <br />
                    <span
                        className={
                            styles.introSecondary
                        }
                    >
                        Nhưng mà...
                        <br />
                        không được chọn dễ thế
                        đâu =)))
                    </span>
                </p>

                <p
                    className={
                        styles.chooseText
                    }
                >
                    Hãy chọn 1 hộp quà
                    <br />
                    dựa vào cảm giác của bạn
                    nhé ♡
                </p>
            </header>

            <div
                className={
                    styles.gifts
                }
            >
                {gifts.map(
                    (
                        gift,
                        index,
                    ) => {
                        const isPending =
                            candidateGift
                                ?.id ===
                            gift.id;

                        const isDimmed =
                            candidateGift &&
                            !isPending;

                        return (
                            <button
                                key={
                                    gift.id
                                }
                                type="button"
                                className={[
                                    styles.gift,
                                    styles[
                                        gift
                                            .theme
                                    ],
                                    isPending
                                        ? styles.giftSelected
                                        : '',
                                    isDimmed
                                        ? styles.giftDimmed
                                        : '',
                                ]
                                    .filter(
                                        Boolean,
                                    )
                                    .join(
                                        ' ',
                                    )}
                                style={{
                                    '--gift-index':
                                        index,
                                    '--float-delay':
                                        `${index * -1.1}s`,
                                    '--float-duration':
                                        `${
                                            7.5 +
                                            index *
                                                1.2
                                        }s`,
                                }}
                                onClick={() =>
                                    handleGiftClick(
                                        gift,
                                    )
                                }
                                aria-label={`Chọn hộp quà số ${gift.number}`}
                            >
                                <span
                                    className={
                                        styles.giftNumber
                                    }
                                >
                                    {gift.number}
                                </span>

                                {renderGiftVisual(
                                    gift,
                                )}

                                <span
                                    className={
                                        styles.giftHint
                                    }
                                >
                                    {gift.hint}
                                </span>
                            </button>
                        );
                    },
                )}
            </div>

            <p
                className={
                    styles.smallNote
                }
            >
                Hmm... chọn theo trực giác
                thui nha ✧
            </p>
        </section>
    );

    /*
     * =====================================================
     * SUCCESS SCREEN
     * =====================================================
     */

    const renderSelectedScreen =
        () => (
            <section
                className={[
                    styles.screen,
                    styles.success,
                ].join(' ')}
            >
                <span
                    className={
                        styles.eyebrow
                    }
                >
                    Đã chọn ✧
                </span>

                <h1>
                    Okii.
                    <br />
                    Tôi ghi nhận rồi nhé ♡
                </h1>

                <div
                    className={
                        styles.selectedGiftStage
                    }
                >
                    <div
                        className={
                            styles.selectedGiftVisual
                        }
                    >
                        <span
                            className={
                                styles.successSparkleOne
                            }
                        >
                            ✦
                        </span>

                        <span
                            className={
                                styles.successSparkleTwo
                            }
                        >
                            ✧
                        </span>

                        <span
                            className={
                                styles.successSparkleThree
                            }
                        >
                            ♡
                        </span>

                        {renderGiftVisual(
                            selectedGift,
                            'large',
                        )}
                    </div>

                    <div
                        className={
                            styles.selectedNote
                        }
                    >
                        <span>
                            Bạn đã chọn
                        </span>

                        <strong>
                            Hộp số{' '}
                            {
                                selectedGift
                                    ?.number
                            }{' '}
                            ♡
                        </strong>
                    </div>
                </div>

                <p
                    className={
                        styles.successText
                    }
                >
                    Quà thì chọn xong rồi...
                    <br />
                    Nhưng hình như vẫn còn
                    thiếu một thứ...
                </p>

                <button
                    type="button"
                    className={
                        styles.primaryButton
                    }
                    onClick={goToTroll}
                >
                    Đi tiếp nhé ♡
                </button>
            </section>
        );

    /*
     * =====================================================
     * TROLL SCREEN
     * =====================================================
     */

    const renderTrollScreen = () => (
        <section
            className={[
                styles.screen,
                styles.troll,
            ].join(' ')}
        >
            {!trollAnswer ? (
                <>
                    <span
                        className={
                            styles.eyebrow
                        }
                    >
                        Nhưng trước khi đi
                        tiếp...
                    </span>

                    <p
                        className={
                            styles.trollLead
                        }
                    >
                        Tôi có một câu hỏi rất
                        quan trọng =)))
                    </p>

                    <div
                        className={
                            styles.cat
                        }
                        aria-hidden="true"
                    >
                        <span
                            className={
                                styles.catEarLeft
                            }
                        />

                        <span
                            className={
                                styles.catEarRight
                            }
                        />

                        <span
                            className={
                                styles.catFace
                            }
                        >
                            <i />
                            <i />
                            <b>ᴗ</b>
                        </span>
                    </div>

                    <h1
                        className={
                            styles.trollQuestion
                        }
                    >
                        Bạn có chắc người làm
                        <br />
                        website này đẹp trai
                        không? ♡
                    </h1>

                    <div
                        className={
                            styles.trollActions
                        }
                    >
                        <button
                            type="button"
                            className={[
                                styles.primaryButton,
                                styles.yesButton,
                            ].join(' ')}
                            onClick={() =>
                                finishTroll(
                                    'yes',
                                )
                            }
                        >
                            Có ♡
                        </button>

                        <button
                            type="button"
                            className={[
                                styles.secondaryButton,
                                styles.noButton,
                                getNoButtonClass(),
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            onMouseEnter={
                                handleNoMouseEnter
                            }
                            onClick={
                                handleNoClick
                            }
                        >
                            Không =)))
                        </button>
                    </div>

                    {noButtonAttempts >
                        0 && (
                        <p
                            className={
                                styles.trollHint
                            }
                        >
                            {noButtonAttempts ===
                            1
                                ? 'Ơ kìa... chọn lại đi =)))'
                                : 'Lần cuối đó nha 👀'}
                        </p>
                    )}
                </>
            ) : (
                <div
                    className={
                        styles.trollResult
                    }
                    aria-live="polite"
                >
                    <span>✧</span>

                    <h2>
                        {trollAnswer ===
                        'yes'
                            ? 'Biết ngay mà =))) ♡'
                            : 'Đã ghi nhận một câu trả lời không chính xác 😒'}
                    </h2>
                </div>
            )}
        </section>
    );

    /*
     * =====================================================
     * FINAL SCREEN
     * =====================================================
     */

    const renderFinalScreen = () => (
        <section
            className={[
                styles.screen,
                styles.final,
            ].join(' ')}
        >
            <span
                className={
                    styles.eyebrow
                }
            >
                Xong phần quà ✧
            </span>

            <h1>
                Vậy là xong phần quà rồi ♡
            </h1>

            <p
                className={
                    styles.finalText
                }
            >
                Bây giờ...
                <br />
                <strong>
                    Sinh nhật mà chưa thổi
                    nến
                    <br />
                    thì chưa tính đâu nhé!
                </strong>
            </p>

            <div
                className={
                    styles.cakeScene
                }
                aria-hidden="true"
            >
                <span
                    className={
                        styles.cakeSparkleOne
                    }
                >
                    ✦
                </span>

                <span
                    className={
                        styles.cakeSparkleTwo
                    }
                >
                    ♡
                </span>

                <div
                    className={
                        styles.miniGiftLeft
                    }
                />

                <div
                    className={
                        styles.miniGiftRight
                    }
                />

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
                            (_, index) => (
                                <span
                                    key={
                                        index
                                    }
                                    className={
                                        styles.candle
                                    }
                                >
                                    <i
                                        className={
                                            styles.flame
                                        }
                                    />
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
                            styles.cakePlate
                        }
                    />
                </div>
            </div>

            <button
                type="button"
                className={
                    styles.primaryButton
                }
                onClick={goToCandle}
            >
                Đi thổi nến nào 🎂
            </button>
        </section>
    );

    return (
        <main className={styles.page}>
            {/* ambience decoration */}

            <div
                className={
                    styles.decorations
                }
                aria-hidden="true"
            >
                <span
                    className={
                        styles.decorOne
                    }
                >
                    ♡
                </span>

                <span
                    className={
                        styles.decorTwo
                    }
                >
                    ✦
                </span>

                <span
                    className={
                        styles.decorThree
                    }
                >
                    ✧
                </span>

                <span
                    className={
                        styles.decorFour
                    }
                >
                    ୨୧
                </span>

                <span
                    className={
                        styles.decorFive
                    }
                >
                    ♡
                </span>
            </div>

            <div className={styles.content}>
                {(step === 'choose' ||
                    step ===
                        'confirm') &&
                    renderChooseScreen()}

                {step === 'selected' &&
                    renderSelectedScreen()}

                {step === 'troll' &&
                    renderTrollScreen()}

                {step === 'final' &&
                    renderFinalScreen()}
            </div>

            {/* =========================
                CONFIRM MODAL
            ========================== */}

            {step === 'confirm' &&
                candidateGift && (
                    <div
                        className={
                            styles.modalBackdrop
                        }
                        onMouseDown={
                            closeConfirm
                        }
                    >
                        <div
                            className={
                                styles.modal
                            }
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="gift-confirm-title"
                            onMouseDown={(
                                event,
                            ) =>
                                event.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.modalClose
                                }
                                onClick={
                                    closeConfirm
                                }
                                aria-label="Đóng"
                            >
                                ×
                            </button>

                            <span
                                className={
                                    styles.modalEyebrow
                                }
                            >
                                Chốt đơn... à
                                nhầm =)))
                            </span>

                            <h2
                                id="gift-confirm-title"
                            >
                                Chắc chưa? 👀
                            </h2>

                            <p>
                                Bạn đã chọn{' '}
                                <strong>
                                    Hộp số{' '}
                                    {
                                        candidateGift.number
                                    }
                                </strong>
                            </p>

                            <div
                                className={
                                    styles.modalGift
                                }
                            >
                                {renderGiftVisual(
                                    candidateGift,
                                    'modal',
                                )}
                            </div>

                            <div
                                className={
                                    styles.modalActions
                                }
                            >
                                <button
                                    ref={
                                        confirmButtonRef
                                    }
                                    type="button"
                                    className={
                                        styles.primaryButton
                                    }
                                    onClick={
                                        confirmGift
                                    }
                                >
                                    Chắc rồi ♡
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.secondaryButton
                                    }
                                    onClick={
                                        closeConfirm
                                    }
                                >
                                    Để tôi nghĩ lại
                                    =)))
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </main>
    );
}

export default Gifts;