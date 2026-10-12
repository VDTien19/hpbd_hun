import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Universe from './components/Universe';
import { BURST_DURATION_MS } from './scene/config';
import styles from './Memories.module.scss';

function Memories() {
    const explosionCounterRef = useRef(0);

    const explosionTimersRef = useRef(
        new Map(),
    );

    /*
     * Có thể tồn tại nhiều explosion cùng lúc.
     *
     * Mỗi phần tử là snapshot của cube tại đúng
     * thời điểm user click + burstId riêng.
     */
    const [
        explosions,
        setExplosions,
    ] = useState([]);

    const [
        introReady,
        setIntroReady,
    ] = useState(false);

    const [
        hintVisible,
        setHintVisible,
    ] = useState(false);

    useEffect(() => {
        const introTimer =
            setTimeout(() => {
                setIntroReady(true);
            }, 25);

        const hintTimer =
            setTimeout(() => {
                setHintVisible(true);
            }, 1000);

        const hideHintTimer =
            setTimeout(() => {
                setHintVisible(false);
            }, 4700);

        return () => {
            clearTimeout(
                introTimer,
            );

            clearTimeout(
                hintTimer,
            );

            clearTimeout(
                hideHintTimer,
            );

            /*
             * Mỗi explosion có timer riêng,
             * nên cleanup toàn bộ khi page unmount.
             */
            explosionTimersRef.current.forEach(
                (timer) => {
                    clearTimeout(timer);
                },
            );

            explosionTimersRef.current.clear();
        };
    }, []);

    const handleExplodeCube = (
        cubeSnapshot,
    ) => {
        setHintVisible(false);

        explosionCounterRef.current += 1;

        const burstId =
            `${cubeSnapshot.id}-${explosionCounterRef.current}`;

        const explosion = {
            ...cubeSnapshot,
            burstId,
        };

        /*
         * PUSH explosion mới vào array.
         * Không replace explosion đang chạy.
         */
        setExplosions(
            (current) => [
                ...current,
                explosion,
            ],
        );

        /*
         * Mỗi vụ nổ tự có vòng đời riêng.
         */
        const timer = setTimeout(
            () => {
                setExplosions(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.burstId !==
                                burstId,
                        ),
                );

                explosionTimersRef.current.delete(
                    burstId,
                );
            },
            BURST_DURATION_MS,
        );

        explosionTimersRef.current.set(
            burstId,
            timer,
        );
    };

    return (
        <main
            className={styles.wrapper}
        >
            <div
                className={
                    styles.backgroundGlow
                }
                aria-hidden="true"
            />

            <Canvas
                className={styles.canvas}
                dpr={[1, 1.35]}
                camera={{
                    position: [
                        0,
                        0,
                        12,
                    ],
                    fov: 50,
                    near: 0.1,
                    far: 145,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference:
                        'high-performance',
                }}
            >
                <Universe
                    explosions={
                        explosions
                    }
                    onExplodeCube={
                        handleExplodeCube
                    }
                />
            </Canvas>

            <p
                className={[
                    styles.hint,
                    hintVisible
                        ? styles.hintVisible
                        : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                Chạm vào một khối ký ức ♡
            </p>

            <div
                className={[
                    styles.introDarkness,
                    introReady
                        ? styles.introDarknessLift
                        : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
                aria-hidden="true"
            />
        </main>
    );
}

export default Memories;
