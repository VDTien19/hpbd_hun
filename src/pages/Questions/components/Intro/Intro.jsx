import styles from './Intro.module.scss';

function Intro() {
    return (
        <section className={styles.wrapper}>
            {/* <span className={styles.eyebrow}>
                Chương 3 ✧
            </span> */}

            <h1 className={styles.title}>
                Questions
                <span>♡</span>
            </h1>

            <p className={styles.subtitle}>
                Trước khi nhận quà,
                <br />
                cho tôi hỏi bạn nhỏ vài câu
                nhé ♡
            </p>

            <p className={styles.description}>
                Không có đúng sai đâu,
                chỉ là vài câu hỏi nhỏ để
                hiểu bạn hơn và lưu lại
                chút điều xinh xắn cho tuổi
                mới thôi nè.
            </p>

            <div
                className={styles.decoration}
                aria-hidden="true"
            >
                <span>♡</span>
                <span>✧</span>
                <span>୨୧</span>
            </div>
        </section>
    );
}

export default Intro;