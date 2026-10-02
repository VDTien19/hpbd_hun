import Button from '@/components/Button';

import ProgressDots from '../ProgressDots';

import styles from './QuestionFooter.module.scss';

function QuestionFooter({
    currentQuestion,
    canContinue,
    isFirstQuestion,
    isLastQuestion,
    disabled,
    onBack,
    onNext,
    onSubmit,
}) {
    return (
        <footer className={styles.wrapper}>
            <ProgressDots
                currentQuestion={
                    currentQuestion
                }
            />

            <div
                className={
                    styles.navigation
                }
            >
                {!isFirstQuestion ? (
                    <button
                        type="button"
                        className={
                            styles.back
                        }
                        onClick={onBack}
                        disabled={disabled}
                    >
                        ← Quay lại
                    </button>
                ) : (
                    <span />
                )}

                {!isLastQuestion ? (
                    <Button
                        className={
                            styles.primary
                        }
                        onClick={onNext}
                        disabled={
                            !canContinue ||
                            disabled
                        }
                    >
                        Câu tiếp theo
                        <span>→</span>
                    </Button>
                ) : (
                    <Button
                        className={
                            styles.primary
                        }
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        Gửi điều ước này nhé ♡
                    </Button>
                )}
            </div>
        </footer>
    );
}

export default QuestionFooter;