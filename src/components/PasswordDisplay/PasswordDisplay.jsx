import styles from './PasswordDisplay.module.scss';
import Loading from '@/components/Loading';

function PasswordDisplay({ password, error, loading }) {
    return ( 
        <div className={styles.wrapper}>
            <p className={styles.title}>Nhập ngày sinh của cậu nha!!!</p>
            <div className={styles.passwordBox}>
                <div className={styles.password}>
                    {/* {password} */}
                    {/* <p className={styles.passwordText}>
                        {password}
                    </p> */}
                    {Array.from({ length: 4 }, (_, index) => {
                        return (
                            <p className={styles.passwordText} key={index}>
                                {index < password.length ? password[index] : '○'}
                            </p>
                        )
                    })}
    
                </div>
                <div className={styles.loading}>
                    {loading && <Loading />}
                </div>
            </div>
            <span>
                {error && <p className={styles.error}>{error}</p>}
            </span>
            {/* <div className={styles.password}>
                {password.split('').map((char, index) => (
                    <span key={index} className={styles.char}>
                        {char}
                    </span>
                ))}
            </div> */}
        </div> 

    );
}

export default PasswordDisplay;