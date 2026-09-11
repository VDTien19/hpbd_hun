import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Home.module.scss';
import Keypad from '@/components/Keypad';
import PasswordDisplay from '@/components/PasswordDisplay';
import CharacterImage from '@/components/CharacterImage';

function Home() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle');

    const CORRECT_PASSWORD = '0000';

    useEffect(() => {
        if (password.length !== 4) {
            return;
        }

        // Đã nhập đủ password → bắt đầu loading
        setStatus('loading');

        const timer = setTimeout(() => {
            if (password === CORRECT_PASSWORD) {
                // Đúng → chuyển trang
                navigate('/wishes');
            } else {
                // Sai → hiện lỗi
                setStatus('error');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [password, navigate]);

    const error =
        status === 'error'
            ? 'Chưa đúng gòiiiii ní ơi 🥺'
            : '';

    const loading = status === 'loading';

    const handleKeypadClick = (item) => {
        // Đang loading thì không cho nhập
        if (status === 'loading') {
            return;
        }

        switch (item.action) {
            case 'number':
                setPassword((prev) => {
                    if (prev.length >= 4) {
                        return prev;
                    }

                    return prev + item.value;
                });
                break;

            case 'clear':
                setPassword('');
                setStatus('idle');
                break;

            case 'backspace':
                setPassword((prev) => prev.slice(0, -1));
                setStatus('idle');
                break;

            default:
                break;
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <CharacterImage status={status} />
                <div className={styles.passKey}>
                    <PasswordDisplay
                        password={password}
                        error={error}
                        loading={loading}
                    />
    
                    <Keypad onClick={handleKeypadClick} />
                </div>
            </div>
        </div>
    );
}

export default Home;