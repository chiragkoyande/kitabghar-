const option = (value, label, description, icon, tags = []) => ({ value, label, description, icon, tags });

const categoryQuestion = {
  key: "category",
  prompt: "What are you in the mood for?",
  options: [
    option("inspiring", "Something inspiring", "Stories and ideas that stay with you.", "✦"),
    option("mystery", "Mystery & suspense", "Clues, twists and impossible-to-put-down pages.", "⌕"),
    option("fiction", "Relax & escape", "A warm doorway into another world.", "◌"),
    option("self-improvement", "Self improvement", "Small ideas that make everyday life better.", "↗"),
    option("career", "Career & business", "Practical thinking for work and ambition.", "▥"),
    option("technology", "Learn something new", "Technology, science and the future.", "⌘"),
  ],
};

const FLOWS = {
  "self-improvement": [
    { key: "topic", prompt: "What would you like to work on?", options: [option("habits", "Habits", "Build routines that last.", "◒"), option("productivity", "Productivity", "Focus your time and energy.", "◷"), option("money", "Money", "Make calmer financial decisions.", "₹"), option("career", "Career", "Grow your skills and direction.", "↗"), option("communication", "Communication", "Connect and communicate better.", "◌"), option("personal-growth", "Personal growth", "Understand yourself and move forward.", "✦")] },
    { key: "readingTime", prompt: "How much time do you usually have for reading?", options: [option("short", "Short sessions", "A few pages whenever you find a moment.", "⌁"), option("20-30", "20–30 minutes", "A steady daily reading rhythm.", "◷"), option("30-60", "30–60 minutes", "Time to settle into an idea.", "◒"), option("long", "Long reading sessions", "Give me a book I can disappear into.", "∞")] },
    { key: "style", prompt: "What style do you prefer?", options: [option("practical", "Practical", "Clear ideas you can use today.", "✓"), option("story-driven", "Story-driven", "Lessons carried by memorable stories.", "◌"), option("deep-detailed", "Deep & detailed", "Nuance, context and a bigger picture.", "⌘"), option("easy-conversational", "Easy & conversational", "Friendly, accessible and warm.", "☼")] },
    { key: "experience", prompt: "How experienced are you with this topic?", options: [option("beginner", "Beginner", "Start with a welcoming introduction.", "1"), option("intermediate", "Intermediate", "I know the basics and want more.", "2"), option("advanced", "Advanced", "Challenge me with deeper thinking.", "3")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "Contemporary voices and current ideas.", "✦"), option("classic", "Classic", "A title with a long afterlife.", "◈"), option("either", "Either", "The best match matters most.", "↔")] },
  ],
  mystery: [
    { key: "mysteryType", prompt: "What kind of mystery are you craving?", options: [option("detective", "Detective", "Clever clues and satisfying deductions.", "⌕"), option("psychological", "Psychological", "Secrets, motives and a twist in the mind.", "◉"), option("crime", "Crime", "Justice, consequences and high stakes.", "⚖"), option("dark-supernatural", "Dark / supernatural", "Atmosphere, shadows and the unknown.", "☾")] },
    { key: "readingPace", prompt: "What pace should the story have?", options: [option("fast", "Fast-paced", "Keep the pages turning.", "»"), option("medium", "Medium", "A balanced mix of plot and atmosphere.", "›"), option("slow", "Slow / atmospheric", "Let the tension build quietly.", "…")] },
    { key: "era", prompt: "Classic or modern?", options: [option("modern", "Modern", "Fresh voices and contemporary settings.", "✦"), option("classic", "Classic", "A mystery readers return to.", "◈"), option("either", "Either", "Surprise me with the right case.", "↔")] },
  ],
  technology: [
    { key: "area", prompt: "Which technology shelf sounds best?", options: [option("programming", "Programming", "Build software and sharpen your craft.", "</>"), option("cybersecurity", "Cybersecurity", "Protect systems, people and data.", "⌁"), option("ai", "AI", "Explore intelligent machines and ideas.", "✦"), option("business-tech", "Business & technology", "Where products, people and platforms meet.", "▥"), option("general-tech", "General technology", "A broad tour of how things work.", "⌘")] },
    { key: "difficulty", prompt: "What level should we choose?", options: [option("beginner", "Beginner", "Build a clear foundation.", "1"), option("intermediate", "Intermediate", "Move beyond the basics.", "2"), option("advanced", "Advanced", "Give me a serious challenge.", "3")] },
    { key: "style", prompt: "How would you like to learn?", options: [option("practical", "Practical", "Examples, tools and useful steps.", "✓"), option("conceptual", "Conceptual", "Understand the ideas beneath the tools.", "⌘"), option("project-oriented", "Project-oriented", "Learn by building something real.", "▣")] },
  ],
  fiction: [
    { key: "topic", prompt: "What kind of escape sounds right?", options: [option("fantasy", "Fantasy", "A world beyond the everyday.", "✦"), option("heartwarming", "Heartwarming", "Human stories with a little light.", "♡"), option("classics", "Classic fiction", "A story that has travelled through time.", "◈"), option("poetry", "Poetry & reflection", "Beautiful language and a slower rhythm.", "❧")] },
    { key: "style", prompt: "How should it feel to read?", options: [option("story-driven", "Story-driven", "Let the characters lead the way.", "◌"), option("easy-conversational", "Easy & conversational", "Comforting and effortless.", "☼"), option("deep-detailed", "Deep & detailed", "A richly built world to explore.", "⌘")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "A current voice and perspective.", "✦"), option("classic", "Classic", "A title with a long afterlife.", "◈"), option("either", "Either", "Choose the most enchanting match.", "↔")] },
  ],
  inspiring: [
    { key: "topic", prompt: "What kind of inspiration do you need?", options: [option("personal-growth", "Personal growth", "A thoughtful nudge forward.", "✦"), option("biography", "A real life story", "Learn from someone else's journey.", "◌"), option("classics", "Timeless wisdom", "Ideas that have endured.", "◈"), option("poetry", "Poetry & reflection", "A few beautiful lines to carry.", "❧")] },
    { key: "style", prompt: "What style would you enjoy?", options: [option("story-driven", "Story-driven", "Let a life or story open the door.", "◌"), option("conceptual", "Thought-provoking", "Give me ideas to sit with.", "⌘"), option("easy-conversational", "Easy & conversational", "Warm, clear and welcoming.", "☼")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "A voice for today.", "✦"), option("classic", "Classic", "A voice that still matters.", "◈"), option("either", "Either", "The right idea at the right time.", "↔")] },
  ],
  career: [
    { key: "careerFocus", prompt: "What would help you most right now?", options: [option("leadership", "Leadership", "Lead people and decisions with clarity.", "♧"), option("entrepreneurship", "Entrepreneurship", "Build, test and grow an idea.", "↗"), option("finance-investing", "Finance", "Understand money and markets.", "₹"), option("teamwork-culture", "Teams & culture", "Make work more human and effective.", "◌")] },
    { key: "style", prompt: "How do you like to learn?", options: [option("practical", "Practical", "Useful frameworks for the real world.", "✓"), option("story-driven", "Story-driven", "Learn through people and cases.", "◌"), option("deep-detailed", "Deep & detailed", "Give me the full picture.", "⌘")] },
    { key: "difficulty", prompt: "What level feels right?", options: [option("beginner", "Beginner", "A clear place to start.", "1"), option("intermediate", "Intermediate", "I am ready to go further.", "2"), option("advanced", "Advanced", "Challenge my thinking.", "3")] },
  ],
};

function flowFor(category) {
  return [categoryQuestion, ...(FLOWS[category] || FLOWS.fiction)];
}

function preferenceSummary(preferences) {
  return Object.values(preferences).filter(Boolean).map((value) => String(value).replace(/-/g, " ")).slice(0, 4).join(" · ");
}

function GenieProgress({ current, total }) {
  return <div className="genie-wizard-progress"><div><span>Question {current} of {total}</span><strong>{Math.round((current / total) * 100)}%</strong></div><i><b style={{ width: `${(current / total) * 100}%` }} /></i></div>;
}

function GenieOption({ choice, selected, onSelect }) {
  return <button className={`genie-option-card${selected ? " selected" : ""}`} type="button" onClick={() => onSelect(choice)}><span className="genie-option-icon" aria-hidden="true">{choice.icon}</span><span className="genie-option-copy"><strong>{choice.label}</strong><small>{choice.description}</small></span><span className="genie-option-arrow" aria-hidden="true">→</span></button>;
