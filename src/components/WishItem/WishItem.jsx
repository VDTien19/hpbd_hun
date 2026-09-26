
import styles from './WishItem.module.scss';

function WishItem({ image }) {
    return (  
        <div className={styles.wrapper}>
            <img src={image} alt="" className={styles.imageItem} />
        </div>
    );
}

export default WishItem;