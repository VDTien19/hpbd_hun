import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { pseudoRandom } from '../scene/random';

function createCakeTier({
    radius,
    height,
    centerY,
    count,
    seedOffset,
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
            index + seedOffset;

        const mode =
            pseudoRandom(
                seed + 1,
            );

        let x;
        let y;
        let z;

        if (mode < 0.72) {
            const angle =
                pseudoRandom(
                    seed + 2,
                ) *
                Math.PI *
                2;

            const localRadius =
                radius *
                (0.92 +
                    pseudoRandom(
                        seed + 3,
                    ) *
                        0.08);

            x =
                Math.cos(angle) *
                localRadius;

            z =
                Math.sin(angle) *
                localRadius;

            y =
                centerY -
                height / 2 +
                pseudoRandom(
                    seed + 4,
                ) *
                    height;
        } else {
            const angle =
                pseudoRandom(
                    seed + 5,
                ) *
                Math.PI *
                2;

            const localRadius =
                Math.sqrt(
                    pseudoRandom(
                        seed + 6,
                    ),
                ) * radius;

            x =
                Math.cos(angle) *
                localRadius;

            z =
                Math.sin(angle) *
                localRadius;

            y =
                centerY +
                height / 2;
        }

        positions[
            index * 3
        ] = x;

        positions[
            index * 3 + 1
        ] = y;

        positions[
            index * 3 + 2
        ] = z;
    }

    return positions;
}

function createIcingGeometry({
    radius,
    y,
    waves,
}) {
    const points = [];

    for (
        let index = 0;
        index <= 220;
        index += 1
    ) {
        const angle =
            (index / 220) *
            Math.PI *
            2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) *
                    radius,
                y +
                    Math.sin(
                        angle *
                            waves,
                    ) *
                        0.08,
                Math.sin(angle) *
                    radius,
            ),
        );
    }

    return new THREE.BufferGeometry().setFromPoints(
        points,
    );
}

function IcingLoop({
    radius,
    y,
    waves,
    color,
}) {
    const geometry = useMemo(
        () =>
            createIcingGeometry({
                radius,
                y,
                waves,
            }),
        [radius, y, waves],
    );

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    return (
        <line geometry={geometry}>
            <lineBasicMaterial
                color={color}
                transparent
                opacity={0.65}
            />
        </line>
    );
}

function Candle() {
    const flameRef =
        useRef(null);

    useFrame(({ clock }) => {
        const flame =
            flameRef.current;

        if (!flame) {
            return;
        }

        const time =
            clock.elapsedTime;

        flame.scale.x =
            1 +
            Math.sin(time * 7) *
                0.08;

        flame.scale.y =
            1 +
            Math.sin(
                time * 8.2,
            ) *
                0.1;

        flame.rotation.z =
            Math.sin(time * 5) *
            0.06;
    });

    return (
        <>
            <mesh
                position={[
                    0,
                    1.42,
                    0,
                ]}
            >
                <cylinderGeometry
                    args={[
                        0.03,
                        0.03,
                        0.85,
                        10,
                    ]}
                />

                <meshBasicMaterial
                    color="#dcecff"
                />
            </mesh>

            <mesh
                ref={flameRef}
                position={[
                    0,
                    1.93,
                    0,
                ]}
            >
                <coneGeometry
                    args={[
                        0.045,
                        0.15,
                        12,
                    ]}
                />

                <meshBasicMaterial
                    color="#ffd57f"
                    toneMapped={false}
                />
            </mesh>
        </>
    );
}

export default function ParticleCake({
    isMobile,
}) {
    const groupRef =
        useRef(null);

    const bottomPoints =
        useMemo(
            () =>
                createCakeTier({
                    radius: 1.85,
                    height: 1,
                    centerY: -0.68,
                    count: isMobile
                        ? 850
                        : 2100,
                    seedOffset: 17,
                }),
            [isMobile],
        );

    const topPoints =
        useMemo(
            () =>
                createCakeTier({
                    radius: 1.25,
                    height: 0.88,
                    centerY: 0.38,
                    count: isMobile
                        ? 600
                        : 1450,
                    seedOffset: 827,
                }),
            [isMobile],
        );

    useFrame(({ clock }) => {
        const group =
            groupRef.current;

        if (!group) {
            return;
        }

        group.rotation.y =
            Math.sin(
                clock.elapsedTime *
                    0.1,
            ) *
            0.02;
    });

    return (
        <group
            ref={groupRef}
            position={[
                0,
                -0.6,
                -2.5,
            ]}
            scale={
                isMobile
                    ? 0.7
                    : 0.86
            }
        >
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[
                            bottomPoints,
                            3,
                        ]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#ff78c3"
                    size={0.027}
                    transparent
                    opacity={0.76}
                    sizeAttenuation
                    depthWrite={false}
                />
            </points>

            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[
                            topPoints,
                            3,
                        ]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#f49bd5"
                    size={0.027}
                    transparent
                    opacity={0.78}
                    sizeAttenuation
                    depthWrite={false}
                />
            </points>

            <IcingLoop
                radius={1.87}
                y={-0.2}
                waves={8}
                color="#ff72d3"
            />

            <IcingLoop
                radius={1.27}
                y={0.8}
                waves={7}
                color="#f496e8"
            />

            <Candle />

            <Sparkles
                count={
                    isMobile
                        ? 12
                        : 28
                }
                scale={[
                    4.4,
                    3.5,
                    3.6,
                ]}
                size={0.85}
                speed={0.09}
                opacity={0.15}
                color="#ffb4dc"
            />
        </group>
    );
}

