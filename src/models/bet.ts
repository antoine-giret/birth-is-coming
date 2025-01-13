export type TBetResults = {
  birthDate: Date;
  firstName: string;
  gender: 'male' | 'female';
  size: number;
  weight: number;
} | null;

export type TGender = 'male' | 'female' | 'unknown';

type TBet = {
  id: string;
  config: {
    firstParentFirstName: string;
    gender: TGender;
    secondParentFirstName: string;
    scheduledDate: Date;
  };
  results: TBetResults;
};

export default TBet;
