import { useEffect, useRef, useState } from 'react';

import Intro from './components/Intro';
import Decorations from './components/Decorations';
import QuestionContent from './components/QuestionContent';
import QuestionFooter from './components/QuestionFooter';
import SubmitSuccess from './components/SubmitSuccess';

import { TOTAL_QUESTIONS, questionOneOptions } from './data/questions';

import { sendAnswerChange } from '@/services/birthdayEventService';

import styles from './Questions.module.scss';

function Questions() {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({
        mood: '',
        newThing: '',
        futureMessage: '',
        wish: '',
        keepSecret: false,
    });

    const [transitionState, setTransitionState] = useState('idle');

    const [direction, setDirection] = useState('next');

    const [submitState, setSubmitState] = useState('idle');

    const transitionTimerRef = useRef(null);

    const enterTimerRef = useRef(null);

    const submitTimerRef = useRef(null);

    const isFirstQuestion = currentQuestion === 0;

    const isLastQuestion = currentQuestion === TOTAL_QUESTIONS - 1;

    const canContinue = currentQuestion !== 0 || Boolean(answers.mood);

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    useEffect(() => {
        return () => {
            clearTimeout(transitionTimerRef.current);

            clearTimeout(enterTimerRef.current);

            clearTimeout(submitTimerRef.current);
        };
    }, []);

    /*
     * =====================================================
     * ANSWERS
     * =====================================================
     */

    const updateAnswer = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /*
     * =====================================================
     * SEND CURRENT QUESTION
     * =====================================================
     *
     * Không gửi trong updateAnswer().
     *
     * Chỉ gửi khi user bấm:
     *
     * Next
     * hoặc
     * Submit
     */

    const sendCurrentAnswer = () => {
        switch (currentQuestion) {
            /*
             * =============================================
             * QUESTION 1
             * =============================================
             */

            case 0: {
                const selectedOption = questionOneOptions.find((option) => option.id === answers.mood);

                if (!selectedOption) {
                    return;
                }

                void sendAnswerChange({
                    questionNumber: 1,

                    questionId: 'q1',

                    question: 'Bước qua tuổi mới, bạn nhỏ vui không?',

                    answerType: 'choice',

                    answerId: selectedOption.id,

                    answerText: selectedOption.label,
                });

                break;
            }

            /*
             * =============================================
             * QUESTION 2
             * =============================================
             */

            case 1:
                void sendAnswerChange({
                    questionNumber: 2,

                    questionId: 'q2',

                    question: 'Tuổi mới, có điều gì bạn muốn làm mà trước giờ vẫn chưa làm được không?',

                    answerType: 'text',

                    answerText: answers.newThing,
                });

                break;

            /*
             * =============================================
             * QUESTION 3
             * =============================================
             */

            case 2:
                void sendAnswerChange({
                    questionNumber: 3,

                    questionId: 'q3',

                    question: 'Nếu được nhắn một câu cho Hương của một năm sau, bạn sẽ nói gì?',

                    answerType: 'text',

                    answerText: answers.futureMessage,
                });

                break;

            /*
             * =============================================
             * QUESTION 4
             * =============================================
             */

            case 3:
                void sendAnswerChange({
                    questionNumber: 4,

                    questionId: 'q4',

                    question: 'Bạn nhỏ có một điều ước cho tuổi mới không?',

                    answerType: 'text',

                    answerText: answers.wish,

                    extra: {
                        keepSecret: answers.keepSecret,
                    },
                });

                break;

            default:
                break;
        }
    };

    /*
     * =====================================================
     * CHANGE QUESTION
     * =====================================================
     */

    const changeQuestion = (nextIndex, nextDirection) => {
        if (transitionState !== 'idle' || nextIndex < 0 || nextIndex >= TOTAL_QUESTIONS) {
            return;
        }

        setDirection(nextDirection);

        setTransitionState('leaving');

        transitionTimerRef.current = setTimeout(() => {
            setCurrentQuestion(nextIndex);

            setTransitionState('entering');

            enterTimerRef.current = setTimeout(() => {
                setTransitionState('idle');
            }, 380);
        }, 220);
    };

    /*
     * =====================================================
     * NEXT
     * =====================================================
     */

    const handleNext = () => {
        if (!canContinue || isLastQuestion) {
            return;
        }

        /*
         * Gửi câu hiện tại trước.
         *
         * Không await nên animation
         * chuyển câu vẫn chạy ngay.
         */
        sendCurrentAnswer();

        changeQuestion(currentQuestion + 1, 'next');
    };

    /*
     * =====================================================
     * BACK
     * =====================================================
     */

    const handleBack = () => {
        if (isFirstQuestion) {
            return;
        }

        /*
         * Back chỉ chuyển trang.
         *
         * Không gửi event ở đây.
         */
        changeQuestion(currentQuestion - 1, 'back');
    };

    /*
     * =====================================================
     * SUBMIT
     * =====================================================
     */

    const handleSubmit = () => {
        if (submitState !== 'idle') {
            return;
        }

        /*
         * Submit ở question cuối
         * → gửi Q4.
         */
        sendCurrentAnswer();

        setSubmitState('saved');

        submitTimerRef.current = setTimeout(() => {
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

        transitionState === 'leaving' ? (direction === 'next' ? styles.leaveNext : styles.leaveBack) : '',

        transitionState === 'entering' ? (direction === 'next' ? styles.enterNext : styles.enterBack) : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <main className={styles.wrapper}>
            <Decorations />

            <div className={styles.container}>
                <Intro />

                <section className={styles.questionArea}>
                    <div className={cardClasses}>
                        {submitState === 'idle' ? (
                            <>
                                <QuestionContent
                                    currentQuestion={currentQuestion}
                                    answers={answers}
                                    updateAnswer={updateAnswer}
                                />

                                <QuestionFooter
                                    currentQuestion={currentQuestion}
                                    canContinue={canContinue}
                                    isFirstQuestion={isFirstQuestion}
                                    isLastQuestion={isLastQuestion}
                                    disabled={transitionState !== 'idle'}
                                    onBack={handleBack}
                                    onNext={handleNext}
                                    onSubmit={handleSubmit}
                                />
                            </>
                        ) : (
                            <SubmitSuccess state={submitState} />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Questions;
