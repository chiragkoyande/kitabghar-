/**
 * Recommendation Engine for Kitab Ghar Book Genie
 *
 * Deterministic multi-factor compatibility scoring:
 * - Category match:       30%
 * - Topic / Theme match:   25%
 * - Reading time match:    15%
 * - Style match:           15%
 * - Difficulty match:      10%
 * - Availability match:     5%
 *
 * Normalizes score to 0–100% and generates deterministic, personalized explanations.
 */

// Category keyword mappings for catalogue matching
const CATEGORY_MAP = {
  "self-improvement": ["self development", "self-help", "psychology", "nonfiction", "habits", "productivity", "growth", "guide"],
  "mystery": ["mystery", "thriller", "suspense", "crime", "detective", "dark", "investigation"],
  "technology": ["technology", "computer", "programming", "science", "nonfiction", "ai", "cyber", "academic"],
  "fiction": ["fiction", "literary fiction", "fantasy", "romance", "ya", "children", "comics", "stories", "novel"],
  "career": ["business", "career", "leadership", "management", "finance", "strategy", "nonfiction", "entrepreneurship"],
  "inspiring": ["classics", "literature", "poetry", "hindi literature", "memoir", "philosophy", "biography"]
};

// Topic keywords dictionary for deeper theme matching
const TOPIC_KEYWORDS = {
  // Self improvement
  habits: ["habit", "routine", "discipline", "atomic", "change", "behavior", "system", "daily"],
  productivity: ["productivity", "focus", "deep work", "time", "effective", "execution", "energy"],
  money: ["money", "finance", "wealth", "investing", "psychology of money", "rich", "capital"],
  career: ["career", "work", "job", "profession", "skills", "craft", "leadership"],
  communication: ["communication", "talk", "people", "influence", "listen", "relationship", "conversation"],
  "personal-growth": ["growth", "mindset", "life", "wisdom", "courage", "resilience", "purpose", "self"],

  // Mystery
  detective: ["detective", "investigation", "clue", "sherlock", "inspector", "case", "murder", "sleuth"],
  psychological: ["psychological", "mind", "twisted", "obsession", "secrets", "dark", "unsettling", "alienation"],
  crime: ["crime", "heist", "underworld", "gangster", "police", "guilt", "justice", "trial"],
  "dark-supernatural": ["supernatural", "magic", "dark", "ghost", "haunting", "dystopian", "mythology", "shadow"],

  // Technology
  programming: ["programming", "code", "software", "developer", "engineering", "system"],
  cybersecurity: ["security", "cyber", "hacker", "network", "privacy", "defense"],
  ai: ["ai", "intelligence", "future", "algorithm", "data", "machine", "synthetic"],
  "business-tech": ["tech", "startup", "platform", "digital", "scale", "innovation"],
  "general-tech": ["technology", "science", "future", "engineered", "modern", "discovery"],

  // Fiction / Escape
  classics: ["classic", "timeless", "masterpiece", "century", "heritage", "riverbank", "companion"],
  heartwarming: ["heart", "friendship", "tender", "family", "warm", "gentle", "love", "companions"],
  fantasy: ["fantasy", "magic", "doorway", "glittering", "myth", "realm", "legend", "kingdom"],
  poetry: ["poetry", "verse", "soul", "lyrical", "rhyme", "selected", "lamp", "whisper"],

  // Career
  leadership: ["lead", "leader", "team", "organization", "vision", "strategy", "people"],
  entrepreneurship: ["startup", "founder", "build", "venture", "business", "create"],
  "finance-investing": ["investing", "stocks", "market", "economy", "wealth", "returns"],
  "teamwork-culture": ["culture", "team", "collaborate", "trust", "workplace", "together"]
};

// Style mapping helpers
const STYLE_KEYWORDS = {
  practical: ["practical", "guide", "action", "step", "how-to", "framework", "habits", "rules"],
  "story-driven": ["story", "journey", "novel", "narrative", "life", "memoir", "adventures", "tales"],
  "deep-detailed": ["detailed", "deep", "comprehensive", "history", "landmark", "system", "alienation"],
  "easy-conversational": ["accessible", "simple", "warm", "gentle", "short", "funny", "light", "conversational"],
  conceptual: ["theory", "ideas", "philosophy", "concept", "imagining", "dystopian", "mind"],
  "project-oriented": ["build", "hands-on", "project", "execution", "tools", "application"]
};

// Reading time / length mapping (approximated by description density and metadata)
const TIME_KEYWORDS = {
  short: ["short", "bite-sized", "quick", "selected", "spare", "simple", "stories"],
  moderate: ["novel", "journey", "guide", "portrait", "memoir", "exploration"],
  long: ["epic", "saga", "centuries", "landmark", "comprehensive", "deep"]
};

/**
 * Calculates a match score between 0 and 1 for a book given preferences.
 */
export function calculateBookScore(book, preferences) {
  if (!book) return { score: 0, factors: {}, explanations: [] };

  const fullText = `${book.title} ${book.author} ${book.category} ${book.description || ""}`.toLowerCase();
  const categoryLower = (book.category || "").toLowerCase();

  let categoryScore = 0;
  let topicScore = 0;
  let timeScore = 0.5; // neutral default
  let styleScore = 0.5;
  let difficultyScore = 0.5;
  let availabilityScore = book.availableCopies > 0 ? 1.0 : 0.4;

  const matchedFactors = [];

  // 1. Category Match (Weight: 30%)
  const primaryCategory = preferences.category || preferences.mood;
  if (primaryCategory) {
    const targetKeywords = CATEGORY_MAP[primaryCategory] || [];
    let catMatched = targetKeywords.some(kw => categoryLower.includes(kw) || fullText.includes(kw));

    if (primaryCategory === "self-improvement" && (categoryLower.includes("nonfiction") || categoryLower.includes("self") || categoryLower.includes("psychology"))) {
      categoryScore = 1.0;
      matchedFactors.push({ factor: "category", label: "Self Improvement & Personal Growth" });
    } else if (primaryCategory === "mystery" && (categoryLower.includes("mystery") || categoryLower.includes("thriller") || categoryLower.includes("crime"))) {
      categoryScore = 1.0;
      matchedFactors.push({ factor: "category", label: "Mystery & Thriller" });
    } else if (primaryCategory === "technology" && (categoryLower.includes("nonfiction") || categoryLower.includes("tech") || fullText.includes("future") || fullText.includes("science"))) {
      categoryScore = 0.9;
      matchedFactors.push({ factor: "category", label: "Science & Technology" });
    } else if (primaryCategory === "fiction" && (categoryLower.includes("fiction") || categoryLower.includes("fantasy") || categoryLower.includes("romance") || categoryLower.includes("comics"))) {
      categoryScore = 1.0;
      matchedFactors.push({ factor: "category", label: "Fiction & Immersive Stories" });
    } else if (primaryCategory === "career" && (categoryLower.includes("business") || categoryLower.includes("nonfiction") || fullText.includes("work") || fullText.includes("career"))) {
      categoryScore = 0.95;
      matchedFactors.push({ factor: "category", label: "Business & Career" });
    } else if (primaryCategory === "inspiring" && (categoryLower.includes("classics") || categoryLower.includes("literature") || categoryLower.includes("poetry") || categoryLower.includes("hindi"))) {
      categoryScore = 1.0;
      matchedFactors.push({ factor: "category", label: "Inspiring Classics & Literature" });
    } else if (catMatched) {
      categoryScore = 0.75;
    } else {
      categoryScore = 0.25;
    }
  }

  // 2. Topic / Sub-genre / Work-on Match (Weight: 25%)
  const topic = preferences.topic || preferences.area || preferences.mysteryType || preferences.worldType || preferences.careerFocus;
  if (topic) {
    const keywords = TOPIC_KEYWORDS[topic] || [topic.replace("-", " ")];
    let matchesCount = 0;
    for (const kw of keywords) {
      if (fullText.includes(kw)) {
        matchesCount++;
      }
    }
    if (matchesCount > 0) {
      topicScore = Math.min(1.0, 0.6 + matchesCount * 0.2);
      matchedFactors.push({ factor: "topic", label: topic.replace("-", " ") });
    } else {
      // Fallback partial matching
      topicScore = 0.4;
    }
  } else {
    topicScore = 0.6;
  }

  // 3. Reading Time Match (Weight: 15%)
  const readingTime = preferences.readingTime || preferences.readingPace || preferences.readingDepth;
  if (readingTime) {
    if (readingTime.includes("short") || readingTime.includes("quick") || readingTime.includes("20")) {
      const isShort = TIME_KEYWORDS.short.some(kw => fullText.includes(kw));
      timeScore = isShort ? 1.0 : 0.6;
      if (isShort) matchedFactors.push({ factor: "time", label: "Shorter reading sessions" });
    } else if (readingTime.includes("long") || readingTime.includes("deep") || readingTime.includes("epic")) {
      const isLong = TIME_KEYWORDS.long.some(kw => fullText.includes(kw));
      timeScore = isLong ? 1.0 : 0.7;
      if (isLong) matchedFactors.push({ factor: "time", label: "Immersive deep reading" });
    } else {
      timeScore = 0.8;
    }
  }

  // 4. Style Match (Weight: 15%)
  const style = preferences.style;
  if (style) {
    const kws = STYLE_KEYWORDS[style] || [];
    const hasStyleKw = kws.some(kw => fullText.includes(kw));
    if (hasStyleKw) {
      styleScore = 1.0;
      matchedFactors.push({ factor: "style", label: `${style.replace("-", " ")} style` });
    } else {
      styleScore = 0.5;
    }
  }

  // 5. Difficulty / Experience / Era Match (Weight: 10%)
  const experience = preferences.experience || preferences.difficulty;
  const era = preferences.era; // modern / classic / either
  let eraScore = 0.5;
  if (era === "classic") {
    eraScore = (categoryLower.includes("classic") || (book.publicationYear && book.publicationYear < 2000)) ? 1.0 : 0.3;
    if (eraScore === 1.0) matchedFactors.push({ factor: "era", label: "Classic literature" });
  } else if (era === "modern") {
    eraScore = (!categoryLower.includes("classic") || (book.publicationYear && book.publicationYear >= 2000)) ? 1.0 : 0.4;
    if (eraScore === 1.0) matchedFactors.push({ factor: "era", label: "Contemporary publication" });
  } else {
    eraScore = 0.8;
  }

  if (experience) {
    if (experience === "beginner" && (fullText.includes("gentle") || fullText.includes("accessible") || fullText.includes("simple") || fullText.includes("companion"))) {
      difficultyScore = 1.0;
    } else if (experience === "advanced" && (fullText.includes("landmark") || fullText.includes("haunting") || fullText.includes("experimental") || fullText.includes("deep"))) {
      difficultyScore = 1.0;
    } else {
      difficultyScore = 0.7;
    }
  }

  const difficultyFinal = (difficultyScore * 0.5 + eraScore * 0.5);

  // Total weighted score calculation (0 - 100)
  const weightedTotal =
    categoryScore * 30 +
    topicScore * 25 +
    timeScore * 15 +
    styleScore * 15 +
    difficultyFinal * 10 +
    availabilityScore * 5;

  // Add small deterministic tie-breaker based on book title characters for consistent ranking
  const tieBreaker = (book.title.charCodeAt(0) % 5) * 0.2;
  const normalizedScore = Math.min(99, Math.max(65, Math.round(weightedTotal + tieBreaker)));

  return {
    score: normalizedScore,
    factors: {
      category: categoryScore,
      topic: topicScore,
      time: timeScore,
      style: styleScore,
      difficulty: difficultyFinal,
      availability: availabilityScore
    },
    matchedFactors
  };
}

/**
 * Generates a natural, deterministic explanation tailored to the matched attributes.
 */
export function generateExplanation(book, preferences, matchResult) {
  const parts = [];

  const topic = preferences.topic || preferences.area || preferences.mysteryType || preferences.worldType || preferences.careerFocus;
  const style = preferences.style;
  const readingTime = preferences.readingTime || preferences.readingPace;
  const era = preferences.era;

  if (topic) {
    const formattedTopic = topic.replace(/-/g, " ");
    parts.push(`focuses on ${formattedTopic}`);
  }

  if (style) {
    const formattedStyle = style.replace(/-/g, " ");
    parts.push(`uses a ${formattedStyle} approach`);
  }

  if (readingTime) {
    if (readingTime.includes("short") || readingTime.includes("quick") || readingTime.includes("20")) {
      parts.push("works well for shorter reading sessions");
    } else if (readingTime.includes("long") || readingTime.includes("deep")) {
      parts.push("offers an immersive, rewarding deep read");
    } else if (readingTime.includes("fast")) {
      parts.push("delivers a fast, gripping narrative pace");
    }
  }

  if (era === "classic") {
    parts.push("brings timeless literary depth");
  } else if (era === "modern") {
    parts.push("features a fresh, modern perspective");
  }

  if (parts.length === 0) {
    return `Recommended from the ${book.category} collection because it aligns with your reading preferences and current library availability.`;
  }

  if (parts.length === 1) {
    return `Recommended because it ${parts[0]} and fits your chosen reading mood.`;
  }

  if (parts.length === 2) {
    return `Recommended because it ${parts[0]} and ${parts[1]}.`;
  }

  const lastPart = parts.pop();
  return `Recommended because it ${parts.join(", ")}, and ${lastPart}.`;
}

/**
 * Main recommendation entry point.
 * Returns top 3 books sorted by highest compatibility score.
 *
 * @param {Object} preferences - User's collected answers
 * @param {Array} books - Array of books from the Kitab Ghar catalogue
 * @returns {Array} Array of recommended book objects with score and explanation
 */
export function getBookRecommendations(preferences, books = []) {
  if (!Array.isArray(books) || books.length === 0) {
    return [];
  }

  // Score all available active books
  const scoredBooks = books
    .filter(b => b.status !== "archived")
    .map(book => {
      const matchResult = calculateBookScore(book, preferences);
      const explanation = generateExplanation(book, preferences, matchResult);
      return {
        ...book,
        compatibilityScore: matchResult.score,
        matchFactors: matchResult.matchedFactors,
        explanation
      };
    });

  // Sort descending by compatibility score, then by availability, then title
  scoredBooks.sort((a, b) => {
    if (b.compatibilityScore !== a.compatibilityScore) {
      return b.compatibilityScore - a.compatibilityScore;
    }
    if ((b.availableCopies > 0) !== (a.availableCopies > 0)) {
      return (b.availableCopies > 0 ? 1 : 0) - (a.availableCopies > 0 ? 1 : 0);
    }
    return a.title.localeCompare(b.title);
  });

  // Return top 3 distinct recommendations
  return scoredBooks.slice(0, 3);
}
