import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getPhotoMaterial } from '../scene/textures';
import { SHARED_PLANE_GEOMETRY } from '../scene/geometry';

function createFaceData(size) {
    const half = size / 2;

    return [
        {
            position:
                new THREE.Vector3(
                    half,
                    0,
                    0,
                ),
            rotation:
                new THREE.Euler(
                    0,
                    Math.PI / 2,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    1,
                    0,
                    0,
                ),
            scatter:
                new THREE.Vector3(
                    0.46,
                    0.68,
                    0.22,
                ),
            angular:
                new THREE.Vector3(
                    0.52,
                    1.05,
                    -0.32,
                ),
            forwardBias: 0.75,
        },
        {
            position:
                new THREE.Vector3(
                    -half,
                    0,
                    0,
                ),
            rotation:
                new THREE.Euler(
                    0,
                    -Math.PI / 2,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    -1,
                    0,
                    0,
                ),
            scatter:
                new THREE.Vector3(
                    -0.42,
                    -0.56,
                    0.12,
                ),
            angular:
                new THREE.Vector3(
                    -0.44,
                    -0.94,
                    0.38,
                ),
            forwardBias: 0.9,
        },
        {
            position:
                new THREE.Vector3(
                    0,
                    half,
                    0,
                ),
            rotation:
                new THREE.Euler(
                    -Math.PI / 2,
                    0,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    0,
                    1,
                    0,
                ),
            scatter:
                new THREE.Vector3(
                    0.3,
                    0.48,
                    0.25,
                ),
            angular:
                new THREE.Vector3(
                    -1.05,
                    0.28,
                    0.44,
                ),
            forwardBias: 0.72,
        },
        {
            position:
                new THREE.Vector3(
                    0,
                    -half,
                    0,
                ),
            rotation:
                new THREE.Euler(
                    Math.PI / 2,
                    0,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    0,
                    -1,
                    0,
                ),
            scatter:
                new THREE.Vector3(
                    -0.28,
                    -0.5,
                    0.18,
                ),
            angular:
                new THREE.Vector3(
                    0.98,
                    -0.24,
                    -0.42,
                ),
            forwardBias: 0.84,
        },
        {
            position:
                new THREE.Vector3(
                    0,
                    0,
                    half,
                ),
            rotation:
                new THREE.Euler(
                    0,
                    0,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    0,
                    0,
                    1,
                ),
            scatter:
                new THREE.Vector3(
                    0.62,
                    -0.22,
                    0.36,
                ),
            angular:
                new THREE.Vector3(
                    0.32,
                    0.7,
                    0.58,
                ),
            forwardBias: 1.35,
        },
        {
            position:
                new THREE.Vector3(
                    0,
                    0,
                    -half,
                ),
            rotation:
                new THREE.Euler(
                    0,
                    Math.PI,
                    0,
                ),
            normal:
                new THREE.Vector3(
                    0,
                    0,
                    -1,
                ),
            scatter:
                new THREE.Vector3(
                    -0.58,
                    0.18,
                    0.08,
                ),
            angular:
                new THREE.Vector3(
                    -0.38,
                    -0.66,
                    -0.54,
                ),
            forwardBias: 0.48,
        },
    ];
}

export default function ExplodingCube({
    cube,
    isMobile,
}) {
    const groupRef =
        useRef(null);

    const faceRefs = useRef([]);
    const velocityRefs =
        useRef([]);
    const ageRef = useRef(0);

    const faceData = useMemo(
        () =>
            createFaceData(
                cube.size,
            ),
        [cube.size],
    );

    const burstMaterials = useMemo(
        () =>
            cube.photos.map(
                (url, index) => {
                    const source =
                        getPhotoMaterial(
                            url,
                            index,
                        );

                    const material =
                        source.clone();

                    material.map =
                        source.map;
                    material.side =
                        THREE.DoubleSide;
                    material.transparent =
                        true;
                    material.depthWrite =
                        false;
                    material.opacity = 1;

                    return material;
                },
            ),
        [cube.id, cube.photos],
    );

    useEffect(() => {
        return () => {
            burstMaterials.forEach(
                (material) => {
                    material.dispose();
                },
            );
        };
    }, [burstMaterials]);

    useLayoutEffect(() => {
        const group =
            groupRef.current;

        if (!group) {
            return;
        }

        group.position.set(
            ...cube.currentPosition,
        );

        group.rotation.set(
            ...cube.currentRotation,
        );

        group.scale.setScalar(
            cube.currentScale,
        );

        const explosionPower =
            isMobile
                ? 1.95
                : 2.45;

        velocityRefs.current =
            faceData.map(
                (face, index) =>
                    face.normal
                        .clone()
                        .multiplyScalar(
                            explosionPower +
                                index *
                                    0.055,
                        )
                        .add(
                            face.scatter
                                .clone()
                                .multiplyScalar(
                                    1.25,
                                ),
                        )
                        .add(
                            new THREE.Vector3(
                                0,
                                0,
                                face.forwardBias,
                            ),
                        ),
            );

        faceData.forEach(
            (face, index) => {
                const mesh =
                    faceRefs.current[
                        index
                    ];

                if (!mesh) {
                    return;
                }

                mesh.position.copy(
                    face.position,
                );

                mesh.rotation.copy(
                    face.rotation,
                );

                mesh.scale.set(
                    cube.size,
                    cube.size,
                    1,
                );
            },
        );
    }, [
        cube,
        faceData,
        isMobile,
    ]);

    const forwardSpeed = useMemo(
        () => {
            const sourceZ =
                cube.currentPosition[2];

            const requiredSpeed =
                (11.2 - sourceZ) /
                1.62;

            return THREE.MathUtils.clamp(
                requiredSpeed,
                4.6,
                20,
            );
        },
        [cube],
    );

    useFrame((_, delta) => {
        const group =
            groupRef.current;

        if (!group) {
            return;
        }

        ageRef.current += delta;

        const age =
            ageRef.current;

        group.position.z +=
            forwardSpeed * delta;

        const spinDecay =
            THREE.MathUtils.clamp(
                1 - age / 1.25,
                0.08,
                1,
            );

        group.rotation.x +=
            cube.spin[0] *
            delta *
            4.2 *
            spinDecay;

        group.rotation.y +=
            cube.spin[1] *
            delta *
            4.2 *
            spinDecay;

        group.rotation.z +=
            cube.spin[2] *
            delta *
            3.2 *
            spinDecay;

        /*
         * First ~110ms = strong snap, then drag takes over.
         */
        const snap =
            age < 0.11
                ? THREE.MathUtils.lerp(
                      2.9,
                      1.15,
                      age / 0.11,
                  )
                : 1;

        const angularSnap =
            age < 0.12
                ? 2.15
                : 1;

        faceRefs.current.forEach(
            (mesh, index) => {
                if (!mesh) {
                    return;
                }

                const velocity =
                    velocityRefs.current[
                        index
                    ];

                const face =
                    faceData[index];

                mesh.position.addScaledVector(
                    velocity,
                    delta * snap,
                );

                const drag = Math.pow(
                    0.979,
                    delta * 60,
                );

                velocity.x *= drag;
                velocity.y *= drag;
                velocity.z *= Math.pow(
                    0.988,
                    delta * 60,
                );

                mesh.rotation.x +=
                    face.angular.x *
                    delta *
                    1.5 *
                    angularSnap;

                mesh.rotation.y +=
                    face.angular.y *
                    delta *
                    1.5 *
                    angularSnap;

                mesh.rotation.z +=
                    face.angular.z *
                    delta *
                    1.5 *
                    angularSnap;

                const grow =
                    1 +
                    Math.min(
                        age * 0.085,
                        0.13,
                    );

                mesh.scale.set(
                    cube.size * grow,
                    cube.size * grow,
                    1,
                );

                const fadeStart =
                    1.4 +
                    index * 0.025;

                const opacity =
                    age < fadeStart
                        ? 1
                        : THREE.MathUtils.clamp(
                              1 -
                                  (age -
                                      fadeStart) /
                                      0.34,
                              0,
                              1,
                          );

                burstMaterials[
                    index
                ].opacity = opacity;
            },
        );
    });

    return (
        <group ref={groupRef}>
            {faceData.map(
                (_, index) => (
                    <mesh
                        key={index}
                        ref={(node) => {
                            faceRefs.current[
                                index
                            ] = node;
                        }}
                        geometry={
                            SHARED_PLANE_GEOMETRY
                        }
                        material={
                            burstMaterials[
                                index
                            ]
                        }
                        dispose={null}
                        renderOrder={
                            100 + index
                        }
                    />
                ),
            )}
        </group>
    );
}

