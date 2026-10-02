import {
    TOTAL_QUESTIONS,
} from '../../data/questions';

import styles from './ProgressDots.module.scss';

function ProgressDots({
    currentQuestion,
}) {
    return (
        <div
            className={styles.wrapper}
            aria-label={`Câu ${
                currentQuestion + 1
            } trên ${TOTAL_QUESTIONS}`}
        >
            {Array.from({
                length:
                    TOTAL_QUESTIONS,
            }).map((_, index) => (
                <span
                    key={index}
                    className={[
                        styles.dot,
                        index ===
                        currentQuestion
                            ? styles.active
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                />
            ))}
        </div>
    );
}

export default ProgressDots;