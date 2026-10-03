import {
    useEffect,
} from 'react';

import GiftVisual from '../GiftVisual/GiftVisual';

import styles from './GiftModal.module.scss';

function GiftModal({
    gift,
    onCancel,
    onConfirm,
}) {
    useEffect(() => {
        const handleKeyDown = (
            event,
        ) => {
            if (
                event.key === 'Escape'
            ) {
                onCancel();
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
        };
    }, [onCancel]);

    return (
        <div
            className={
                styles.backdrop
            }
            onMouseDown={
                onCancel
            }
        >
            <div
                className={
                    styles.modal
                }
                role="dialog"
                aria-modal="true"
                onMouseDown={(
                    event,
                ) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    className={
                        styles.close
                    }
                    onClick={
                        onCancel
                    }
                    aria-label="Đóng"
                >
                    ×
                </button>

                <span
                    className={
                        styles.eyebrow
                    }
                >
                    Chốt đơn... à nhầm =)))
                </span>

                <h2>
                    Chắc chưa? 👀
                </h2>

                <p>
                    Bạn đã chọn{' '}
                    <strong>
                        Hộp số {gift.number}
                    </strong>
                </p>

                <GiftVisual
                    gift={gift}
                    variant="modal"
                />

                <div
                    className={
                        styles.actions
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.primary
                        }
                        onClick={
                            onConfirm
                        }
                    >
                        Chắc rồi ♡
                    </button>

                    <button
                        type="button"
                        className={
                            styles.secondary
                        }
                        onClick={
                            onCancel
                        }
                    >
                        Để tôi nghĩ lại =)))
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GiftModal;