import type { Scholarship, StudentProfile } from "@/lib/db/schema";

export interface MatchLine {
  text: string;
}

export interface MatchResult {
  /** null when there's no profile at all to evaluate against (signed out). */
  percent: number | null;
  classification: "strong" | "partial" | "not_eligible" | "more_info_needed" | "unknown";
  matched: MatchLine[];
  unmet: MatchLine[];
  missing: MatchLine[];
}

const UNKNOWN: MatchResult = {
  percent: null,
  classification: "unknown",
  matched: [],
  unmet: [],
  missing: [],
};

/**
 * Deliberately simple, explainable rule-based matching — never a black-box
 * score. Every line traces to a concrete profile field vs. a concrete
 * scholarship requirement, per the "explain, don't just score" requirement.
 * This is not a guarantee of eligibility; funders make the final call.
 */
export function computeMatch(
  profile: StudentProfile | null,
  scholarship: Scholarship,
): MatchResult {
  if (!profile) return UNKNOWN;

  const matched: MatchLine[] = [];
  const unmet: MatchLine[] = [];
  const missing: MatchLine[] = [];

  // Nationality
  if (scholarship.eligibleNationalities === "all") {
    matched.push({ text: "Open to all nationalities" });
  } else if (!profile.nationality) {
    missing.push({ text: "Add your nationality to check this requirement" });
  } else if (scholarship.eligibleNationalities.includes(profile.nationality)) {
    matched.push({ text: `${profile.nationality} is on the eligible-country list` });
  } else {
    unmet.push({ text: `${profile.nationality} is not on the eligible-country list` });
  }

  // Degree level
  if (scholarship.degreeLevels.length === 0) {
    // no constraint recorded
  } else if (!profile.targetDegreeLevel) {
    missing.push({ text: "Add your target degree level to check this requirement" });
  } else {
    const target = profile.targetDegreeLevel.toLowerCase();
    const hit = scholarship.degreeLevels.some(
      (lvl) => lvl.toLowerCase().includes(target) || target.includes(lvl.toLowerCase().replace("'s", "")),
    );
    if (hit) {
      matched.push({ text: `${profile.targetDegreeLevel} matches this scholarship's degree level` });
    } else {
      unmet.push({
        text: `This scholarship funds ${scholarship.degreeLevels.join(", ")}, not ${profile.targetDegreeLevel}`,
      });
    }
  }

  // Language
  for (const req of scholarship.languageRequirements) {
    const owned = profile.languageQualifications.find(
      (q) => q.language.toLowerCase() === req.language.toLowerCase(),
    );
    if (!owned) {
      missing.push({ text: `Add a ${req.language} language result (needs ${req.test} ${req.minScore})` });
      continue;
    }
    const reqScore = Number.parseFloat(req.minScore);
    const ownedScore = Number.parseFloat(owned.score);
    if (!Number.isNaN(reqScore) && !Number.isNaN(ownedScore) && owned.test.toLowerCase() === req.test.toLowerCase()) {
      if (ownedScore >= reqScore) {
        matched.push({ text: `${owned.test} ${owned.score} clears the ${req.test} ${req.minScore} requirement` });
      } else {
        unmet.push({ text: `${owned.test} ${owned.score} is below the ${req.test} ${req.minScore} requirement` });
      }
    } else {
      matched.push({ text: `You have a ${owned.test} ${owned.score} result on file for ${req.language}` });
    }
  }

  // Work experience
  const minYears = scholarship.workExperienceMinYears ? Number.parseFloat(scholarship.workExperienceMinYears) : 0;
  if (minYears > 0) {
    if (profile.workExperienceYears === null) {
      missing.push({ text: `Add your work experience to check the ${minYears}+ year requirement` });
    } else {
      const years = Number.parseFloat(profile.workExperienceYears);
      if (years >= minYears) {
        matched.push({ text: `${years} years of experience meets the ${minYears}+ year requirement` });
      } else {
        unmet.push({ text: `${years} years of experience is below the ${minYears}+ year requirement` });
      }
    }
  }

  // GPA
  if (scholarship.gpaRequirementMaxGerman) {
    const maxAllowed = Number.parseFloat(scholarship.gpaRequirementMaxGerman);
    if (profile.gpa === null) {
      missing.push({ text: `Add your GPA to check the ${maxAllowed} German-scale requirement` });
    } else {
      const gpa = Number.parseFloat(profile.gpa);
      if (gpa <= maxAllowed) {
        matched.push({ text: `Your ${gpa} grade meets the ${maxAllowed} German-scale requirement` });
      } else {
        unmet.push({ text: `Your ${gpa} grade is below the ${maxAllowed} German-scale requirement` });
      }
    }
  }

  const total = matched.length + unmet.length + missing.length;
  const percent = total === 0 ? null : Math.round((matched.length / total) * 100);

  let classification: MatchResult["classification"] = "unknown";
  if (percent === null) classification = "unknown";
  else if (unmet.length > 0 && percent < 50) classification = "not_eligible";
  else if (missing.length > matched.length && unmet.length === 0) classification = "more_info_needed";
  else if (percent >= 80) classification = "strong";
  else classification = "partial";

  return { percent, classification, matched, unmet, missing };
}

export function classificationLabel(c: MatchResult["classification"]): string {
  switch (c) {
    case "strong":
      return "Strong match";
    case "partial":
      return "Partial match";
    case "not_eligible":
      return "Not currently eligible";
    case "more_info_needed":
      return "More information needed";
    default:
      return "Sign in to see your match";
  }
}
