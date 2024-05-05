import { useState } from "react";

export const useActivePhase = () => {
  const [activePhase, setActivePhase] = useState<IPhaseState | null>(null);
  const [phasesState, setPhasesState] = useState<IPhaseState[] | null>(null);

  const updateActivePhase = (activePhase) => {
    setActivePhase(activePhase);
  };
  const updatePhaseState = (state) => {
    setPhasesState(state);
  };
  return { updateActivePhase, updatePhaseState, phasesState, activePhase };
};
