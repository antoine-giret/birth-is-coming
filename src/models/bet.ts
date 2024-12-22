export type TBetResults = {
  birthDate: Date;
  firstName: string;
  gender: 'male' | 'female';
  size: number;
  weight: number;
} | null;

type TBet = {
  id: string;
  config: {
    fatherFirstName: string;
    gender: 'male' | 'female' | 'unknown';
    motherFirstName: string;
    scheduledDate: Date;
  };
  results: TBetResults;
};

export default TBet;
