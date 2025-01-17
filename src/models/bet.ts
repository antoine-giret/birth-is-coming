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

export type TBetUser = { email: string; isAdmin: boolean; status: TUserStatus };

type TBet = {
  id: string;
  config: TBetConfig;
  results: TBetResults;
  users?: TBetUser[];
};

export default TBet;
