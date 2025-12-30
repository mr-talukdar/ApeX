export enum RideStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLLED",
}

export type RideState = {
  id: string;
  status: RideStatus;
  groupId: string;
  startTime: Date;
};

export enum RideParticipationStatus {
  JOINED = "JOINED",
  LEFT = "LEFT",
}
