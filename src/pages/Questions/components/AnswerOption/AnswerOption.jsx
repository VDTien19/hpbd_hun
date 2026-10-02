import styles from './AnswerOption.module.scss';

function AnswerOption({
    option,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            className={[
                styles.wrapper,
                selected
                    ? styles.selected
                    : '',
            ]
                .filter(Boolean)
                .join(' ')}
            onClick={onClick}
            aria-pressed={selected}
        >
            <span className={styles.icon}>
                {option.icon}
            </span>

            <span className={styles.label}>
                {option.label}
            </span>

            <span
                className={styles.heart}
                aria-hidden="true"
            >
                ♡
            </span>
        </button>
    );
}

export default AnswerOption;