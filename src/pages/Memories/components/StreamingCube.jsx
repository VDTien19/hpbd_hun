import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import * as THREE from 'three';

import { useFrame, useThree } from '@react-three/fiber';

import { useCursor } from '@react-three/drei';

import { CUBE_COUNT, MOBILE_CUBE_COUNT, CUBE_FAR_Z, CUBE_NEAR_Z, CUBE_STREAM_SPEED, depthCurve } from '../scene/config';

import { positiveModulo } from '../scene/random';

import { getDistributedScreenPosition, setPositionOnScreenRay } from '../scene/screen';

import { getPhotoMaterial } from '../scene/textures';

import { SHARED_BOX_GEOMETRY } from '../scene/geometry';

/*
 * Cube đã bị nổ thì không raycast nữa.
 */
const disabledRaycast = () => null;

export default function StreamingCube({ cube, isMobile, isSelected, onExplode }) {
    const groupRef = useRef(null);

    const routeRef = useRef({
        cycle: Number.NaN,
        x: 0,
        y: 0,
    });

    /*
     * Cycle mà cube đã bị nổ.
     */
    const explodedCycleRef = useRef(null);

    /*
     * Ref dùng để block click NGAY LẬP TỨC,
     * không cần chờ React render lại.
     */
    const consumedRef = useRef(false);

    /*
     * State dùng để JSX biết:
     *
     * - bỏ pointer handlers
     * - tắt raycast
     */
    const [consumed, setConsumed] = useState(false);

    const [hovered, setHovered] = useState(false);

    const { camera, clock } = useThree();

    const materials = useMemo(() => cube.photos.map((url, index) => getPhotoMaterial(url, index)), [cube.photos]);

    useCursor(hovered && !consumed);

    const totalVisible = isMobile ? MOBILE_CUBE_COUNT : CUBE_COUNT;

    /*
     * =====================================================
     * STREAM
     * =====================================================
     */

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

    /*
     * =====================================================
     * ROUTE
     * =====================================================
     */

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

    /*
     * =====================================================
     * POSITION
     * =====================================================
     */

    const placeAtCurrentTime = (time) => {
        const group = groupRef.current;

        if (!group) {
            return null;
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

        const hoverScale = hovered && !consumed ? 1.055 : 1;

        group.scale.setScalar(depthScale * hoverScale);

        return stream;
    };

    /*
     * =====================================================
     * INITIAL
     * =====================================================
     */

    useLayoutEffect(() => {
        const group = groupRef.current;

        if (!group) {
            return;
        }

        group.rotation.set(...cube.rotation);

        placeAtCurrentTime(clock.elapsedTime);

        group.visible = !consumedRef.current;
    }, [cube, isMobile, camera]);

    /*
     * Parent báo cube đang explode.
     *
     * Đây chỉ là lớp bảo vệ phụ.
     * Logic click phía dưới đã consume
     * cube ngay lập tức rồi.
     */
    useLayoutEffect(() => {
        if (!isSelected) {
            return;
        }

        const group = groupRef.current;

        const stream = getStreamState(clock.elapsedTime);

        explodedCycleRef.current = stream.cycle;

        consumedRef.current = true;

        setConsumed(true);

        setHovered(false);

        if (group) {
            group.visible = false;
        }
    }, [isSelected]);

    /*
     * =====================================================
     * FRAME
     * =====================================================
     */

    useFrame(({ clock: frameClock }, delta) => {
        const group = groupRef.current;

        if (!group) {
            return;
        }

        const time = frameClock.elapsedTime;

        /*
         * Dù cube đang invisible,
         * position vẫn phải tiếp tục update.
         */
        const stream = placeAtCurrentTime(time);

        if (!stream) {
            return;
        }

        /*
         * Explosion của cube này vẫn đang tồn tại.
         * Dù stream đã sang cycle mới thì vẫn chưa cho
         * cube gốc hiện/raycast trở lại cho tới khi burst kết thúc.
         */
        if (isSelected) {
            group.visible = false;
            return;
        }

        /*
         * =================================================
         * CUBE ĐÃ BỊ NỔ
         * =================================================
         */

        if (consumedRef.current) {
            /*
             * Vẫn đang cùng cycle
             * mà cube đã bị nổ.
             *
             * => không render
             * => không click
             */
            if (stream.cycle === explodedCycleRef.current) {
                group.visible = false;

                return;
            }

            /*
             * =================================================
             * SANG CYCLE MỚI
             * =================================================
             *
             * Cube được respawn ở deep space.
             */

            explodedCycleRef.current = null;

            consumedRef.current = false;

            /*
             * React render lại để:
             *
             * - raycast bật trở lại
             * - handlers bật trở lại
             */
            setConsumed(false);

            group.visible = true;
        } else {
            group.visible = true;
        }

        /*
         * =================================================
         * ROTATION
         * =================================================
         */

        const hoverSlowdown = hovered ? 0.16 : 1;

        const wobbleTime = time * cube.wobbleSpeed + cube.id * 0.73;

        const rotationX = cube.spin[0] + Math.sin(wobbleTime) * cube.wobble[0];

        const rotationY = cube.spin[1] + Math.cos(wobbleTime * 0.83) * cube.wobble[1];

        const rotationZ = cube.spin[2] + Math.sin(wobbleTime * 0.61) * cube.wobble[2];

        group.rotation.x += rotationX * delta * hoverSlowdown;

        group.rotation.y += rotationY * delta * hoverSlowdown;

        group.rotation.z += rotationZ * delta * hoverSlowdown;
    });

    /*
     * =====================================================
     * CLICK
     * =====================================================
     */

    const handleClick = (event) => {
        /*
         * RẤT QUAN TRỌNG:
         *
         * Cube đã chết thì return TRƯỚC
         * event.stopPropagation().
         *
         * Nhờ vậy click có thể đi tới
         * cube khác phía sau.
         */

        if (consumedRef.current) {
            return;
        }

        const group = groupRef.current;

        if (!group) {
            return;
        }

        event.stopPropagation();

        /*
         * Snapshot trước khi hide.
         */

        const snapshot = {
            ...cube,

            currentPosition: [group.position.x, group.position.y, group.position.z],

            currentRotation: [group.rotation.x, group.rotation.y, group.rotation.z],

            currentScale: group.scale.x,
        };

        /*
         * Consume ngay tại event hiện tại.
         *
         * Không chờ parent setState.
         */

        const stream = getStreamState(clock.elapsedTime);

        explodedCycleRef.current = stream.cycle;

        consumedRef.current = true;

        setConsumed(true);

        setHovered(false);

        group.visible = false;

        /*
         * Tạo explosion.
         */

        onExplode(snapshot);
    };

    return (
        <group
            ref={groupRef}
            /*
             * Cube consumed thì
             * không còn event handler.
             */

            onPointerEnter={
                consumed
                    ? undefined
                    : (event) => {
                          event.stopPropagation();

                          setHovered(true);
                      }
            }
            onPointerLeave={
                consumed
                    ? undefined
                    : () => {
                          setHovered(false);
                      }
            }
            onClick={consumed ? undefined : handleClick}
        >
            <mesh
                geometry={SHARED_BOX_GEOMETRY}
                material={materials}
                scale={cube.size}
                /*
                 * Đây là fix quan trọng thứ 2.
                 *
                 * visible=false thôi chưa đủ.
                 * Cube đã nổ thì raycaster
                 * cũng phải bỏ qua nó.
                 */

                raycast={consumed ? disabledRaycast : THREE.Mesh.prototype.raycast}
                dispose={null}
            />
        </group>
    );
}
