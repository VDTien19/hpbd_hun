import styles from './QuestionCard.module.scss';

function QuestionCard({
    number,
    smallHeading,
    title,
    subtitle,
    children,
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <span className={styles.counter}>
                    {number} / 04
                </span>

                <span
                    className={styles.sparkle}
                    aria-hidden="true"
                >
                    ✧
                </span>
            </div>

            {smallHeading && (
                <p className={styles.smallHeading}>
                    {smallHeading}
                </p>
            )}

            <h2 className={styles.title}>
                {title}
            </h2>

            {subtitle && (
                <p className={styles.subtitle}>
                    {subtitle}
                </p>
            )}

            <div className={styles.answer}>
                {children}
            </div>
        </div>
    );
}

export default QuestionCard;