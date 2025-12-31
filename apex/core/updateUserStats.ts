import { UserStats } from "../types/performance";

export const updateUserStats = (
  current: UserStats,
  newScore: number
): UserStats => {
  const ridesCompleted = current.ridesCompleted + 1;
  const totalPoints = current.totalPoints + newScore;
  const averageScore = Math.round(totalPoints / ridesCompleted);
  return {
    userId: current.userId,
    ridesCompleted,
    totalPoints,
    averageScore,
  };
};
