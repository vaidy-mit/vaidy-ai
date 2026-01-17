export interface Experience {
  id: string;
  role: string;
  company: string;
  team: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  skills: string[];
}

export const experiences: Experience[] = [
  {
    id: "meta-reality-labs",
    role: "Software Engineer, AI Foundations Team Lead",
    company: "Meta Reality Labs",
    team: "Developer & Pro Platforms Group",
    location: "Bellevue, United States",
    period: "March 2024 - Present",
    startDate: "2024-03",
    endDate: "present",
    highlights: [
      "Leading AI Foundations Team of 6 engineers building AI-driven developer platforms for Horizon ecosystem (VR/MR, mobile, web, desktop), impacting 20K+ developers building for the Metaverse",
      "Built foundational infrastructure powering agentic coding assistants, focusing on safe and reliable AI assistance. Improved code generation accuracy to 85%+ and reduced onboarding time by 60%",
      "Designed novel Knowledge Graph System with 500K+ nodes powering Meta Horizon Worlds Gen AI Assistant. Achieved 78% precision and 88% recall through golden-set benchmarks. Filed patent with USPTO",
      "Architected AI-ready documentation pipelines processing 10K+ API endpoints with vector indexes. Achieved <200ms latency and 40% token cost reduction",
      "Speaker at Meta Connect 2025: Presented on responsible development of agentic AI systems to 5,000+ developers. Featured in Connect Developer Keynote (100K+ viewers)"
    ],
    skills: ["Agentic AI", "Knowledge Graphs", "Retrieval Frameworks", "Evaluation & Safety", "Vector DBs", "RAG", "AST", "Developer Experience"]
  },
  {
    id: "amazon-rufus",
    role: "Senior Software Development Engineer",
    company: "Amazon",
    team: "Intelligent Shopping Assistant, ShopFlow",
    location: "Seattle, United States",
    period: "September 2022 - March 2024",
    startDate: "2022-09",
    endDate: "2024-03",
    highlights: [
      "Led team of 10 engineers/data scientists to build Rufus, Amazon's generative AI shopping assistant using LLMs. Tackled challenges in prompt engineering, context management, hallucination mitigation, and grounding responses in factual product data. Proposed during hackathon, acknowledged by CEO and S-Team",
      "Led team of 8 engineers to build scalable ML orchestration platform using MetaFlow for model training and inference pipelines, improving infrastructure efficiency and boosting productivity of 20 teams"
    ],
    skills: ["LLMs", "Prompt Engineering", "Hallucination Mitigation", "Context Management", "RAG", "LangChain", "Vector DBs", "Python", "MetaFlow"]
  },
  {
    id: "amazon-alexa",
    role: "Software Development Engineer II",
    company: "Amazon",
    team: "Alexa Communications, Alexa Shopping ASR",
    location: "Seattle, United States",
    period: "September 2017 - August 2022",
    startDate: "2017-09",
    endDate: "2022-08",
    highlights: [
      "Led cross-org team of 8 engineers to build ML-powered voice shopping platform for Alexa, tackling challenges in spoken language understanding, intent classification, and entity resolution. Onboarded 25 clients in 6 months",
      "Led team of 6 engineers to build Alexa-Alexa calling experiences across 100s of 1P & 3P devices internationally. Invented novel drop-in experience used during COVID-19 for patient-doctor communication in US hospitals",
      "Led team of 4 engineers to build automated speech recognition system using Open Source ASR Engines, focusing on long tail item recognition. Improved accuracy significantly for rare product names"
    ],
    skills: ["NLP", "Spoken Language Understanding", "ASR", "Intent Classification", "Entity Resolution", "Acoustic Modeling", "OpenAI-Whisper", "Python", "Java"]
  },
  {
    id: "amazon-retail",
    role: "Software Development Engineer I",
    company: "Amazon",
    team: "Retail Selection & Price Monitoring",
    location: "Chennai, India",
    period: "June 2015 - August 2017",
    startDate: "2015-06",
    endDate: "2017-08",
    highlights: [
      "Built scalable batch processing system using Apache SPARK to process PBs of Amazon Catalog data daily, implementing predictive models for demand forecasting and competitive analysis",
      "Built multi-tenant distributed crawling framework to monitor & update live prices, tackling challenges in data extraction, deduplication, and real-time synchronization at scale"
    ],
    skills: ["Apache SPARK", "AWS Services", "Java", "Python", "Big Data"]
  }
];

export const getExperienceById = (id: string): Experience | undefined => {
  return experiences.find(exp => exp.id === id);
};

export const getTotalYearsExperience = (): number => {
  return new Date().getFullYear() - 2015;
};
