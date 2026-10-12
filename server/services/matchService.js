/**
 * services/matchService.js
 * 
 * Purpose: Rules-based Skill Matching Engine for College Students.
 * Core Academic Requirement for SEPM / WAD:
 * 1. Analyzes User's teachable skills vs other students' wanted skills.
 * 2. Identifies TRUE 2-WAY MUTUAL MATCHES (Student A teaches what B wants, B teaches what A wants).
 * 3. Identifies 1-WAY MATCHES (Mentor/Learner opportunities).
 * 4. Computes deterministic Match Scores based on mutual synergy and proficiency levels.
 * 5. Generates human-readable, explainable match rationale.
 */

const normalize = (str) => (str || '').trim().toLowerCase();

/**
 * Computes skill exchange matches for a given student
 * @param {Object} currentUser The student requesting matches
 * @param {Array} candidateStudents All other registered students
 * @param {Object} filters Query filters (category, proficiency, keyword)
 * @returns {Array} Ranked list of matched student profiles with scores and explanations
 */
const calculateMatches = (currentUser, candidateStudents = [], filters = {}) => {
  const currentTeachable = currentUser.skillsTeachable || [];
  const currentWanted = currentUser.skillsWanted || [];

  const results = [];

  for (const candidate of candidateStudents) {
    const candidateId = candidate._id ? candidate._id.toString() : candidate.id;
    const currentId = currentUser._id ? currentUser._id.toString() : currentUser.id;

    // Skip self and deactivated accounts
    if (candidateId === currentId || candidate.isActive === false) {
      continue;
    }

    const candTeachable = candidate.skillsTeachable || [];
    const candWanted = candidate.skillsWanted || [];

    // 1. Skills candidate can teach that current user wants to learn
    const skillsTheyTeachYouWant = candTeachable.filter(cSkill =>
      currentWanted.some(uSkill => normalize(uSkill.name) === normalize(cSkill.name))
    );

    // 2. Skills current user can teach that candidate wants to learn
    const skillsYouTeachTheyWant = currentTeachable.filter(uSkill =>
      candWanted.some(cSkill => normalize(cSkill.name) === normalize(uSkill.name))
    );

    const isMutual = skillsTheyTeachYouWant.length > 0 && skillsYouTeachTheyWant.length > 0;
    const isOneWayTheyTeach = skillsTheyTeachYouWant.length > 0;
    const isOneWayYouTeach = skillsYouTeachTheyWant.length > 0;

    // Must have at least one learning connection
    if (!isMutual && !isOneWayTheyTeach && !isOneWayYouTeach) {
      continue;
    }

    // Calculate match score (0 - 100)
    let score = 0;
    let matchType = 'one_way_learn';

    if (isMutual) {
      matchType = 'mutual';
      score = 85; // Base high score for 2-way exchange

      // Bonus for multiple skills
      score += Math.min(10, (skillsTheyTeachYouWant.length + skillsYouTeachTheyWant.length - 2) * 3);

      // Proficiency synergy bonus
      const hasAdvanced = skillsTheyTeachYouWant.some(s => s.proficiency === 'Advanced');
      if (hasAdvanced) score += 5;
    } else if (isOneWayTheyTeach) {
      matchType = 'one_way_learn';
      score = 60 + Math.min(15, (skillsTheyTeachYouWant.length - 1) * 5);
    } else {
      matchType = 'one_way_teach';
      score = 55 + Math.min(15, (skillsYouTeachTheyWant.length - 1) * 5);
    }

    // Clamp score to 100 max
    score = Math.min(100, Math.max(10, score));

    // Construct human-readable explanation
    let explanation = '';
    if (isMutual) {
      const teachNames = skillsYouTeachTheyWant.map(s => s.name).join(', ');
      const learnNames = skillsTheyTeachYouWant.map(s => s.name).join(', ');
      explanation = `🌟 Perfect Two-Way Exchange! You can teach ${candidate.name} (${teachNames}), and in return, ${candidate.name} can teach you (${learnNames}). Zero money needed!`;
    } else if (isOneWayTheyTeach) {
      const learnNames = skillsTheyTeachYouWant.map(s => s.name).join(', ');
      explanation = `📚 ${candidate.name} has the skill you want to learn: ${learnNames}. You can book a learning session using your skill credits.`;
    } else {
      const teachNames = skillsYouTeachTheyWant.map(s => s.name).join(', ');
      explanation = `🎓 ${candidate.name} wants to learn ${teachNames}, which you can teach! Connect to earn credits.`;
    }

    // Apply optional filter criteria if provided
    if (filters.skillName) {
      const keyword = normalize(filters.skillName);
      const matchesKeyword = 
        candTeachable.some(s => normalize(s.name).includes(keyword)) ||
        candWanted.some(s => normalize(s.name).includes(keyword));
      if (!matchesKeyword) continue;
    }

    if (filters.category && filters.category !== 'All') {
      const matchesCategory = candTeachable.some(s => s.category === filters.category);
      if (!matchesCategory) continue;
    }

    if (filters.proficiency && filters.proficiency !== 'All') {
      const matchesProficiency = candTeachable.some(s => s.proficiency === filters.proficiency);
      if (!matchesProficiency) continue;
    }

    results.push({
      student: {
        _id: candidate._id || candidate.id,
        name: candidate.name,
        email: candidate.email,
        department: candidate.department,
        yearOfStudy: candidate.yearOfStudy,
        bio: candidate.bio,
        averageRating: candidate.averageRating || 5.0,
        reviewCount: candidate.reviewCount || 0,
        skillsTeachable: candidate.skillsTeachable || [],
        skillsWanted: candidate.skillsWanted || []
      },
      matchType, // 'mutual' | 'one_way_learn' | 'one_way_teach'
      score,
      explanation,
      skillsTheyTeachYouWant,
      skillsYouTeachTheyWant
    });
  }

  // Sort: Mutual matches first, then highest score descending
  results.sort((a, b) => {
    if (a.matchType === 'mutual' && b.matchType !== 'mutual') return -1;
    if (b.matchType === 'mutual' && a.matchType !== 'mutual') return 1;
    return b.score - a.score;
  });

  return results;
};

module.exports = {
  calculateMatches
};
