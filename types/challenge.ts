export type ChallengeType = 
  | "workout"
  | "nutrition"
  | "combined"
  | "steps"
  | "meditation";

export type ChallengeStatus = 
  | "upcoming"
  | "active"
  | "completed"
  | "failed";

export type ChallengeProgress = {
  current: number;
  target: number;
  unit: string;
  lastUpdated: string;
};

export type ChallengeParticipant = {
  id: string;
  name: string;
  avatarUrl: string;
  progress: ChallengeProgress;
  rank?: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  imageUrl: string;
  progress: ChallengeProgress;
  participants: ChallengeParticipant[];
  rules: string[];
  rewards: {
    points: number;
    badge?: string;
  };
};