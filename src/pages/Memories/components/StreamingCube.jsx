import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import { CUBE_COUNT, MOBILE_CUBE_COUNT, CUBE_FAR_Z, CUBE_NEAR_Z, CUBE_STREAM_SPEED, depthCurve } from '../scene/config';
import { positiveModulo } from '../scene/random';
import { getDistributedScreenPosition, setPositionOnScreenRay } from '../scene/screen';
import { getPhotoMaterial } from '../scene/textures';
import { SHARED_BOX_GEOMETRY } from '../scene/geometry';

export default function StreamingCube({ cube, isMobile, isSelected, interactionLocked, onExplode }) {
    const groupRef = useRef(null);

    const routeRef = useRef({
        cycle: Number.NaN,
        x: 0,
        y: 0,
    });

    const wasSelectedRef = useRef(false);

    const resumePendingRef = useRef(false);

    const [hovered, setHovered] = useState(false);

    const { camera, clock } = useThree();

    const materials = useMemo(() => cube.photos.map((url, index) => getPhotoMaterial(url, index)), [cube.photos]);

    useCursor(hovered && !interactionLocked);

    const totalVisible = isMobile ? MOBILE_CUBE_COUNT : CUBE_COUNT;

    const getStreamState = (time) => {
        const span = CUBE_NEAR_Z - CUBE_FAR_Z;

        const rawTravel = time * CUBE_STREAM_SPEED + cube.phase * span;

        const cycle = Math.floor(rawTravel / span);

        const linearProgress = positiveModulo(rawTravel, span) / span;

        const progress = depthCurve(linearProgress);

        return {
            cycle,
            linearProgress,
            progress,
            z: CUBE_FAR_Z + progress * span,
        };
    };

    const updateRoute = (cycle) => {
        if (routeRef.current.cycle === cycle) {
            return;
        }

        const route = getDistributedScreenPosition({
            index: cube.streamIndex,
            total: totalVisible,
            cycle,
            seed: cube.seed,
            isMobile,
        });

        routeRef.current = {
            cycle,
            ...route,
        };
    };

    const placeAtCurrentTime = (time) => {
        const group = groupRef.current;

        if (!group) {
            return;
        }

        const stream = getStreamState(time);

        updateRoute(stream.cycle);

        const driftStrength = 0.25 + stream.progress * 0.75;

        const screenX =
            routeRef.current.x + Math.sin(time * cube.wobbleSpeed + cube.id) * cube.routeDrift[0] * driftStrength;

        const screenY =
            routeRef.current.y +
            Math.cos(time * cube.wobbleSpeed * 0.79 + cube.id * 0.7) * cube.routeDrift[1] * driftStrength;

        setPositionOnScreenRay({
            object: group,
            camera,
            z: stream.z,
            screenX,
            screenY,
        });

        const depthScale = THREE.MathUtils.lerp(0.45, 1.17, stream.progress);

        const hoverScale = hovered && !interactionLocked ? 1.055 : 1;

        const targetScale = depthScale * hoverScale;

        group.scale.setScalar(targetScale);

        return stream;
    };

    useLayoutEffect(() => {
        const group = groupRef.current;

        if (!group) {
            return;
        }

        group.rotation.set(...cube.rotation);

        placeAtCurrentTime(clock.elapsedTime);

        group.visible = true;
    }, [cube, isMobile, camera]);

    /*
     * No flash after burst:
     * keep the original hidden until useFrame has repositioned it
     * to its CURRENT stream position, then show it in the same render frame.
     */
    useLayoutEffect(() => {
        const group = groupRef.current;

        if (!group) {
            return;
        }

        if (isSelected) {
            wasSelectedRef.current = true;
            resumePendingRef.current = false;
            group.visible = false;
            return;
        }

        if (wasSelectedRef.current) {
            wasSelectedRef.current = false;
            resumePendingRef.current = true;
            group.visible = false;
        }
    }, [isSelected]);

    useFrame(({ clock: frameClock }, delta) => {
        const group = groupRef.current;

        if (!group || isSelected) {
            return;
        }

        const time = frameClock.elapsedTime;

        const stream = placeAtCurrentTime(time);

        if (!stream) {
            return;
        }

        if (resumePendingRef.current) {
            resumePendingRef.current = false;
            group.visible = true;
        }

        const hoverSlowdown = hovered && !interactionLocked ? 0.16 : 1;

        const wobbleTime = time * cube.wobbleSpeed + cube.id * 0.73;

        const rotationX = cube.spin[0] + Math.sin(wobbleTime) * cube.wobble[0];

        const rotationY = cube.spin[1] + Math.cos(wobbleTime * 0.83) * cube.wobble[1];

        const rotationZ = cube.spin[2] + Math.sin(wobbleTime * 0.61) * cube.wobble[2];

        group.rotation.x += rotationX * delta * hoverSlowdown;

        group.rotation.y += rotationY * delta * hoverSlowdown;

        group.rotation.z += rotationZ * delta * hoverSlowdown;
    });

    return (
        <group
            ref={groupRef}
            onPointerEnter={(event) => {
                event.stopPropagation();

                if (interactionLocked) {
                    return;
                }

                setHovered(true);
            }}
            onPointerLeave={() => {
                setHovered(false);
            }}
            onClick={(event) => {
                event.stopPropagation();

                if (interactionLocked) {
                    return;
                }

                const group = groupRef.current;

                if (!group) {
                    return;
                }

                onExplode({
                    ...cube,
                    currentPosition: [group.position.x, group.position.y, group.position.z],
                    currentRotation: [group.rotation.x, group.rotation.y, group.rotation.z],
                    currentScale: group.scale.x,
                });
            }}
        >
            <mesh geometry={SHARED_BOX_GEOMETRY} material={materials} scale={cube.size} dispose={null} />
        </group>
    );
}
