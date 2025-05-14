/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @param {number} lat1 Latitude of the first point in degrees.
 * @param {number} lon1 Longitude of the first point in degrees.
 * @param {number} lat2 Latitude of the second point in degrees.
 * @param {number} lon2 Longitude of the second point in degrees.
 * @returns {number} The distance between the two points in meters.
 */
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
}

/**
 * Calculates a GeoGuessr-like score based on the distance between two points.
 * Applies a 5000-point threshold for distances within the 5k distance,
 * and an exponential formula for distances beyond the threshold.
 *
 * @param {number} lat1 Latitude of the actual location in degrees.
 * @param {number} lon1 Longitude of the actual location in degrees.
 * @param {number} lat2 Latitude of the guessed location in degrees.
 * @param {number} lon2 Longitude of the guessed location in degrees.
 * @returns {{distance: number, score: number}} An object containing the distance in meters and the calculated score.
 */
function calculateGeoGuessrScore(lat1, lon1, lat2, lon2) {
    // Constants for the GeoGuessr World map scoring
    const MAX_SCORE = 5000; // Maximum points per round
    const MAP_SIZE = 14916862; // Effective size of the World map in meters (diagonal distance)
    const FIVE_K_DISTANCE = 149.18; // Distance threshold in meters for automatic 5000 points

    // Calculate the distance in meters
    const distance = calculateDistanceInMeters(lat1, lon1, lat2, lon2);

    let score;

    // Apply the scoring logic
    if (distance <= FIVE_K_DISTANCE) {
        score = MAX_SCORE;
    } else {
        // Exponential scoring formula: score = 5000 * e ^ (-10 * distance / size)
        score = MAX_SCORE * Math.exp(-10 * distance / MAP_SIZE);
        // Round the score to the nearest whole number
        score = Math.round(score);
    }

    return {
        distance: distance, // Distance in meters
        score: score
    };
}

// --- Example Usage ---
// Coordinates for the actual location (e.g., Queen Elizabeth Park, Vancouver)
const actualLat = 49.241722;
const actualLon = -123.112755;

// Coordinates for a guessed location (e.g., near downtown Vancouver)
const guessedLat = 38.7946;
const guessedLon = -106.5348;

// Calculate the score
const result = calculateGeoGuessrScore(actualLat, actualLon, guessedLat, guessedLon);

console.log(`Actual Location: Lat ${actualLat}, Lon ${actualLon}`);
console.log(`Guessed Location: Lat ${guessedLat}, Lon ${guessedLon}`);
console.log(`Distance: ${result.distance.toFixed(2)} meters`);
console.log(`Calculated Score: ${result.score}`);
