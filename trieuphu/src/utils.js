import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount) => {
  if (correctCount <= 0) {
    return 0;
  }

  const highestMilestone = MILESTONES
    .filter((milestone) => milestone <= correctCount)
    .pop();

  return highestMilestone ? PRIZES[highestMilestone - 1] : 0;
};
