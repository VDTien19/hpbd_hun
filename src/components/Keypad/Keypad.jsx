import Button from '@/components/Button';
import styles from './Keypad.module.scss';

function Keypad({ onClick }) {

    const keypad = [
        { id: 1, value: '1', action: 'number' },
        { id: 2, value: '2', action: 'number' },
        { id: 3, value: '3', action: 'number' },
        { id: 4, value: '4', action: 'number' },
        { id: 5, value: '5', action: 'number' },
        { id: 6, value: '6', action: 'number' },
        { id: 7, value: '7', action: 'number' },
        { id: 8, value: '8', action: 'number' },
        { id: 9, value: '9', action: 'number' },
        { id: 10, value: 'C', action: 'clear' },
        { id: 11, value: '0', action: 'number' },
        { id: 12, value: '⌫', action: 'backspace' },
    ];

    const handleClick = (item) => {
        if (onClick) {
            onClick(item);
        }
    };

    return ( 
        <div className={styles.wrapper}>
            {keypad.map((item) => (
                <Button key={item.id} outline className={styles.btn} onClick={() => handleClick(item)}>
                    {item.value}
                </Button>
            ))}
        </div>
    );
}

export default Keypad;