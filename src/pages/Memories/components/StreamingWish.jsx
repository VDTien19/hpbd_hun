import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { WISH_FAR_Z, WISH_NEAR_Z, WISH_STREAM_SPEED, depthCurve } from '../scene/config';
import { positiveModulo } from '../scene/random';
import { getDistributedScreenPosition, setPositionOnScreenRay } from '../scene/screen';
import styles from './StreamingWish.module.scss';

export default function StreamingWish({
    wish,
    isMobile,
    totalVisible,
}) {
    const groupRef =
        useRef(null);

    const textRef =
        useRef(null);

    const routeRef = useRef({
        cycle: Number.NaN,
        x: 0,
        y: 0,
    });

    const {
        camera,
        clock,
    } = useThree();

    const getStreamState = (
        time,
    ) => {
        const span =
            WISH_NEAR_Z -
            WISH_FAR_Z;

        const rawTravel =
            time *
                WISH_STREAM_SPEED +
            wish.phase * span;

        const cycle = Math.floor(
            rawTravel / span,
        );

        const linearProgress =
            positiveModulo(
                rawTravel,
                span,
            ) / span;

        const progress =
            depthCurve(
                linearProgress,
            );

        return {
            cycle,
            progress,
            z:
                WISH_FAR_Z +
                progress * span,
        };
    };

    const updateRoute = (cycle) => {
        if (
            routeRef.current
                .cycle === cycle
        ) {
            return;
        }

        const route =
            getDistributedScreenPosition({
                index:
                    wish.streamIndex,
                total:
                    totalVisible,
                cycle:
                    cycle + 5,
                seed:
                    wish.seed +
                    7000,
                isMobile,
            });

        /*
         * Text stays slightly further from extreme edges than cubes.
         */
        routeRef.current = {
            cycle,
            x: THREE.MathUtils.clamp(
                route.x,
                -0.9,
                0.9,
            ),
            y: THREE.MathUtils.clamp(
                route.y,
                -0.86,
                0.86,
            ),
        };
    };

    const placeAtCurrentTime = (
        time,
    ) => {
        const group =
            groupRef.current;

        if (!group) {
            return;
        }

        const stream =
            getStreamState(time);

        updateRoute(
            stream.cycle,
        );

        const drift =
            0.006 +
            stream.progress *
                0.012;

        const screenX =
            routeRef.current.x +
            Math.sin(
                time * 0.11 +
                    wish.seed,
            ) *
                drift;

        const screenY =
            routeRef.current.y +
            Math.cos(
                time * 0.09 +
                    wish.seed,
            ) *
                drift;

        setPositionOnScreenRay({
            object: group,
            camera,
            z: stream.z,
            screenX,
            screenY,
        });

        const scale =
            THREE.MathUtils.lerp(
                0.34,
                1.08,
                stream.progress,
            );

        group.scale.setScalar(
            scale,
        );

        if (textRef.current) {
            /*
             * Deep text is faint; foreground text is readable.
             * Fade a little at the very end so giant text exits softly.
             */
            const enterOpacity =
                THREE.MathUtils.smoothstep(
                    stream.progress,
                    0.03,
                    0.18,
                );

            const exitOpacity =
                1 -
                THREE.MathUtils.smoothstep(
                    stream.progress,
                    0.91,
                    1,
                ) *
                    0.48;

            textRef.current.style.opacity =
                String(
                    Math.min(
                        0.92,
                        enterOpacity *
                            exitOpacity *
                            wish.opacitySeed,
                    ),
                );
        }
    };

    useLayoutEffect(() => {
        placeAtCurrentTime(
            clock.elapsedTime,
        );
    }, [
        wish,
        isMobile,
        camera,
    ]);

    useFrame(({ clock: frameClock }) => {
        placeAtCurrentTime(
            frameClock.elapsedTime,
        );
    });

    return (
        <group ref={groupRef}>
            <Html
                center
                transform
                sprite
                distanceFactor={
                    wish.type ===
                    'large'
                        ? 8.1
                        : wish.type ===
                            'medium'
                          ? 9.1
                          : 9.9
                }
                style={{
                    pointerEvents:
                        'none',
                }}
            >
                <div
                    ref={textRef}
                    className={[
                        styles.wish,
                        wish.type ===
                        'large'
                            ? styles.wishLarge
                            : '',
                        wish.type ===
                        'medium'
                            ? styles.wishMedium
                            : '',
                        wish.type ===
                        'small'
                            ? styles.wishSmall
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {wish.text}
                </div>
            </Html>
        </group>
    );
}

