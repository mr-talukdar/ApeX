import { RideRating } from "../types/performance";

/**
 * Core calculator for computing a rider's overall performance score from a ride.
 *
 * I might forget this, so just keeping it documented
 *
 * This function is the central scoring mechanism of the application. It takes a RideRating
 * object containing individual category ratings (SKILL, DISCIPLINE, TEAMWORK, SAFETY, LEADERSHIP)
 * and computes the average score across all performance categories.
 *
 * The score represents a rider's overall performance on a specific ride, calculated as the
 * arithmetic mean of all category ratings. This average score is used throughout the application
 * for ranking, statistics, and determining rider reputation.
 *
 * @param rating - A RideRating object containing:
 *   - riderId: The ID of the rider being rated
 *   - rideId: The ID of the ride being rated
 *   - ratings: A Record mapping each PerformanceCategory to a numeric rating value
 *
 * @returns The average score as a number, calculated by summing all category ratings
 *          and dividing by the number of categories. Returns 0 if no ratings are present.
 *
 * @example
 * // Given a rating with scores: SKILL=8, DISCIPLINE=7, TEAMWORK=9, SAFETY=8, LEADERSHIP=6
 * // Returns: (8 + 7 + 9 + 8 + 6) / 5 = 7.6
 */
export const calculateRideScore = (rating: RideRating): number => {
  // Extract all numeric rating values from the ratings object
  // This gives us an array of scores for each performance category
  const values = Object.values(rating.ratings);

  // Sum all the rating values together
  // The reduce function accumulates the total: starts at 0, adds each value
  const total = values.reduce((a, b) => a + b, 0);

  // Calculate and return the average by dividing the total by the number of categories
  // This gives us the mean performance score across all rated categories
  return total / values.length;
};
