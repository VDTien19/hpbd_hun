import GiftVisual from '../GiftVisual/GiftVisual';

import styles from './SelectedGiftStep.module.scss';

function SelectedGiftStep({
    gift,
    onContinue,
}) {
    return (
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
                Đã chọn ✧
            </span>

            <h1>
                Okii.
                <br />
                Tôi ghi nhận rồi nhé ♡
            </h1>

            <div
                className={
                    styles.stage
                }
            >
                <div
                    className={
                        styles.visual
                    }
                >
                    <span>✦</span>
                    <span>✧</span>

                    <GiftVisual
                        gift={gift}
                        variant="large"
                    />
                </div>

                <div
                    className={
                        styles.note
                    }
                >
                    <small>
                        Bạn đã chọn
                    </small>

                    <strong>
                        Hộp số{' '}
                        {gift.number} ♡
                    </strong>
                </div>
            </div>

            <p>
                Quà thì chọn xong rồi...
                <br />
                Nhưng hình như vẫn còn
                thiếu một thứ...
            </p>

            <button
                type="button"
                className={
                    styles.button
                }
                onClick={
                    onContinue
                }
            >
                Đi tiếp nhé ♡
            </button>
        </section>
    );
}

export default SelectedGiftStep;