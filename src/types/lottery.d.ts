export {};
declare global {
  export interface IPhaseState {
    idx: number;
    phaseState: { isActive: boolean; isFinished: boolean; isCooldown: boolean };
    title: string;
    timestamp: number;
  }


}
