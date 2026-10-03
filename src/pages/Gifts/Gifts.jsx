import {
    useState,
} from 'react';

import {
    useNavigate,
} from 'react-router-dom';

import gifts from './data/gifts';

import Decorations from './components/Decorations';
import ChooseGiftStep from './components/ChooseGiftStep';
import GiftModal from './components/GiftModal';
import SelectedGiftStep from './components/SelectedGiftStep';
import TrollStep from './components/TrollStep';
import RevealAllStep from './components/RevealAllStep';
import CandleStep from './components/CandleStep';

import styles from './Gifts.module.scss';

const MEMORIES_ROUTE =
    '/memories';

function Gifts() {
    const navigate =
        useNavigate();

    /*
     * choose
     * confirm
     * selected
     * troll
     * revealAll
     * candle
     */
    const [
        step,
        setStep,
    ] = useState('choose');

    const [
        selectedGift,
        setSelectedGift,
    ] = useState(null);

    /*
     * =============================================
     * CHOOSE
     * =============================================
     */

    const handleSelectGift = (
        gift,
    ) => {
        setSelectedGift(
            gift,
        );

        setStep(
            'confirm',
        );
    };

    /*
     * =============================================
     * CONFIRM
     * =============================================
     */

    const handleCancelGift =
        () => {
            setSelectedGift(
                null,
            );

            setStep(
                'choose',
            );
        };

    const handleConfirmGift =
        () => {
            if (!selectedGift) {
                return;
            }

            /*
             * Nếu sau này bạn có API
             * lưu gift thì đặt call
             * ở đây.
             */

            setStep(
                'selected',
            );
        };

    /*
     * =============================================
     * STORY FLOW
     * =============================================
     */

    const handleGoToTroll =
        () => {
            setStep(
                'troll',
            );
        };

    const handleTrollFinish =
        () => {
            setStep(
                'revealAll',
            );
        };

    const handleRevealFinish =
        () => {
            setStep(
                'candle',
            );
        };

    const handleCandleFinish =
        () => {
            navigate(
                MEMORIES_ROUTE,
            );
        };

    return (
        <main
            className={
                styles.page
            }
        >
            <Decorations />

            <div
                className={
                    styles.content
                }
            >
                {(step === 'choose' ||
                    step ===
                        'confirm') && (
                    <ChooseGiftStep
                        gifts={
                            gifts
                        }
                        selectedGift={
                            selectedGift
                        }
                        isConfirming={
                            step ===
                            'confirm'
                        }
                        onSelect={
                            handleSelectGift
                        }
                    />
                )}

                {step ===
                    'selected' &&
                    selectedGift && (
                    <SelectedGiftStep
                        gift={
                            selectedGift
                        }
                        onContinue={
                            handleGoToTroll
                        }
                    />
                )}

                {step ===
                    'troll' && (
                    <TrollStep
                        onFinish={
                            handleTrollFinish
                        }
                    />
                )}

                {step ===
                    'revealAll' &&
                    selectedGift && (
                    <RevealAllStep
                        gifts={
                            gifts
                        }
                        selectedGift={
                            selectedGift
                        }
                        onContinue={
                            handleRevealFinish
                        }
                    />
                )}

                {step ===
                    'candle' && (
                    <CandleStep
                        onComplete={
                            handleCandleFinish
                        }
                    />
                )}
            </div>

            {step === 'confirm' &&
                selectedGift && (
                    <GiftModal
                        gift={
                            selectedGift
                        }
                        onCancel={
                            handleCancelGift
                        }
                        onConfirm={
                            handleConfirmGift
                        }
                    />
                )}
        </main>
    );
}

export default Gifts;