import {
    useEffect,
    useRef,
    useState,
} from 'react';

import Button from '@/components/Button';

import styles from './WishMessage.module.scss';

function WishMessage({
    message,
    name,
}) {
    const [nameText, setNameText] =
        useState('');

    const [
        messageText,
        setMessageText,
    ] = useState('');

    /*
     * name
     * message
     * done
     */
    const [
        typingTarget,
        setTypingTarget,
    ] = useState('name');

    const messageTextRef =
        useRef(null);

    useEffect(() => {
        let nameIndex = 0;
        let messageIndex = 0;

        let nameTimer;
        let messageTimer;

        /*
         * Reset nếu props thay đổi.
         */
        setNameText('');
        setMessageText('');
        setTypingTarget('name');

        const startTimer =
            setTimeout(() => {
                /*
                 * =========================
                 * TYPE NAME
                 * =========================
                 */

                nameTimer =
                    setInterval(() => {
                        setNameText(
                            name.slice(
                                0,
                                nameIndex + 1,
                            ),
                        );

                        nameIndex += 1;

                        if (
                            nameIndex >=
                            name.length
                        ) {
                            clearInterval(
                                nameTimer,
                            );

                            setTypingTarget(
                                'message',
                            );

                            /*
                             * =========================
                             * TYPE MESSAGE
                             * =========================
                             */

                            messageTimer =
                                setInterval(
                                    () => {
                                        setMessageText(
                                            message.slice(
                                                0,
                                                messageIndex +
                                                    1,
                                            ),
                                        );

                                        messageIndex +=
                                            1;

                                        /*
                                         * MESSAGE FINISHED
                                         */
                                        if (
                                            messageIndex >=
                                            message.length
                                        ) {
                                            clearInterval(
                                                messageTimer,
                                            );

                                            setTypingTarget(
                                                'done',
                                            );
                                        }
                                    },
                                    60,
                                );
                        }
                    }, 60);
            }, 1000);

        return () => {
            clearTimeout(
                startTimer,
            );

            clearInterval(
                nameTimer,
            );

            clearInterval(
                messageTimer,
            );
        };
    }, [name, message]);

    /*
     * Auto scroll khi text đang chạy.
     */
    useEffect(() => {
        if (
            !messageTextRef.current
        ) {
            return;
        }

        messageTextRef.current.scrollTop =
            messageTextRef.current
                .scrollHeight;
    }, [messageText]);

    return (
        <div
            className={
                styles.wrapper
            }
        >
            {/* NAME */}

            <h2
                className={
                    styles.name
                }
            >
                {nameText}

                {typingTarget ===
                    'name' && (
                    <span
                        className={
                            styles.cursor
                        }
                    >
                        |
                    </span>
                )}
            </h2>

            {/* MESSAGE */}

            <div
                className={
                    styles.messageText
                }
                ref={messageTextRef}
            >
                <p
                    className={
                        styles.text
                    }
                >
                    {messageText}

                    {typingTarget ===
                        'message' && (
                        <span
                            className={
                                styles.cursor
                            }
                        >
                            |
                        </span>
                    )}
                </p>
                {/* NEXT BUTTON */}

                {typingTarget ===
                    'done' && (
                    <div
                        className={
                            styles.nextButton
                        }
                    >
                        <Button
                            to="/questions"
                            className={
                                styles.button
                            }
                        >
                            Tiếp tục 💗
                        </Button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default WishMessage;