import {
    supabase,
} from '@/lib/supabase';

const SESSION_KEY =
    'birthday_session_id';

const ANSWER_STATE_KEY =
    'birthday_answer_state';

/*
 * =========================================================
 * SESSION
 * =========================================================
 *
 * Một tab/browser session sẽ có một sessionId.
 *
 * F5:
 * → giữ nguyên
 *
 * đóng tab rồi mở lại:
 * → session mới
 */

export function getBirthdaySessionId() {
    let sessionId =
        sessionStorage.getItem(
            SESSION_KEY,
        );

    if (!sessionId) {
        sessionId =
            crypto.randomUUID();

        sessionStorage.setItem(
            SESSION_KEY,
            sessionId,
        );
    }

    return sessionId;
}

/*
 * =========================================================
 * ANSWER STATE
 * =========================================================
 *
 * Dùng để nhớ đáp án hiện tại của từng câu.
 *
 * Ví dụ:
 *
 * {
 *   q1: {
 *      answerId: "a",
 *      answerText: "Đáp án A"
 *   },
 *
 *   q2: {
 *      answerId: "c",
 *      answerText: "Đáp án C"
 *   }
 * }
 */

function getAnswerState() {
    const raw =
        sessionStorage.getItem(
            ANSWER_STATE_KEY,
        );

    if (!raw) {
        return {};
    }

    try {
        return JSON.parse(
            raw,
        );
    } catch {
        return {};
    }
}

function saveAnswerState(
    state,
) {
    sessionStorage.setItem(
        ANSWER_STATE_KEY,
        JSON.stringify(
            state,
        ),
    );
}

/*
 * =========================================================
 * GENERIC EVENT
 * =========================================================
 */

export async function sendBirthdayEvent({
    type,
    eventId,
    payload = {},
}) {
    const sessionId =
        getBirthdaySessionId();

    const eventKey = [
        sessionId,
        type,
        eventId,
    ]
        .filter(Boolean)
        .join(':');

    const {
        data,
        error,
    } =
        await supabase.functions.invoke(
            'birthday-event',
            {
                body: {
                    eventKey,

                    sessionId,

                    projectKey:
                        'ju-birthday',

                    type,

                    payload,
                },
            },
        );

    if (error) {
        console.error(
            '[Birthday Event]',
            error,
        );

        return {
            ok: false,
            error,
        };
    }

    return data;
}

/*
 * =========================================================
 * ANSWER CHANGE
 * =========================================================
 *
 * Đây là function Questions sẽ dùng.
 *
 * Nếu:
 *
 * null → A
 * => gửi
 *
 * A → A
 * => không gửi
 *
 * A → B
 * => gửi
 *
 * B → A
 * => gửi
 */

export async function sendAnswerChange({
    questionId,
    question,
    answerId,
    answerText,
}) {
    const sessionId =
        getBirthdaySessionId();

    const answerState =
        getAnswerState();

    const previous =
        answerState[
            questionId
        ] ?? null;

    /*
     * Người dùng vẫn chọn đúng
     * đáp án hiện tại.
     *
     * Không có thay đổi.
     */
    if (
        previous?.answerId ===
        answerId
    ) {
        return {
            ok: true,
            skipped: true,
            reason:
                'answer-not-changed',
        };
    }

    /*
     * Mỗi lần thay đổi thật sự
     * là một event riêng.
     */
    const interactionId =
        crypto.randomUUID();

    const eventKey = [
        sessionId,
        'answer',
        questionId,
        interactionId,
    ].join(':');

    const payload = {
        questionId,

        question,

        previousAnswerId:
            previous?.answerId ??
            null,

        previousAnswer:
            previous?.answerText ??
            null,

        answerId,

        answer:
            answerText,
    };

    const {
        data,
        error,
    } =
        await supabase.functions.invoke(
            'birthday-event',
            {
                body: {
                    eventKey,

                    sessionId,

                    projectKey:
                        'ju-birthday',

                    type:
                        'answer',

                    payload,
                },
            },
        );

    if (error) {
        console.error(
            '[Answer Change]',
            error,
        );

        /*
         * Request lỗi
         * → KHÔNG update local state.
         *
         * Lần sau vẫn có thể gửi lại.
         */

        return {
            ok: false,
            error,
        };
    }

    /*
     * Backend nhận thành công rồi
     * mới ghi nhận đáp án hiện tại.
     */

    answerState[
        questionId
    ] = {
        answerId,

        answerText,
    };

    saveAnswerState(
        answerState,
    );

    return data;
}

/*
 * =========================================================
 * RESET
 * =========================================================
 *
 * Nếu sau này có nút:
 * "Chơi lại từ đầu"
 *
 * có thể gọi function này.
 */

export function resetBirthdayAnswerState() {
    sessionStorage.removeItem(
        ANSWER_STATE_KEY,
    );
}