export function score(evidence: any): number {
  if (!evidence || !evidence.taskFacts) {
    return 0;
  }

  let totalScore = 0;
  let totalHours = 0;

  for (const task of evidence.taskFacts) {
    const hours = task.hours || 1;
    let weight = 0;

    switch (task.riskRating) {
      case 'High':
        weight = 1;
        break;
      case 'Moderate':
        weight = 0.6;
        break;
      case 'Low':
        weight = 0.3;
        break;
      default:
        weight = 0.5;
    }

    totalScore += hours * weight;
    totalHours += hours;
  }

  if (totalHours === 0) {
    return 0;
  }

  // Return as percentage (0-100)
  return Math.round((totalScore / totalHours) * 100);
} 