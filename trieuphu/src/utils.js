import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (correctCount <= 0) return 0;

  // Dừng cuộc chơi: nhận tiền của câu vừa trả lời đúng gần nhất
  if (reason === "stop") {
    return PRIZES[correctCount - 1];
  }

  // Trả lời sai hoặc hết giờ: nhận tiền ở mốc an toàn gần nhất
  const highestMilestone = MILESTONES
    .filter((milestone) => milestone <= correctCount)
    .pop();

  return highestMilestone ? PRIZES[highestMilestone - 1] : 0;
};
