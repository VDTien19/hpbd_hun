import WishMessage from '@/components/WishMessage';
import PhotoSlider from '@/components/PhotoSlider';
import styles from './Wishes.module.scss';
import {
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12,
    image13,
    image14,
    image15,
    image16,
    image17,
    image18,
    image19,
    image20,
    image21,
    image22,
    image23,
    image24,
    image25,
    image26,
    image27,
    image28,
    image29,
    image30,
    image31,
    image32,
    image33,
    image34,
    image35,
    image36,
    image37,
    normalImage,
    backgroundImage,
    backgroundImage2,
    coverImage
} from '@/assets/images';

function Wishes() {
    const message = `Chúc mừng sinh nhật bạn nhỏ 🎂♡
Tuổi mới mong bạn luôn vui vẻ, bình an và gặp thật nhiều điều tốt đẹp. Mong những điều bạn đang cố gắng rồi sẽ có kết quả, những chuyện làm bạn mệt mỏi cũng sẽ dần nhẹ nhàng hơn.
Tôi không biết sau này mình sẽ đồng hành cùng bạn được bao lâu, nhưng ít nhất ở hiện tại, tôi vẫn thật lòng mong bạn có một tuổi mới thật đáng nhớ.
Happy Birthday, Hunhun ♡`;

    // const message = ``;

    const name = `Hoang Thu Huong`;
    const images = [
        image30,
        image23,
        image7,
        image16,
        image2,
        image11,
        image19,
        image5,
        image14,
        image25,
        image1,
        image20,
        image10,
        image18,
        image4,
        image28,
        normalImage,
        image22,
        image17,
        image21,
        image27,
        image24,
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.message}>
                <WishMessage message={message} name={name} />
            </div>
            <div className={styles.photoSlider}>
                <PhotoSlider images={images} coverImage={coverImage} backgroundImage={backgroundImage2} />
            </div>
        </div>
    );
}

export default Wishes;
