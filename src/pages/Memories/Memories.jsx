import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Universe from './components/Universe';
import { BURST_DURATION_MS } from './scene/config';
import styles from './Memories.module.scss';

function Memories() {
    const [
        explodingCube,
        setExplodingCube,
    ] = useState(null);

    const [
        introReady,
        setIntroReady,
    ] = useState(false);

    const [
        hintVisible,
        setHintVisible,
    ] = useState(false);

    const explosionTimerRef =
        useRef(null);

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
            clearTimeout(
                explosionTimerRef.current,
            );
        };
    }, []);

    const handleExplodeCube = (
        cubeSnapshot,
    ) => {
        if (explodingCube) {
            return;
        }

        setHintVisible(false);
        setExplodingCube(
            cubeSnapshot,
        );

        explosionTimerRef.current =
            setTimeout(() => {
                setExplodingCube(null);
            }, BURST_DURATION_MS);
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
                    explodingCube={
                        explodingCube
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
