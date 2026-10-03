import GiftCard from '../GiftCard/GiftCard';

import styles from './ChooseGiftStep.module.scss';

function ChooseGiftStep({
    gifts,
    selectedGift,
    isConfirming,
    onSelect,
}) {
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
                {/* <span
                    className={
                        styles.eyebrow
                    }
                >
                    Chương 4 ✧
                </span> */}

                <h1>
                    Đến phần quan trọng
                    nhất rồi{' '}
                    <span>🎁</span>
                </h1>

                <p className={styles.intro}>
                    Tôi có chuẩn bị vài thứ
                    cho bạn.

                    <br />

                    <span
                        className={
                            styles.secondary
                        }
                    >
                        Nhưng mà...
                        <br />
                        không được chọn dễ
                        thế đâu =)))
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
                    (gift) => {
                        const selected =
                            selectedGift
                                ?.id ===
                            gift.id;

                        return (
                            <GiftCard
                                key={
                                    gift.id
                                }
                                gift={
                                    gift
                                }
                                selected={
                                    selected
                                }
                                dimmed={
                                    isConfirming &&
                                    !selected
                                }
                                onSelect={
                                    onSelect
                                }
                            />
                        );
                    },
                )}
            </div>

            <p className={styles.note}>
                Hmm... chọn theo trực giác
                thui nha ✧
            </p>
        </section>
    );
}

export default ChooseGiftStep;