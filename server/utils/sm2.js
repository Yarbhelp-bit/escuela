// SM-2 Spaced Repetition Algorithm
// Rating: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
// Returns updated { easiness_factor, interval, repetitions, next_review }

export function calculateSM2(rating, currentEF, currentInterval, currentReps) {
  // Convert 1-4 scale to SM-2's 0-5 scale
  const quality = Math.min(5, Math.max(0, (rating - 1) * 1.67));

  let newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval;
  let newReps;

  if (rating === 1) {
    // Again — reset
    newReps = 0;
    newInterval = 0;
  } else {
    newReps = currentReps + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEF);
    }

    // Adjust interval based on rating
    if (rating === 2) newInterval = Math.max(1, Math.round(newInterval * 0.8));
    if (rating === 4) newInterval = Math.round(newInterval * 1.3);
  }

  // Calculate next review date
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + newInterval);

  return {
    easiness_factor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newReps,
    next_review: next.toISOString().split('T')[0],
  };
}
