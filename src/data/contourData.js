function goldsteinPrice(x, y) {
    return (
        (1 +
            Math.pow(x + y + 1, 2) *
                (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * x + 3 * y * y)) *
        (30 +
            Math.pow(2 * x - 3 * y, 2) *
                (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y))
    );
}
export default function(n = 240, m = 125) {
    let values = new Array(n * m);
    for (var j = 0.5, k = 0; j < m; ++j) {
        for (var i = 0.5; i < n; ++i, ++k) {
            values[k] = goldsteinPrice(i / n * 4 - 2, 1 - j / m * 3);
        }
    }
    return values;
}
