import {
    useEffect,
    useRef,
    useState,
} from 'react';

import Intro from './components/Intro';
import Decorations from './components/Decorations';
import QuestionContent from './components/QuestionContent';
import QuestionFooter from './components/QuestionFooter';
import SubmitSuccess from './components/SubmitSuccess';

import {
    TOTAL_QUESTIONS,
} from './data/questions';

import styles from './Questions.module.scss';

function Questions() {
    const [
        currentQuestion,
        setCurrentQuestion,
    ] = useState(0);

    const [answers, setAnswers] =
        useState({
            mood: '',
            newThing: '',
            futureMessage: '',
            wish: '',
            keepSecret: false,
        });

    const [
        transitionState,
        setTransitionState,
    ] = useState('idle');

    const [
        direction,
        setDirection,
    ] = useState('next');

    const [
        submitState,
        setSubmitState,
    ] = useState('idle');

    const transitionTimerRef =
        useRef(null);

    const enterTimerRef =
        useRef(null);

    const submitTimerRef =
        useRef(null);

    const isFirstQuestion =
        currentQuestion === 0;

    const isLastQuestion =
        currentQuestion ===
        TOTAL_QUESTIONS - 1;

    const canContinue =
        currentQuestion !== 0 ||
        Boolean(answers.mood);

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    useEffect(() => {
        return () => {
            clearTimeout(
                transitionTimerRef.current,
            );

            clearTimeout(
                enterTimerRef.current,
            );

            clearTimeout(
                submitTimerRef.current,
            );
        };
    }, []);

    /*
     * =====================================================
     * ANSWERS
     * =====================================================
     */

    const updateAnswer = (
        key,
        value,
    ) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /*
     * =====================================================
     * CHANGE QUESTION
     * =====================================================
     */

    const changeQuestion = (
        nextIndex,
        nextDirection,
    ) => {
        if (
            transitionState !== 'idle' ||
            nextIndex < 0 ||
            nextIndex >= TOTAL_QUESTIONS
        ) {
            return;
        }

        setDirection(nextDirection);

        setTransitionState(
            'leaving',
        );

        transitionTimerRef.current =
            setTimeout(() => {
                setCurrentQuestion(
                    nextIndex,
                );

                setTransitionState(
                    'entering',
                );

                enterTimerRef.current =
                    setTimeout(() => {
                        setTransitionState(
                            'idle',
                        );
                    }, 380);
            }, 220);
    };

    const handleNext = () => {
        if (
            !canContinue ||
            isLastQuestion
        ) {
            return;
        }

        changeQuestion(
            currentQuestion + 1,
            'next',
        );
    };

    const handleBack = () => {
        if (isFirstQuestion) {
            return;
        }

        changeQuestion(
            currentQuestion - 1,
            'back',
        );
    };

    /*
     * =====================================================
     * SUBMIT
     * =====================================================
     */

    const handleSubmit = () => {
        if (
            submitState !== 'idle'
        ) {
            return;
        }

        setSubmitState('saved');

        submitTimerRef.current =
            setTimeout(() => {
                setSubmitState('ready');
            }, 1000);
    };

    /*
     * =====================================================
     * CARD ANIMATION CLASS
     * =====================================================
     */

    const cardClasses = [
        styles.questionCard,

        transitionState === 'leaving'
            ? direction === 'next'
                ? styles.leaveNext
                : styles.leaveBack
            : '',

        transitionState === 'entering'
            ? direction === 'next'
                ? styles.enterNext
                : styles.enterBack
            : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <main className={styles.wrapper}>
            <Decorations />

            <div className={styles.container}>
                <Intro />

                <section
                    className={
                        styles.questionArea
                    }
                >
                    <div
                        className={
                            cardClasses
                        }
                    >
                        {submitState ===
                        'idle' ? (
                            <>
                                <QuestionContent
                                    currentQuestion={
                                        currentQuestion
                                    }
                                    answers={
                                        answers
                                    }
                                    updateAnswer={
                                        updateAnswer
                                    }
                                />

                                <QuestionFooter
                                    currentQuestion={
                                        currentQuestion
                                    }
                                    canContinue={
                                        canContinue
                                    }
                                    isFirstQuestion={
                                        isFirstQuestion
                                    }
                                    isLastQuestion={
                                        isLastQuestion
                                    }
                                    disabled={
                                        transitionState !==
                                        'idle'
                                    }
                                    onBack={
                                        handleBack
                                    }
                                    onNext={
                                        handleNext
                                    }
                                    onSubmit={
                                        handleSubmit
                                    }
                                />
                            </>
                        ) : (
                            <SubmitSuccess
                                state={
                                    submitState
                                }
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Questions;