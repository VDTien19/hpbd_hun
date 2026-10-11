const imageModules = import.meta.glob(
    '/src/assets/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    {
        eager: true,
        query: '?url',
        import: 'default',
    },
);

export const memorySources = Object.entries(imageModules)
    .filter(([path]) => {
        return !/background|cover|logo|icon|gift|cake|loading|keypad|character|cry/i.test(
            path,
        );
    })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);

export const FALLBACK_IMAGE =
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
        >
            <rect
                width="512"
                height="512"
                fill="#211721"
            />

            <text
                x="256"
                y="256"
                fill="#f2dce6"
                font-family="sans-serif"
                font-size="30"
                text-anchor="middle"
                dominant-baseline="middle"
            >
                MEMORY
            </text>
        </svg>
    `)}`;

export function getPhoto(index) {
    if (!memorySources.length) {
        return FALLBACK_IMAGE;
    }

    return memorySources[
        index % memorySources.length
    ];
}
