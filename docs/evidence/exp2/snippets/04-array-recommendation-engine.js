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
