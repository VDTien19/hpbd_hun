export function pseudoRandom(seed) {
    const value =
        Math.sin(seed * 91.3458) *
        47453.5453;

    return value - Math.floor(value);
}

export function randomRange(
    seed,
    min,
    max,
) {
    return (
        min +
        pseudoRandom(seed) *
            (max - min)
    );
}

export function randomSignedRange(
    seed,
    min,
    max,
) {
    const amount =
        randomRange(
            seed,
            min,
            max,
        );

    return (
        amount *
        (pseudoRandom(seed + 999) > 0.5
            ? 1
            : -1)
    );
}

export function positiveModulo(
    value,
    divisor,
) {
    return (
        ((value % divisor) +
            divisor) %
        divisor
    );
}
