import styles from './CharacterImage.module.scss';
import { normalImage, incorrectPassImage } from "@/assets/images";


function CharacterImage({ status }) {
    const image = status === 'error'
        ? incorrectPassImage
        : normalImage;

    return (  
        <div className={styles.wrapper}>
            <img src={image} alt="" className={styles.image} />
        </div>
    );
}

export default CharacterImage;