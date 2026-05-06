/**
 * Applies a function to each element of an array and returns the results in a new array.
 * @param {function} func - function to apply
 * @param {Array} arg1 - array to map over
 * @param {Array} arg2 - array to map over
 * @returns {Array} - mapped array
 */
const zipWith = function (func, arg1, arg2) {
    const arg2Length = arg2.length;
    return (arg1.length <= arg2Length ? arg1 : arg1.slice(0, arg2Length))
        .map((x, i) => func(x, arg2[i]));
};

/**
 * Computes the euclidean distance between two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - euclidean distance
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_distance}
 */
export const euclideanDistance = function (vectorA, vectorB) {
    return Math.hypot(...zipWith((a, b) => a - b, vectorA, vectorB));
};

/**
 * Computes the dot product of two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - dot product
 */
export const dotProduct = function (vectorA, vectorB) {
    return zipWith((a, b) => a * b, vectorA, vectorB).reduce((a, b) => a + b, 0);
};

/**
 * Computes the cosine distance between two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - cosine distance
 * @see {@link https://en.wikipedia.org/wiki/Cosine_similarity}
 */
export const cosineDistance = function (vectorA, vectorB) {
    const dotProd = dotProduct(vectorA, vectorB);
    const normA = Math.hypot(...vectorA);
    const normB = Math.hypot(...vectorB);
    return (1 - (dotProd / (normA * normB)));
};

/**
 * Computes the manhattan distance between two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - manhattan distance
 * @see {@link https://en.wikipedia.org/wiki/Taxicab_geometry}
 */
export const manhattanDistance = function (vectorA, vectorB) {
    return zipWith((a, b) => Math.abs(a - b), vectorA, vectorB).reduce((a, b) => a + b, 0);
};

/**
 * Computes the Chebyshev distance between two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - Chebyshev distance
 * @see {@link https://en.wikipedia.org/wiki/Chebyshev_distance}
 */
export const chebyshevDistance = function (vectorA, vectorB) {
    let max = 0;
    for (let i = 0; i < vectorA.length; i++) {
        const diff = Math.abs(vectorA[i] - vectorB[i]);
        if (diff > max) max = diff;
    }
    return max;
};

/**
 * Computes the Hamming distance between two vectors.
 * @param {number[]} vectorA - vector A
 * @param {number[]} vectorB - vector B
 * @returns {number} - Hamming distance
 * @see {@link https://api.python.langchain.com/en/stable/_modules/langchain/evaluation/embedding_distance/base.html#EmbeddingDistance}
 */
export const hammingDistance = function (vectorA, vectorB) {
    let count = 0;
    for (let i = 0; i < vectorA.length; i++) {
        if (vectorA[i] !== vectorB[i]) count++;
    }
    return count / vectorA.length;
};
