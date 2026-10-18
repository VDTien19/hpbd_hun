import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import {
    withSupabase,
} from 'npm:@supabase/server@^1';

const allowedEventTypes =
    new Set([
        'session_started',
        'password_attempt',
        'answer',
        'troll_answered',
        'gift_selected',
        'completed',
        'memories_reached',
    ]);

function formatTelegramMessage(
    type: string,
    payload: Record<
        string,
        unknown
    >,
) {
    switch (type) {
        case 'session_started':
            return [
                '🌷 Có người vừa mở birthday site',
                'Birthday for Ju ♡',
            ].join('\n');

        case 'answer': {
            const questionNumber =
                String(
                    payload.questionNumber ??
                        '?',
                );

            const question =
                String(
                    payload.question ??
                        '',
                );

            const answer =
                String(
                    payload.answer ??
                        '',
                );

            const previousAnswer =
                payload.previousAnswer
                    ? String(
                        payload.previousAnswer,
                    )
                    : null;

            if (previousAnswer) {
                return [
                    `💌 Câu hỏi ${questionNumber} đã đổi đáp án`,
                    '',
                    question,
                    '',
                    `${previousAnswer}`,
                    '↓',
                    `${answer}`,
                ].join('\n');
            }

            return [
                `💌 Câu hỏi ${questionNumber}`,
                '',
                question,
                '',
                `→ ${answer}`,
            ].join('\n');
        }

        case 'gift_selected': {
            const giftNumber =
                String(
                    payload.giftNumber ??
                        '?',
                );

            const giftHint =
                String(
                    payload.giftHint ??
                        'Can not get hint',
                );

            return [
                '🎁 Đã chọn hộp quà',
                '',
                `→ Hộp số ${giftNumber}`,
                '',
                `💡 Gợi ý: ${giftHint}`,
            ].join('\n');
        }

        case 'memories_reached': {
            return [
                '✨ Đã tới Memories',
                '',
                'Người dùng đã đi tới bước cuối cùng ♡',
            ].join('\n');
        }
        
        case 'password_attempt': {
            const value =
                String(
                    payload.value ?? '',
                );

            const correct =
                payload.correct === true;

            return [
                correct
                    ? '🔐 Password đúng'
                    : '🔐 Password sai',

                '',

                `Password: ${value}`,

                '',

                correct
                    ? '✅ Chính xác'
                    : '❌ Chưa đúng',
            ].join('\n');
        }

        case 'troll_answered': {
            const answer =
                payload.answer === 'yes'
                    ? 'Có ❤️'
                    : 'Không 😭';

            return [
                '😈 Câu hỏi troll',
                '',
                `→ ${answer}`,
            ].join('\n');
        }

        default:
            return '🎂 Birthday event';
    }
}

export default {
    fetch: withSupabase(
        {
            auth: 'publishable',
        },

        async (req, ctx) => {
            try {
                if (
                    req.method !== 'POST'
                ) {
                    return Response.json(
                        {
                            error:
                                'Method not allowed',
                        },
                        {
                            status: 405,
                        },
                    );
                }

                const body =
                    await req.json();

                const {
                    eventKey,
                    sessionId,
                    projectKey,
                    type,
                    payload = {},
                } = body;

                /*
                 * =========================
                 * VALIDATION
                 * =========================
                 */

                if (
                    !eventKey ||
                    !sessionId ||
                    !projectKey ||
                    !type
                ) {
                    return Response.json(
                        {
                            error:
                                'Missing required fields',
                        },
                        {
                            status: 400,
                        },
                    );
                }

                if (
                    !allowedEventTypes.has(
                        type,
                    )
                ) {
                    return Response.json(
                        {
                            error:
                                'Invalid event type',
                        },
                        {
                            status: 400,
                        },
                    );
                }

                /*
                 * =========================
                 * SAVE DATABASE
                 * =========================
                 */

                const {
                    error: insertError,
                } =
                    await ctx.supabaseAdmin
                        .from(
                            'birthday_events',
                        )
                        .insert({
                            event_key:
                                eventKey,

                            session_id:
                                sessionId,

                            project_key:
                                projectKey,

                            event_type:
                                type,

                            payload,
                        });

                /*
                 * event_key đã unique.
                 *
                 * Nếu request bị gọi lại
                 * thì không gửi Telegram
                 * thêm lần nữa.
                 */

                if (
                    insertError?.code ===
                    '23505'
                ) {
                    return Response.json({
                        ok: true,
                        duplicate: true,
                    });
                }

                if (insertError) {
                    console.error(
                        'DB insert error:',
                        insertError,
                    );

                    return Response.json(
                        {
                            error:
                                'Cannot save event',
                        },
                        {
                            status: 500,
                        },
                    );
                }

                /*
                 * =========================
                 * TELEGRAM
                 * =========================
                 */

                const botToken =
                    Deno.env.get(
                        'TELEGRAM_BOT_TOKEN',
                    );

                const chatId =
                    Deno.env.get(
                        'TELEGRAM_CHAT_ID',
                    );

                if (
                    !botToken ||
                    !chatId
                ) {
                    console.error(
                        'Telegram secrets are missing',
                    );

                    return Response.json({
                        ok: true,
                        saved: true,
                        notified: false,
                    });
                }

                const text =
                    formatTelegramMessage(
                        type,
                        payload,
                    );

                const telegramResponse =
                    await fetch(
                        `https://api.telegram.org/bot${botToken}/sendMessage`,
                        {
                            method:
                                'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',
                            },

                            body:
                                JSON.stringify({
                                    chat_id:
                                        chatId,

                                    text,
                                }),
                        },
                    );

                if (
                    !telegramResponse.ok
                ) {
                    const telegramError =
                        await telegramResponse.text();

                    console.error(
                        'Telegram error:',
                        telegramError,
                    );

                    return Response.json({
                        ok: true,
                        saved: true,
                        notified: false,
                    });
                }

                return Response.json({
                    ok: true,
                    saved: true,
                    notified: true,
                });
            } catch (error) {
                console.error(error);

                return Response.json(
                    {
                        error:
                            'Internal server error',
                    },
                    {
                        status: 500,
                    },
                );
            }
        },
    ),
};