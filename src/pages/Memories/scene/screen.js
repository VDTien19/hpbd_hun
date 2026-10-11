import * as THREE from 'three';
import { positiveModulo, randomRange } from './random';

export function getDistributedScreenPosition({
    index,
    total,
    cycle,
    seed,
    isMobile,
}) {
    const columns = isMobile
        ? 5
        : 8;

    const rows = Math.ceil(
        total / columns,
    );

    const gridSlots =
        columns * rows;

    /*
     * Coprime-ish step so every new cycle moves an object to another zone.
     * Use the whole grid, not only `total`, so partially filled final rows
     * do not bias objects toward the left side of the viewport.
     */
    const step = isMobile
        ? 7
        : 13;

    const cycleShift = isMobile
        ? 3
        : 17;

    const slot =
        positiveModulo(
            index * step +
                cycle *
                    cycleShift,
            gridSlots,
        );

    const column =
        slot % columns;

    const row = Math.floor(
        slot / columns,
    );

    const cellWidth =
        2 / columns;

    const cellHeight =
        2 / rows;

    const cycleSeed =
        seed +
        cycle * 193;

    let x =
        -1 +
        (column + 0.5) *
            cellWidth +
        randomRange(
            cycleSeed + 1,
            -0.38,
            0.38,
        ) *
            cellWidth;

    let y =
        1 -
        (row + 0.5) *
            cellHeight +
        randomRange(
            cycleSeed + 2,
            -0.38,
            0.38,
        ) *
            cellHeight;

    /*
     * Some objects are deliberately near / slightly outside the edge.
     * That creates the cinematic cropped foreground from the reference.
     */
    if (
        (index + cycle) % 9 ===
        0
    ) {
        x *= 1.08;
    }

    if (
        (index + cycle) % 11 ===
        0
    ) {
        y *= 1.07;
    }

    return {
        x: THREE.MathUtils.clamp(
            x,
            -1.04,
            1.04,
        ),
        y: THREE.MathUtils.clamp(
            y,
            -0.97,
            0.97,
        ),
    };
}

const screenRayDirection =
    new THREE.Vector3();

export function setPositionOnScreenRay({
    object,
    camera,
    z,
    screenX,
    screenY,
}) {
    screenRayDirection
        .set(
            screenX,
            screenY,
            0.5,
        )
        .unproject(camera)
        .sub(camera.position)
        .normalize();

    const denominator =
        screenRayDirection.z;

    if (
        Math.abs(denominator) <
        0.0001
    ) {
        return;
    }

    const distance =
        (z -
            camera.position.z) /
        denominator;

    object.position
        .copy(camera.position)
        .addScaledVector(
            screenRayDirection,
            distance,
        );
}
