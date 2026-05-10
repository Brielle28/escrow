export type ActingRole = "client" | "freelancer";

export type ChallengeRecord = {
  address: string;
  role: ActingRole;
  nonce: string;
  message: string;
  expiresAt: number;
};

export type SessionRecord = {
  token: string;
  address: string;
  role: ActingRole;
  createdAt: number;
  expiresAt: number;
};
