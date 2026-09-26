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
    backgroundImage,
    backgroundImage2,
    coverImage,
    imagetest1,
    imagetest2,
    imagetest3,
    imagetest4,
    imagetest5,
} from '@/assets/images';

function Wishes() {
    const message = `Chúc mừng sinh nhật bạn nhỏ 🎂♡
Tuổi mới mong bạn luôn vui vẻ, bình an và gặp thật nhiều điều tốt đẹp. Mong những điều bạn đang cố gắng rồi sẽ có kết quả, những chuyện làm bạn mệt mỏi cũng sẽ dần nhẹ nhàng hơn.
Tôi không biết sau này mình sẽ đồng hành cùng bạn được bao lâu, nhưng ít nhất ở hiện tại, tôi vẫn thật lòng mong bạn có một tuổi mới thật đáng nhớ.
Happy Birthday, ♡`;

    // const message = ``;

    const name = `Wu Duke Tien`;
    const images = [image1,
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
    image21,];

    return (
        <div className={styles.wrapper}>
            <div className={styles.message}>
                <WishMessage message={message} name={name} />
            </div>
            <div className={styles.photoSlider}>
                <PhotoSlider
                    images={images}
                    coverImage={coverImage}
                    backgroundImage={backgroundImage2}
                />
            </div>
        </div>
    );
}

export default Wishes;
