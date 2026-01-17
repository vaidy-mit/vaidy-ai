export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  category: "award" | "competition" | "certification" | "speaking";
}

export const achievements: Achievement[] = [
  {
    id: "meta-connect-2025",
    title: "Meta Connect 2025 Featured Speaker",
    organization: "Meta",
    year: "2025",
    description: "Presented 'Optimising Horizon Developer Experience for the Agentic AI Era' to 5,000+ developers. Featured in Connect Developer Keynote (100K+ viewers).",
    category: "speaking"
  },
  {
    id: "meta-inventor",
    title: "Meta Inventor Award",
    organization: "Meta",
    year: "2024",
    description: "Filed patent for novel AI-driven developer experience innovations including Knowledge Graph System architecture for safe and reliable agentic coding assistance.",
    category: "award"
  },
  {
    id: "amazon-inventor",
    title: "Amazon Inventor Award (x4)",
    organization: "Amazon",
    year: "2019-2023",
    description: "Awarded 4 inventor awards for technical innovations in Alexa Spoken Language Understanding, Neural LLMs, and speech recognition systems.",
    category: "award"
  },
  {
    id: "dccp-star",
    title: "Amazon DCCP Star Award",
    organization: "Amazon",
    year: "2017",
    description: "Recognized as best performer in organization for outstanding technical contributions and engineering excellence.",
    category: "award"
  },
  {
    id: "icpc-2014",
    title: "ACM ICPC Regional Finalist",
    organization: "ACM",
    year: "2014-2015",
    description: "Top 10 at Kharagpur 2014, Top 25 at Amritapuri 2015.",
    category: "competition"
  },
  {
    id: "codechef",
    title: "CodeChef Certified DSA Expert",
    organization: "CodeChef",
    year: "2018",
    description: "Scored 100% (750/750) in proctored Data Structures & Algorithms examination.",
    category: "certification"
  },
  {
    id: "triplebyte",
    title: "TripleByte Certified Generalist",
    organization: "TripleByte",
    year: "2019",
    description: "Certified Generalist Software Engineer.",
    category: "certification"
  },
  {
    id: "deeplearning-llm",
    title: "Finetuning Large Language Models",
    organization: "DeepLearning.AI",
    year: "2024",
    description: "Completed advanced course on LLM fine-tuning techniques.",
    category: "certification"
  }
];

export const getAchievementsByCategory = (category: Achievement["category"]): Achievement[] => {
  return achievements.filter(a => a.category === category);
};
