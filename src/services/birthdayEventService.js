import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'birthday_session_id';

const ANSWER_STATE_KEY = 'birthday_answer_state';

function createUuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);

    crypto.getRandomValues(bytes);

    /*
     * UUID v4
     */
    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

    return [
        hex.slice(0, 4).join(''),

        hex.slice(4, 6).join(''),

        hex.slice(6, 8).join(''),

        hex.slice(8, 10).join(''),

        hex.slice(10, 16).join(''),
    ].join('-');
}

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
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        sessionId = createUuid();

        sessionStorage.setItem(SESSION_KEY, sessionId);
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
    const raw = sessionStorage.getItem(ANSWER_STATE_KEY);

    if (!raw) {
        return {};
    }

    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveAnswerState(state) {
    sessionStorage.setItem(ANSWER_STATE_KEY, JSON.stringify(state));
}

/*
 * =========================================================
 * GENERIC EVENT
 * =========================================================
 */

export async function sendBirthdayEvent({ type, eventId, payload = {} }) {
    const sessionId = getBirthdaySessionId();

    const eventKey = [sessionId, type, eventId].filter(Boolean).join(':');

    const { data, error } = await supabase.functions.invoke('birthday-event', {
        body: {
            eventKey,

            sessionId,

            projectKey: 'ju-birthday',

            type,

            payload,
        },
    });

    if (error) {
        console.error('[Birthday Event]', error);

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
    questionNumber,
    questionId,
    question,
    answerType,
    answerId = null,
    answerText = '',
    extra = {},
}) {
    const sessionId = getBirthdaySessionId();

    const answerState = getAnswerState();

    const previous = answerState[questionId] ?? null;

    const normalizedAnswerText = String(answerText).trim();

    /*
     * Trạng thái hiện tại của câu trả lời.
     *
     * extra dùng cho những dữ liệu phụ,
     * ví dụ Q4 có keepSecret.
     */
    const currentAnswer = {
        answerType,

        answerId: answerId ?? null,

        answerText: normalizedAnswerText,

        extra,
    };

    /*
     * Kiểm tra user có thực sự
     * thay đổi câu trả lời hay không.
     */
    const isSameAnswer =
        previous &&
        previous.answerType === currentAnswer.answerType &&
        previous.answerId === currentAnswer.answerId &&
        previous.answerText === currentAnswer.answerText &&
        JSON.stringify(previous.extra ?? {}) === JSON.stringify(currentAnswer.extra ?? {});

    if (isSameAnswer) {
        return {
            ok: true,
            skipped: true,
            reason: 'answer-not-changed',
        };
    }

    /*
     * Mỗi lần thay đổi thật sự
     * → event mới.
     */
    const interactionId = createUuid();

    const eventKey = [sessionId, 'answer', questionId, interactionId].join(':');

    const payload = {
        questionNumber,

        questionId,

        question,

        answerType,

        previousAnswerId: previous?.answerId ?? null,

        previousAnswer: previous?.answerText ?? null,

        answerId: currentAnswer.answerId,

        answer: currentAnswer.answerText,

        ...extra,
    };

    const { data, error } = await supabase.functions.invoke('birthday-event', {
        body: {
            eventKey,

            sessionId,

            projectKey: 'ju-birthday',

            type: 'answer',

            payload,
        },
    });

    if (error) {
        console.error('[Answer Change]', error);

        return {
            ok: false,
            error,
        };
    }

    /*
     * Backend nhận thành công rồi
     * mới nhớ đáp án hiện tại.
     */
    answerState[questionId] = currentAnswer;

    saveAnswerState(answerState);

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
    sessionStorage.removeItem(ANSWER_STATE_KEY);
}

/*
 * =========================================================
 * PASSWORD ATTEMPT
 * =========================================================
 *
 * Mỗi lần người dùng nhập đủ 4 số
 * là một event mới.
 *
 * Ví dụ:
 *
 * 1234 → sai → gửi
 * 1111 → sai → gửi
 * 2111 → đúng → gửi
 *
 * Tất cả vẫn thuộc cùng một session.
 */

export async function sendPasswordAttempt({ value, correct }) {
    const sessionId = getBirthdaySessionId();

    /*
     * Mỗi lần thử password
     * phải có interactionId mới.
     */
    const interactionId = createUuid();

    const eventKey = [sessionId, 'password_attempt', interactionId].join(':');

    const { data, error } = await supabase.functions.invoke('birthday-event', {
        body: {
            eventKey,

            sessionId,

            projectKey: 'ju-birthday',

            type: 'password_attempt',

            payload: {
                value,
                correct,
            },
        },
    });

    if (error) {
        console.error('[Password Attempt]', error);

        return {
            ok: false,
            error,
        };
    }

    return data;
}

/*
 * =========================================================
 * TROLL ANSWER
 * =========================================================
 */

export async function sendTrollAnswer({ answer }) {
    const sessionId = getBirthdaySessionId();

    const interactionId = createUuid();

    const eventKey = [sessionId, 'troll_answered', interactionId].join(':');

    const { data, error } = await supabase.functions.invoke('birthday-event', {
        body: {
            eventKey,

            sessionId,

            projectKey: 'ju-birthday',

            type: 'troll_answered',

            payload: {
                answer,
            },
        },
    });

    if (error) {
        console.error('[Troll Answer]', error);

        return {
            ok: false,
            error,
        };
    }

    return data;
}

/*
 * =========================================================
 * GIFT SELECTED
 * =========================================================
 *
 * Gửi khi user XÁC NHẬN chọn hộp quà.
 */

export async function sendGiftSelected({ giftId, giftNumber, giftHint = '' }) {
    const sessionId = getBirthdaySessionId();

    const interactionId = createUuid();

    const eventKey = [sessionId, 'gift_selected', interactionId].join(':');

    const { data, error } = await supabase.functions.invoke('birthday-event', {
        body: {
            eventKey,

            sessionId,

            projectKey: 'ju-birthday',

            type: 'gift_selected',

            payload: {
                giftId,
                giftNumber,
                giftHint,
            },
        },
    });

    if (error) {
        console.error('[Gift Selected]', error);

        return {
            ok: false,
            error,
        };
    }

    return data;
}

/*
 * =========================================================
 * MEMORIES REACHED
 * =========================================================
 *
 * Chỉ gửi 1 lần trong cùng session.
 *
 * F5 / remount:
 * backend sẽ coi là duplicate.
 */

export function sendMemoriesReached() {
    return sendBirthdayEvent({
        type: 'memories_reached',
        eventId: 'memories',

        payload: {
            page: 'memories',
        },
    });
}

// Người dùng bắt đầu mở trang → gửi event này lên để biết có bao nhiêu người đã vào trang.
export function sendSessionStarted() {
    return sendBirthdayEvent({
        type: 'session_started',
        eventId: 'start',
        payload: {},
    });
}
