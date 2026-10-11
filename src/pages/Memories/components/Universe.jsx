import { useThree } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import { cubeStream, wishStream } from '../data/sceneData';
import { MOBILE_CUBE_COUNT, MOBILE_WISH_COUNT } from '../scene/config';
import CameraRig from './CameraRig';
import ExplodingCube from './ExplodingCube';
import GalaxyBackdrop from './GalaxyBackdrop';
import ParticleCake from './ParticleCake';
import StreamingCube from './StreamingCube';
import StreamingWish from './StreamingWish';

export default function Universe({
    explodingCube,
    onExplodeCube,
}) {
    const { size } = useThree();

    const isMobile =
        size.width <= 576;

    const interactionLocked =
        Boolean(explodingCube);

    const visibleWishCount =
        isMobile
            ? Math.min(
                  MOBILE_WISH_COUNT,
                  wishStream.length,
              )
            : wishStream.length;

    return (
        <>
            <CameraRig />

            <fog
                attach="fog"
                args={[
                    '#020208',
                    21,
                    54,
                ]}
            />

            <Stars
                radius={68}
                depth={60}
                count={
                    isMobile
                        ? 800
                        : 1850
                }
                factor={1.65}
                saturation={0}
                fade
                speed={0.08}
            />

            <GalaxyBackdrop />

            <Sparkles
                count={
                    isMobile
                        ? 20
                        : 48
                }
                scale={[
                    25,
                    17,
                    23,
                ]}
                size={0.7}
                speed={0.055}
                opacity={0.1}
                color="#ffd9e8"
            />

            <Sparkles
                count={
                    isMobile
                        ? 10
                        : 24
                }
                scale={[
                    25,
                    17,
                    23,
                ]}
                size={0.65}
                speed={0.045}
                opacity={0.08}
                color="#dce5ff"
            />

            <ParticleCake
                isMobile={isMobile}
            />

            {wishStream.map(
                (wish, index) => {
                    if (
                        index >=
                        visibleWishCount
                    ) {
                        return null;
                    }

                    return (
                        <StreamingWish
                            key={
                                wish.instanceId
                            }
                            wish={wish}
                            isMobile={
                                isMobile
                            }
                            totalVisible={
                                visibleWishCount
                            }
                        />
                    );
                },
            )}

            {cubeStream.map(
                (cube, index) => {
                    if (
                        isMobile &&
                        index >=
                            MOBILE_CUBE_COUNT
                    ) {
                        return null;
                    }

                    return (
                        <StreamingCube
                            key={cube.id}
                            cube={cube}
                            isMobile={
                                isMobile
                            }
                            isSelected={
                                explodingCube?.id ===
                                cube.id
                            }
                            interactionLocked={
                                interactionLocked
                            }
                            onExplode={
                                onExplodeCube
                            }
                        />
                    );
                },
            )}

            {explodingCube && (
                <ExplodingCube
                    cube={
                        explodingCube
                    }
                    isMobile={
                        isMobile
                    }
                />
            )}
        </>
    );
}
