export function score(evidence: any): number {
  console.log('🧮 [Score] Starting score calculation with evidence:', evidence);
  
  if (!evidence || !evidence.taskFacts) {
    console.log('⚠️ [Score] No evidence or taskFacts found, returning 0');
    return 0;
  }

  console.log('📊 [Score] Found', evidence.taskFacts.length, 'task facts to analyze');

  let totalScore = 0;
  let totalHours = 0;

  for (const [index, task] of evidence.taskFacts.entries()) {
    const hours = task.hours || 1;
    
    // Check both 'riskLevel' and 'riskRating' for compatibility
    const riskValue = task.riskLevel || task.riskRating;
    let weight = 0;

    console.log(`📋 [Score] Task ${index + 1}:`, {
      task: task.task,
      riskLevel: task.riskLevel,
      riskRating: task.riskRating,
      riskValue: riskValue,
      hours: hours
    });

    switch (riskValue) {
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
        console.log(`⚠️ [Score] Unknown risk value "${riskValue}" for task "${task.task}", using default weight 0.5`);
        weight = 0.5;
    }

    console.log(`⚖️ [Score] Task "${task.task}" - Risk: ${riskValue}, Hours: ${hours}, Weight: ${weight}`);

    totalScore += hours * weight;
    totalHours += hours;
  }

  if (totalHours === 0) {
    console.log('⚠️ [Score] Total hours is 0, returning 0');
    return 0;
  }

  const finalScore = Math.round((totalScore / totalHours) * 100);
  
  console.log('📊 [Score] Final calculation:', {
    totalScore: totalScore,
    totalHours: totalHours,
    percentage: (totalScore / totalHours) * 100,
    finalScore: finalScore
  });

  // Return as percentage (0-100)
  return finalScore;
} 