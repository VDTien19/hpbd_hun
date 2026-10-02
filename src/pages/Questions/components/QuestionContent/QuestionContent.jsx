import QuestionCard from '../QuestionCard';
import AnswerOption from '../AnswerOption';

import { questionOneOptions } from '../../data/questions';

import styles from './QuestionContent.module.scss';

function QuestionContent({ currentQuestion, answers, updateAnswer }) {
    switch (currentQuestion) {
        case 0:
            return (
                <QuestionCard
                    number="01"
                    title={
                        <>
                            Bước qua tuổi mới
                            <br />
                            bạn nhỏ vui không? <span>♡</span>
                        </>
                    }
                    subtitle="Chọn một câu trả lời nè"
                >
                    <div className={styles.optionsGrid}>
                        {questionOneOptions.map((option) => (
                            <AnswerOption
                                key={option.id}
                                option={option}
                                selected={answers.mood === option.id}
                                onClick={() => updateAnswer('mood', option.id)}
                            />
                        ))}
                    </div>
                </QuestionCard>
            );

        case 1:
            return (
                <QuestionCard
                    number="02"
                    title={
                        <>
                            Tuổi mới, có điều gì bạn muốn làm
                            <br />
                            mà trước giờ vẫn chưa làm được không?
                        </>
                    }
                >
                    <textarea
                        className={styles.textarea}
                        value={answers.newThing}
                        onChange={(event) => updateAnswer('newThing', event.target.value)}
                        placeholder={'Viết gì cũng được, tôi không chấm chính tả đâu...\n(hoặc có thể bỏ trống nè)'}
                    />
                </QuestionCard>
            );

        case 2:
            return (
                <QuestionCard
                    number="03"
                    title={
                        <>
                            Nếu được nhắn một câu cho
                            <br />
                            Hương của một năm sau, bạn sẽ nói gì? <span>♡</span>
                        </>
                    }
                >
                    <div className={styles.futureMessage}>
                        <div className={styles.textareaLabel}>Gửi Hương của một năm sau ✧</div>

                        <textarea
                            className={styles.textarea}
                            value={answers.futureMessage}
                            onChange={(event) => updateAnswer('futureMessage', event.target.value)}
                            placeholder="Viết vài dòng cho Hương của một năm sau nhé..."
                        />

                        <span className={styles.letter} aria-hidden="true">
                            ♡
                        </span>
                    </div>
                </QuestionCard>
            );

        case 3:
            return (
                <QuestionCard
                    number="04"
                    smallHeading="Cuối cùng..."
                    title={
                        <>
                            Bạn nhỏ có một điều ước
                            <br />
                            cho tuổi mới không? <span>✧</span>
                        </>
                    }
                >
                    <textarea
                        className={styles.textarea}
                        value={answers.wish}
                        onChange={(event) => updateAnswer('wish', event.target.value)}
                        placeholder="Ước đi, tôi hứa không đọc đâu 🤫"
                    />

                    <label className={styles.secretOption}>
                        <input
                            type="checkbox"
                            checked={answers.keepSecret}
                            onChange={(event) => updateAnswer('keepSecret', event.target.checked)}
                        />

                        <span className={styles.checkbox}>✓</span>

                        <span>Giữ bí mật điều ước này</span>
                    </label>
                </QuestionCard>
            );

        default:
            return null;
    }
}

export default QuestionContent;
