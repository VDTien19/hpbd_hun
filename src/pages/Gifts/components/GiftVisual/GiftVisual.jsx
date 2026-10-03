import styles from './GiftVisual.module.scss';

function GiftVisual({
    gift,
    variant = 'normal',
    interactive = false,
}) {
    if (!gift) {
        return null;
    }

    const classes = [
        styles.wrapper,
        styles[gift.theme],

        variant === 'large'
            ? styles.large
            : '',

        variant === 'modal'
            ? styles.modal
            : '',

        variant === 'reveal'
            ? styles.reveal
            : '',

        interactive
            ? styles.interactive
            : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            aria-hidden="true"
        >
            <span
                className={
                    styles.shadow
                }
            />

            <span
                className={
                    styles.body
                }
            />

            <span
                className={
                    styles.lid
                }
            />

            <span
                className={
                    styles.ribbonVertical
                }
            />

            <span
                className={
                    styles.ribbonHorizontal
                }
            />

            <span
                className={
                    styles.bowLeft
                }
            />

            <span
                className={
                    styles.bowRight
                }
            />

            <span
                className={
                    styles.knot
                }
            />

            <span
                className={
                    styles.sparkleOne
                }
            >
                ✦
            </span>

            <span
                className={
                    styles.sparkleTwo
                }
            >
                ✧
            </span>
        </div>
    );
}

export default GiftVisual;