export const extrapolate = async (
  trainingDays: number[],
  weightsPerDay: number[],
  currentTrainingIndex: number
): Promise<number> => {
  const maxIndex = Math.max(...trainingDays);

  const slope = (weightsPerDay[weightsPerDay.length - 1] - weightsPerDay[weightsPerDay.length - 2]) / 
    (trainingDays[trainingDays.length - 1] - trainingDays[trainingDays.length - 2]);

  return weightsPerDay[weightsPerDay.length - 1] + slope * (currentTrainingIndex - maxIndex);
}
