import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

function Layout() {
    return (
        <div className={styles.layout}>
            <div className={styles.background} />

            <div className={styles.hearts} aria-hidden="true">
                {Array.from({ length: 25 }, (_, index) => (
                    <span
                        key={index}
                        className={styles.heart}
                    >
                        ❤
                        {/* ♥ */}
                        {/* ❤️ */}
                        {/* 🎈 */}
                        {/* 💗 */}
                    </span>
                ))}
            </div>

            <div className={styles.blur} />

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;