import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import {
    withSupabase,
} from 'npm:@supabase/server@^1';

const allowedEventTypes =
    new Set([
        'session_started',
        'answer',
        'gift_selected',
        'completed',
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
                '',
                'Birthday for Ju ♡',
            ].join('\n');

        case 'answer': {
            const question =
                String(
                    payload.question ??
                        'Question',
                );

            const previousAnswer =
                payload.previousAnswer
                    ? String(
                        payload.previousAnswer,
                    )
                    : null;

            const answer =
                String(
                    payload.answer ??
                        '-',
                );

            /*
            * Lần đầu trả lời.
            */

            if (!previousAnswer) {
                return [
                    '💌 Có câu trả lời mới',
                    '',
                    question,
                    '',
                    `→ ${answer}`,
                ].join('\n');
            }

            /*
            * Người dùng quay lại
            * và thay đổi đáp án.
            */

            return [
                '🔄 Câu trả lời đã thay đổi',
                '',
                question,
                '',
                `${previousAnswer}`,
                '↓',
                `${answer}`,
            ].join('\n');
        }
        case 'gift_selected':
            return [
                '🎁 Có người vừa chọn quà',
                '',
                String(
                    payload.giftName ??
                        payload.giftId ??
                        'Gift',
                ),
            ].join('\n');

        case 'completed':
            return [
                '✨ Birthday completed!',
                '',
                'Đã đi tới Memories ♡',
            ].join('\n');

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