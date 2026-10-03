import {
    useState,
} from 'react';

import GiftVisual from '../GiftVisual/GiftVisual';

import styles from './GiftCard.module.scss';

function GiftCard({
    gift,
    selected,
    dimmed,
    onSelect,
}) {
    const [
        hovered,
        setHovered,
    ] = useState(false);

    return (
        <button
            type="button"
            className={[
                styles.wrapper,
                styles[gift.theme],

                selected
                    ? styles.selected
                    : '',

                dimmed
                    ? styles.dimmed
                    : '',
            ]
                .filter(Boolean)
                .join(' ')}
            onMouseEnter={() =>
                setHovered(true)
            }
            onMouseLeave={() =>
                setHovered(false)
            }
            onClick={() =>
                onSelect(gift)
            }
            aria-label={`Chọn hộp quà số ${gift.number}`}
        >
            <span
                className={
                    styles.number
                }
            >
                {gift.number}
            </span>

            <div
                className={
                    styles.visual
                }
            >
                <GiftVisual
                    gift={gift}
                    interactive={
                        hovered
                    }
                />
            </div>

            <span
                className={
                    styles.hint
                }
            >
                {gift.hint}
            </span>
        </button>
    );
}

export default GiftCard;