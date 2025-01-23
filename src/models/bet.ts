export type TBetResults = {
  birthDate: Date;
  firstName: string;
  gender: 'male' | 'female';
  size: number;
  weight: number;
} | null;

export type TUserStatus = 'pending' | 'accepted' | 'rejected';

export type TGender = 'male' | 'female' | 'unknown';

export type TBetConfig = {
  firstParentFirstName: string;
  gender: TGender;
  secondParentFirstName: string;
  scheduledDate: Date;
};

export type TParticipantBet = {
  birthDate: Date;
  size: number;
  weight: number;
} & (
  | { firstName: string }
  | { boyFirstName: string; gender: 'male' | 'female'; girlFirstName: string }
);

export type TBetParticipant = {
  bet?: TParticipantBet;
  email: string;
  isAdmin: boolean;
  pseudo?: string;
  status: TUserStatus;
};

type TBet = {
  id: string;
  config: TBetConfig;
  participants?: TBetParticipant[];
  results: TBetResults;
};

export default TBet;
