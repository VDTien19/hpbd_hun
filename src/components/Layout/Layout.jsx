// import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

function Layout({ children }) {
    return (
        <div className={styles.layout}>
            <div className={styles.background}>
                {/* Hearts */}
                <div className={`${styles.decor} ${styles.heart1}`}>♡</div>
                <div className={`${styles.decor} ${styles.heart2}`}>♡</div>
                <div className={`${styles.decor} ${styles.heart3}`}>♡</div>

                {/* Sparkles */}
                <div className={`${styles.decor} ${styles.sparkle1}`}>✦</div>
                <div className={`${styles.decor} ${styles.sparkle2}`}>✦</div>
                <div className={`${styles.decor} ${styles.sparkle3}`}>✦</div>

                {/* Stars */}
                <div className={`${styles.decor} ${styles.star1}`}>✧</div>
                <div className={`${styles.decor} ${styles.star2}`}>✧</div>
                <div className={`${styles.decor} ${styles.star3}`}>✧</div>

                {/* Moons */}
                <div className={`${styles.decor} ${styles.moon1}`}>☾</div>
                <div className={`${styles.decor} ${styles.moon2}`}>☾</div>
                <div className={`${styles.decor} ${styles.moon3}`}>☾</div>

                {/* Flowers */}
                <div className={`${styles.decor} ${styles.flower1}`}>❀</div>
                <div className={`${styles.decor} ${styles.flower2}`}>❀</div>
                <div className={`${styles.decor} ${styles.flower3}`}>❀</div>
            </div>

            {/* <div className={styles.hearts} aria-hidden="true">
                {Array.from({ length: 25 }, (_, index) => (
                    <span
                        key={index}
                        className={styles.heart}
                    >
                        ❤
                    </span>
                ))}
            </div>

            <div className={styles.blur} /> */}

            <div className={styles.content}>
                {/* <Outlet /> */}
                {children}
            </div>
        </div>
    );
}

export default Layout;