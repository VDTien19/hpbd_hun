import Button from '@/components/Button';

import styles from './SubmitSuccess.module.scss';

function SubmitSuccess({
    state,
}) {
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.sparkles}
                aria-hidden="true"
            >
                <span>✦</span>
                <span>✧</span>
                <span>♡</span>
                <span>✦</span>
                <span>✧</span>
            </div>

            <div className={styles.icon}>
                ♡
            </div>

            <p className={styles.eyebrow}>
                Wish saved ✧
            </p>

            <h2 className={styles.title}>
                Okii, tôi giữ nó
                <br />
                giúp bạn rồi ♡
            </h2>

            <p className={styles.text}>
                {state === 'ready'
                    ? 'Giờ thì đi thuiii 🎁'
                    : 'Đang cất điều ước vào một góc thật xinh...'}
            </p>

            {state === 'ready' && (
                <div
                    className={
                        styles.action
                    }
                >
                    <Button
                        to="/memories"
                        className={
                            styles.button
                        }
                    >
                        Đi tiếp thui ♡
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SubmitSuccess;