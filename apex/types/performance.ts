export enum PerformanceCategory {
  SKILL = "SKILL",
  DISCIPLINE = "DISCIPLINE",
  TEAMWORK = "TEAMWORK",
  SAFETY = "SAFETY",
  LEADERSHIP = "LEADERSHIP",
}

export type RideRating = {
  riderId: string;
  rideId: string;
  ratings: Record<PerformanceCategory, number>;
};

export type UserStats = {
  userId: string;
  totalPoints: number;
  ridesCompleted: number;
  averageScore: number;
};
