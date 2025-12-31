import { Decision } from "../types/decision";
import { RideRating } from "../types/performance";
import { PerformanceCategory } from "../types/performance";

/**
 * Validates a RideRating to ensure it meets all required criteria before processing.
 *
 * This function is a critical validation step that ensures data integrity for ride ratings.
 * It checks that all performance categories (SKILL, DISCIPLINE, TEAMWORK, SAFETY, LEADERSHIP)
 * have valid numeric ratings within the acceptable range (0-10).
 *
 * Validation rules:
 * - All performance categories must have a rating value
 * - Each rating must be a number (not null, undefined, or other types)
 * - Each rating must be between 0 and 10 (inclusive)
 *
 * This validation should be called before calculating ride scores or storing ratings
 * to prevent invalid data from entering the system.
 *
 * @param rating - A RideRating object containing:
 *   - riderId: The ID of the rider being rated
 *   - rideId: The ID of the ride being rated
 *   - ratings: A Record mapping each PerformanceCategory to a numeric rating value
 *
 * @returns A Decision object:
 *   - { allowed: true } if all validations pass
 *   - { allowed: false, reason: string } if validation fails, with a specific error message
 *     indicating which category failed and why (missing value or out of range)
 *
 * @example
 * // Valid rating - returns { allowed: true }
 * validateRideRating({
 *   riderId: "123",
 *   rideId: "456",
 *   ratings: { SKILL: 8, DISCIPLINE: 7, TEAMWORK: 9, SAFETY: 8, LEADERSHIP: 6 }
 * });
 *
 * // Invalid rating - returns { allowed: false, reason: "SKILL must be between 0 and 10" }
 * validateRideRating({
 *   riderId: "123",
 *   rideId: "456",
 *   ratings: { SKILL: 15, DISCIPLINE: 7, TEAMWORK: 9, SAFETY: 8, LEADERSHIP: 6 }
 * });
 */
export function validateRideRating(rating: RideRating): Decision {
  // Iterate through all performance categories to validate each rating
  // This ensures every category (SKILL, DISCIPLINE, TEAMWORK, SAFETY, LEADERSHIP) is checked
  for (const category of Object.values(PerformanceCategory)) {
    // Retrieve the rating value for the current category
    const value = rating.ratings[category];

    // Check if the rating exists and is a number
    // If the value is missing, undefined, null, or not a number, validation fails
    if (typeof value !== "number") {
      return { allowed: false, reason: `Missing rating for ${category}` };
    }

    // Validate that the rating is within the acceptable range (0-10 inclusive)
    // Ratings outside this range are invalid and will cause validation to fail
    if (value < 0 || value > 10) {
      return { allowed: false, reason: `${category} must be between 0 and 10` };
    }
  }

  // If we've checked all categories and none failed validation, the rating is valid
  return { allowed: true };
}
