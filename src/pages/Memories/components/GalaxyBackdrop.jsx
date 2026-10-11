import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { pseudoRandom, randomRange } from '../scene/random';

function createGalaxyGeometry({
    count,
    seedOffset,
    cameraZ,
    fov,
    aspect,
    mode,
}) {
    const positions =
        new Float32Array(
            count * 3,
        );

    for (
        let index = 0;
        index < count;
        index += 1
    ) {
        const seed =
            seedOffset +
            index * 19;

        const z = randomRange(
            seed + 1,
            -78,
            -26,
        );

        const distance =
            cameraZ - z;

        const visibleHeight =
            2 *
            Math.tan(
                THREE.MathUtils.degToRad(
                    fov,
                ) / 2,
            ) *
            distance;

        const visibleWidth =
            visibleHeight *
            aspect;

        let nx;
        let ny;

        if (
            mode === 'field'
        ) {
            nx = randomRange(
                seed + 2,
                -1.14,
                1.14,
            );

            ny = randomRange(
                seed + 3,
                -1.08,
                1.08,
            );
        } else {
            /*
             * Soft diagonal galactic band.
             * Average of random samples approximates a gentle dense core.
             */
            nx = randomRange(
                seed + 2,
                -1.18,
                1.18,
            );

            const cloudNoise =
                (
                    pseudoRandom(
                        seed + 3,
                    ) +
                    pseudoRandom(
                        seed + 4,
                    ) +
                    pseudoRandom(
                        seed + 5,
                    )
                ) /
                    3 -
                0.5;

            const width =
                mode === 'core'
                    ? 0.18
                    : 0.42;

            ny =
                nx * 0.24 +
                cloudNoise *
                    width;
        }

        positions[
            index * 3
        ] =
            nx *
            visibleWidth *
            0.5;

        positions[
            index * 3 + 1
        ] =
            ny *
            visibleHeight *
            0.5;

        positions[
            index * 3 + 2
        ] = z;
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            positions,
            3,
        ),
    );

    return geometry;
}

export default function GalaxyBackdrop() {
    const groupRef =
        useRef(null);

    const {
        camera,
        size,
    } = useThree();

    const isMobile =
        size.width <= 576;

    const aspect =
        size.width /
        Math.max(
            size.height,
            1,
        );

    const field = useMemo(
        () =>
            createGalaxyGeometry({
                count: isMobile
                    ? 850
                    : 1700,
                seedOffset: 9000,
                cameraZ: 12,
                fov: camera.fov,
                aspect,
                mode: 'field',
            }),
        [
            isMobile,
            aspect,
            camera.fov,
        ],
    );

    const band = useMemo(
        () =>
            createGalaxyGeometry({
                count: isMobile
                    ? 1200
                    : 2900,
                seedOffset: 170,
                cameraZ: 12,
                fov: camera.fov,
                aspect,
                mode: 'band',
            }),
        [
            isMobile,
            aspect,
            camera.fov,
        ],
    );

    const core = useMemo(
        () =>
            createGalaxyGeometry({
                count: isMobile
                    ? 500
                    : 1150,
                seedOffset: 4200,
                cameraZ: 12,
                fov: camera.fov,
                aspect,
                mode: 'core',
            }),
        [
            isMobile,
            aspect,
            camera.fov,
        ],
    );

    useEffect(() => {
        return () => {
            field.dispose();
            band.dispose();
            core.dispose();
        };
    }, [field, band, core]);

    useFrame(({ clock }) => {
        const group =
            groupRef.current;

        if (!group) {
            return;
        }

        group.rotation.z =
            -0.08 +
            Math.sin(
                clock.elapsedTime *
                    0.012,
            ) *
                0.004;
    });

    return (
        <group ref={groupRef}>
            <points geometry={field}>
                <pointsMaterial
                    color="#ffffff"
                    size={0.9}
                    sizeAttenuation={false}
                    transparent
                    opacity={0.32}
                    depthWrite={false}
                />
            </points>

            <points geometry={band}>
                <pointsMaterial
                    color="#f9f7ff"
                    size={1}
                    sizeAttenuation={false}
                    transparent
                    opacity={0.42}
                    depthWrite={false}
                />
            </points>

            <points geometry={core}>
                <pointsMaterial
                    color="#ffffff"
                    size={1.25}
                    sizeAttenuation={false}
                    transparent
                    opacity={0.62}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}
