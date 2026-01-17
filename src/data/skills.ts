export interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "AI & Machine Learning",
    color: "#00ff9f",
    skills: [
      "Large Language Models (LLMs)",
      "Agentic AI Systems",
      "Knowledge Graphs",
      "RAG (Retrieval Augmented Generation)",
      "Vector Databases",
      "Prompt Engineering",
      "Hallucination Mitigation",
      "Evaluation & Safety"
    ]
  },
  {
    name: "NLP & Speech",
    color: "#64ffda",
    skills: [
      "Natural Language Processing",
      "Spoken Language Understanding",
      "Automatic Speech Recognition (ASR)",
      "Intent Classification",
      "Entity Resolution",
      "Acoustic Modeling",
      "Language Model Optimization"
    ]
  },
  {
    name: "Languages & Frameworks",
    color: "#bd93f9",
    skills: [
      "Python",
      "Java",
      "TypeScript",
      "LangChain",
      "MetaFlow",
      "Apache Spark"
    ]
  },
  {
    name: "Infrastructure & Tools",
    color: "#ff79c6",
    skills: [
      "AWS Services",
      "Vector Indexes",
      "Big Data Processing",
      "ML Pipelines",
      "API Design",
      "Developer Platforms"
    ]
  },
  {
    name: "Leadership",
    color: "#ffb86c",
    skills: [
      "Team Leadership (6-10 engineers)",
      "Cross-functional Collaboration",
      "Technical Mentorship",
      "Patent Development",
      "Public Speaking"
    ]
  }
];

export const getAllSkills = (): string[] => {
  return skillCategories.flatMap(cat => cat.skills);
};

export const getSkillCategory = (skill: string): string | undefined => {
  const category = skillCategories.find(cat =>
    cat.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
  return category?.name;
};
