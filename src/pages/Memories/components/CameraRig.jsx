import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function CameraRig() {
    const {
        camera,
        pointer,
        size,
    } = useThree();

    const isMobile =
        size.width <= 576;

    useFrame(({ clock }) => {
        const time =
            clock.elapsedTime;

        const targetX = isMobile
            ? Math.sin(
                  time * 0.09,
              ) * 0.14
            : pointer.x * 0.4;

        const targetY = isMobile
            ? Math.cos(
                  time * 0.075,
              ) * 0.09
            : pointer.y * 0.22;

        camera.position.x =
            THREE.MathUtils.lerp(
                camera.position.x,
                targetX,
                0.022,
            );

        camera.position.y =
            THREE.MathUtils.lerp(
                camera.position.y,
                targetY,
                0.022,
            );

        camera.position.z =
            THREE.MathUtils.lerp(
                camera.position.z,
                isMobile
                    ? 13
                    : 12,
                0.03,
            );

        camera.lookAt(
            0,
            -0.15,
            -4,
        );
    });

    return null;
}
