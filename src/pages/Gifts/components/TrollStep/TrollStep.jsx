import { useEffect, useRef, useState } from 'react';

import styles from './TrollStep.module.scss';

const noButtonTexts = ['Không =)))', 'Vẫn là không', 'Thôi chọn đi :(('];

function TrollStep({ onFinish }) {
    const [attempts, setAttempts] = useState(0);

    const [answer, setAnswer] = useState(null);

    const timerRef = useRef(null);

    /*
     * Dùng để tránh việc
     * một lần hover bị count 2 lần
     * do button đang tự di chuyển.
     */
    const moveLockRef = useRef(false);

    const moveLockTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);

            clearTimeout(moveLockTimerRef.current);
        };
    }, []);

    /*
     * =========================
     * MOVE "NO" BUTTON
     * =========================
     */

    const moveNo = () => {
        if (attempts >= 2 || moveLockRef.current) {
            return;
        }

        /*
         * Khóa ngắn để tránh
         * mouseEnter chạy 2 lần
         * trong cùng một animation.
         */
        moveLockRef.current = true;

        setAttempts((prev) => Math.min(prev + 1, 2));

        moveLockTimerRef.current = setTimeout(() => {
            moveLockRef.current = false;
        }, 450);
    };

    /*
     * =========================
     * DESKTOP HOVER
     * =========================
     */

    const handleNoHover = () => {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (!canHover || attempts >= 2) {
            return;
        }

        moveNo();
    };

    /*
     * =========================
     * FINISH
     * =========================
     */

    const finish = (value) => {
        if (answer) {
            return;
        }

        setAnswer(value);

        timerRef.current = setTimeout(onFinish, 800);
    };

    /*
     * =========================
     * MOBILE / CLICK
     * =========================
     *
     * tap 1:
     * chạy + đổi text
     *
     * tap 2:
     * chạy + đổi text
     *
     * tap 3:
     * cho phép chọn Không
     */

    const handleNo = () => {
        if (attempts < 2) {
            moveNo();

            return;
        }

        finish('no');
    };

    /*
     * Text phụ thuộc attempts:
     *
     * 0 -> Không =)))
     * 1 -> Vẫn là không
     * 2 -> Thôi chọn đi :((
     */

    const noButtonText = noButtonTexts[attempts];

    /*
     * =========================
     * ANSWER RESULT
     * =========================
     */

    if (answer) {
        return (
            <section className={styles.result}>
                <span>✧</span>

                <h2>{answer === 'yes' ? 'Biết ngay mà =))) ♡' : 'Đã ghi nhận một câu trả lời không chính xác 😒'}</h2>
            </section>
        );
    }

    return (
        <section className={styles.wrapper}>
            <span className={styles.eyebrow}>Nhưng trước khi đi tiếp...</span>

            <p className={styles.lead}>Tôi có một câu hỏi rất quan trọng =)))</p>

            <div className={styles.cat} aria-hidden="true">
                <span className={styles.earLeft} />

                <span className={styles.earRight} />

                <span className={styles.face}>
                    <i />
                    <i />

                    <b>ᴗ</b>
                </span>
            </div>

            <h1>
                Bạn có chắc người làm
                <br />
                website này đẹp trai không? ♡
            </h1>

            <div className={styles.actions}>
                <button type="button" className={styles.yes} onClick={() => finish('yes')}>
                    Có ♡
                </button>

                <button
                    type="button"
                    className={[styles.no, attempts === 1 ? styles.moveOne : '', attempts >= 2 ? styles.moveTwo : '']
                        .filter(Boolean)
                        .join(' ')}
                    onMouseEnter={handleNoHover}
                    onClick={handleNo}
                >
                    {noButtonText}
                </button>
            </div>
        </section>
    );
}

export default TrollStep;
