import { getPhoto } from '../scene/assets';
import { CUBE_COUNT } from '../scene/config';
import { positiveModulo, randomRange, randomSignedRange } from '../scene/random';

export const cubeStream = Array.from(
    {
        length: CUBE_COUNT,
    },
    (_, index) => {
        const seed =
            index * 73 + 17;

        /*
         * Even phases + tiny jitter = permanent occupancy through Z.
         */
        const phase =
            positiveModulo(
                (index +
                    randomRange(
                        seed + 60,
                        -0.18,
                        0.18,
                    )) /
                    CUBE_COUNT,
                1,
            );

        return {
            id: index + 1,
            seed,
            streamIndex: index,
            phase,

            size: randomRange(
                seed + 3,
                0.68,
                1.32,
            ),

            rotation: [
                randomRange(
                    seed + 5,
                    -0.75,
                    0.75,
                ),
                randomRange(
                    seed + 6,
                    -0.95,
                    0.95,
                ),
                randomRange(
                    seed + 7,
                    -0.22,
                    0.22,
                ),
            ],

            /*
             * Guaranteed tumble, not near-zero random rotation.
             */
            spin: [
                randomSignedRange(
                    seed + 8,
                    0.075,
                    0.17,
                ),
                randomSignedRange(
                    seed + 9,
                    0.13,
                    0.3,
                ),
                randomSignedRange(
                    seed + 10,
                    0.025,
                    0.075,
                ),
            ],

            wobble: [
                randomRange(
                    seed + 50,
                    0.015,
                    0.045,
                ),
                randomRange(
                    seed + 51,
                    0.018,
                    0.055,
                ),
                randomRange(
                    seed + 52,
                    0.008,
                    0.025,
                ),
            ],

            wobbleSpeed:
                randomRange(
                    seed + 53,
                    0.45,
                    0.9,
                ),

            routeDrift: [
                randomRange(
                    seed + 70,
                    0.006,
                    0.025,
                ),
                randomRange(
                    seed + 71,
                    0.006,
                    0.022,
                ),
            ],

            photos: Array.from(
                { length: 6 },
                (_, photoIndex) =>
                    getPhoto(
                        index * 6 +
                            photoIndex,
                    ),
            ),
        };
    },
);

/*
 * =========================================================
 * WISH DATA
 * =========================================================
 *
 * Instances are interleaved by repeat round.
 * The same sentence therefore does not travel beside copies of itself.
 */

const wishContents = [
    {
        id: 'birthday',
        text: (
            <>Happy Birthday ♡</>
        ),
        type: 'large',
        repeat: 5,
    },
    {
        id: 'happy',
        text: (
            <>
                Tuổi mới thật
                <br />
                hạnh phúc nhé ✦
            </>
        ),
        type: 'medium',
        repeat: 4,
    },
    {
        id: 'smile',
        text: (
            <>
                Cười thật nhiều
                <br />
                nha ♡
            </>
        ),
        type: 'medium',
        repeat: 5,
    },
    {
        id: 'gentle',
        text: (
            <>
                Mong những điều dịu dàng
                <br />
                sẽ tìm đến bạn.
            </>
        ),
        type: 'small',
        repeat: 4,
    },
    {
        id: 'love',
        text: (
            <>
                Mong bạn luôn được yêu thương
                <br />
                thật nhiều ♡
            </>
        ),
        type: 'small',
        repeat: 4,
    },
    {
        id: 'pretty',
        text: (
            <>
                Một tuổi mới
                <br />
                thật xinh ✧
            </>
        ),
        type: 'small',
        repeat: 3,
    },
];

function buildWishInstances() {
    const instances = [];

    const maxRepeat = Math.max(
        ...wishContents.map(
            (wish) =>
                wish.repeat,
        ),
    );

    for (
        let repeatIndex = 0;
        repeatIndex < maxRepeat;
        repeatIndex += 1
    ) {
        wishContents.forEach(
            (wish, wishIndex) => {
                if (
                    repeatIndex >=
                    wish.repeat
                ) {
                    return;
                }

                instances.push({
                    ...wish,
                    instanceId:
                        `${wish.id}-${repeatIndex}`,
                    seed:
                        wishIndex * 117 +
                        repeatIndex * 43 +
                        19,
                });
            },
        );
    }

    return instances.map(
        (wish, index, all) => ({
            ...wish,
            streamIndex: index,
            phase:
                positiveModulo(
                    (index +
                        randomRange(
                            wish.seed +
                                90,
                            -0.12,
                            0.12,
                        )) /
                        all.length,
                    1,
                ),
            opacitySeed:
                randomRange(
                    wish.seed + 91,
                    0.88,
                    1,
                ),
        }),
    );
}

export const wishStream =
    buildWishInstances();
