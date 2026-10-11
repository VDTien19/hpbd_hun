import * as THREE from 'three';
import { FALLBACK_IMAGE, memorySources } from './assets';

const textureCache = new Map();
const materialCache = new Map();

const placeholderColors = [
    '#211720',
    '#171723',
    '#201925',
    '#171c27',
    '#251922',
];

function createPlaceholderCanvas(index) {
    if (
        typeof document ===
        'undefined'
    ) {
        return null;
    }

    const canvas =
        document.createElement(
            'canvas',
        );

    canvas.width = 16;
    canvas.height = 16;

    const context =
        canvas.getContext('2d');

    context.fillStyle =
        placeholderColors[
            index %
                placeholderColors.length
        ];

    context.fillRect(
        0,
        0,
        16,
        16,
    );

    return canvas;
}

function drawSquareImage(image) {
    const SIZE = 512;

    const canvas =
        document.createElement(
            'canvas',
        );

    canvas.width = SIZE;
    canvas.height = SIZE;

    const context =
        canvas.getContext(
            '2d',
            {
                alpha: false,
            },
        );

    const aspect =
        image.width /
        image.height;

    let sx = 0;
    let sy = 0;
    let sw = image.width;
    let sh = image.height;

    if (aspect > 1) {
        sw = image.height;
        sx =
            (image.width - sw) /
            2;
    } else {
        sh = image.width;
        sy =
            (image.height - sh) /
            2;
    }

    context.drawImage(
        image,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        SIZE,
        SIZE,
    );

    return canvas;
}

function createProgressiveTexture(
    url,
    index = 0,
) {
    const placeholder =
        createPlaceholderCanvas(
            index,
        );

    const texture = placeholder
        ? new THREE.CanvasTexture(
              placeholder,
          )
        : new THREE.Texture();

    texture.colorSpace =
        THREE.SRGBColorSpace;

    texture.minFilter =
        THREE.LinearMipmapLinearFilter;

    texture.magFilter =
        THREE.LinearFilter;

    texture.generateMipmaps = true;
    texture.anisotropy = 2;

    if (
        typeof Image !==
        'undefined'
    ) {
        const image = new Image();

        image.decoding = 'async';

        if (
            'fetchPriority' in image
        ) {
            image.fetchPriority =
                index < 10
                    ? 'high'
                    : 'auto';
        }

        image.onload = () => {
            const canvas =
                drawSquareImage(
                    image,
                );

            texture.image = canvas;
            texture.needsUpdate = true;
        };

        image.onerror = () => {
            console.warn(
                '[Memories] Cannot load photo:',
                url,
            );
        };

        image.src = url;
    }

    return texture;
}

export function getPhotoTexture(
    url,
    index = 0,
) {
    if (
        textureCache.has(url)
    ) {
        return textureCache.get(
            url,
        );
    }

    const texture =
        createProgressiveTexture(
            url,
            index,
        );

    textureCache.set(
        url,
        texture,
    );

    return texture;
}

export function getPhotoMaterial(
    url,
    index = 0,
) {
    if (
        materialCache.has(url)
    ) {
        return materialCache.get(
            url,
        );
    }

    const material =
        new THREE.MeshBasicMaterial({
            map: getPhotoTexture(
                url,
                index,
            ),
            toneMapped: false,
            side:
                THREE.FrontSide,
        });

    materialCache.set(
        url,
        material,
    );

    return material;
}

/*
 * Request unique photos immediately.
 */

[
    ...new Set(
        memorySources.length
            ? memorySources
            : [FALLBACK_IMAGE],
    ),
].forEach((url, index) => {
    getPhotoMaterial(
        url,
        index,
    );
});
