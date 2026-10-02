import styles from './Decorations.module.scss';

function Decorations() {
    return (
        <div
            className={styles.wrapper}
            aria-hidden="true"
        >
            <span className={styles.one}>
                ♡
            </span>

            <span className={styles.two}>
                ✦
            </span>

            <span className={styles.three}>
                ✧
            </span>

            <span className={styles.four}>
                ୨୧
            </span>

            <span className={styles.five}>
                ♡
            </span>

            <span className={styles.six}>
                ✧
            </span>
        </div>
    );
}

export default Decorations;