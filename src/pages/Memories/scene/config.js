export const CUBE_COUNT = 44;
export const MOBILE_CUBE_COUNT = 22;

export const CUBE_FAR_Z = -58;
export const CUBE_NEAR_Z = 8.8;

export const WISH_FAR_Z = -55;
export const WISH_NEAR_Z = 7.2;

/*
 * Global speeds keep the streams continuous.
 * Objects are phase-spaced, so there is no empty "next turn" gap.
 */

export const CUBE_STREAM_SPEED = 0.9;
export const WISH_STREAM_SPEED = 0.75;

export const BURST_DURATION_MS = 1850;

/*
 * Slower in deep space, faster close to camera.
 * This leaves detail in the background but prevents giant foreground
 * cubes from blocking the screen for too long.
 */

export function depthCurve(progress) {
    return (
        0.72 * progress +
        0.28 *
            progress *
            progress *
            progress
    );
}

export const MOBILE_WISH_COUNT = 18;
