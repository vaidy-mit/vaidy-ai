export interface GraphNode {
  id: string;
  label: string;
  group: "center" | "experience" | "patents" | "skills" | "achievements" | "education";
  color: string;
  size: number;
  description?: string;
  link?: string;
  details?: Record<string, string | string[]>;
}

export interface GraphLink {
  source: string;
  target: string;
  strength?: number;
}

export const graphNodes: GraphNode[] = [
  // Center node - You
  {
    id: "vaidy",
    label: "Vaidyanathan P K",
    group: "center",
    color: "#00ff9f",
    size: 40,
    description: "Lead AI Engineer @ Meta — Agentic AI Systems",
    details: {
      title: "Lead AI Engineer",
      company: "Meta",
      location: "Seattle, WA"
    }
  },

  // Experience nodes
  {
    id: "exp-meta",
    label: "Meta — Core Agentic Systems",
    group: "experience",
    color: "#64ffda",
    size: 30,
    description: "Lead AI Engineer (2024-Present)",
    details: {
      role: "Lead AI Engineer",
      period: "March 2024 - Present",
      highlights: [
        "Core Agentic Systems",
        "Production-scale multi-agent architectures",
        "Knowledge Graph with 500K+ nodes",
        "Meta Connect 2025 Speaker"
      ]
    }
  },
  {
    id: "exp-amazon-rufus",
    label: "Amazon Rufus",
    group: "experience",
    color: "#64ffda",
    size: 25,
    description: "Senior SDE - Gen AI Shopping Assistant (2022-2024)",
    details: {
      role: "Senior Software Development Engineer",
      period: "Sept 2022 - March 2024",
      highlights: [
        "Built Rufus - Amazon's Gen AI shopping assistant",
        "Led team of 10 engineers/data scientists",
        "Acknowledged by CEO and S-Team"
      ]
    }
  },
  {
    id: "exp-amazon-alexa",
    label: "Amazon Alexa",
    group: "experience",
    color: "#64ffda",
    size: 25,
    description: "SDE II - Communications & Shopping ASR (2017-2022)",
    details: {
      role: "Software Development Engineer II",
      period: "Sept 2017 - Aug 2022",
      highlights: [
        "Voice shopping platform",
        "Alexa-Alexa calling",
        "COVID-19 hospital communication"
      ]
    }
  },
  {
    id: "exp-amazon-retail",
    label: "Amazon Retail",
    group: "experience",
    color: "#64ffda",
    size: 20,
    description: "SDE I - Selection & Price Monitoring (2015-2017)",
    details: {
      role: "Software Development Engineer I",
      period: "June 2015 - Aug 2017",
      highlights: [
        "Apache Spark batch processing",
        "PBs of catalog data daily"
      ]
    }
  },

  // Patent nodes
  {
    id: "patent-kg",
    label: "Knowledge Graph Patent",
    group: "patents",
    color: "#bd93f9",
    size: 22,
    description: "AI-Driven Developer Experience (Meta, 2024)",
    details: {
      status: "Filed",
      company: "Meta",
      description: "Context-aware code assistance through knowledge graphs"
    }
  },
  {
    id: "patent-voice",
    label: "Voice Communication",
    group: "patents",
    color: "#bd93f9",
    size: 20,
    description: "Hands-free calling with privacy (US11172001B1)",
    details: {
      status: "Issued",
      patentNumber: "US11172001B1",
      company: "Amazon"
    }
  },
  {
    id: "patent-asr",
    label: "Speech Recognition",
    group: "patents",
    color: "#bd93f9",
    size: 20,
    description: "Disambiguation feedback (WO2021119014A1)",
    details: {
      status: "Issued",
      patentNumber: "WO2021119014A1",
      company: "Amazon"
    }
  },
  {
    id: "patent-product",
    label: "Product Disambiguation",
    group: "patents",
    color: "#bd93f9",
    size: 20,
    description: "Voice interface product matching (US11694682B1)",
    details: {
      status: "Issued",
      patentNumber: "US11694682B1",
      company: "Amazon"
    }
  },
  {
    id: "patent-utterance",
    label: "Utterance Evaluation",
    group: "patents",
    color: "#bd93f9",
    size: 20,
    description: "ASR error prediction (US11600260B1)",
    details: {
      status: "Issued",
      patentNumber: "US11600260B1",
      company: "Amazon"
    }
  },

  // Skills nodes
  {
    id: "skill-llm",
    label: "LLMs & Agentic AI",
    group: "skills",
    color: "#ff79c6",
    size: 22,
    description: "Large Language Models, RAG, Knowledge Graphs"
  },
  {
    id: "skill-nlp",
    label: "NLP & Speech",
    group: "skills",
    color: "#ff79c6",
    size: 20,
    description: "ASR, Intent Classification, Entity Resolution"
  },
  {
    id: "skill-infra",
    label: "Infrastructure",
    group: "skills",
    color: "#ff79c6",
    size: 18,
    description: "AWS, Spark, Vector DBs, ML Pipelines"
  },
  {
    id: "skill-lang",
    label: "Languages",
    group: "skills",
    color: "#ff79c6",
    size: 18,
    description: "Python, Java, TypeScript"
  },

  // Achievement nodes
  {
    id: "ach-connect",
    label: "Meta Connect 2025",
    group: "achievements",
    color: "#ffb86c",
    size: 22,
    description: "Featured Speaker - 100K+ viewers"
  },
  {
    id: "ach-icpc",
    label: "ACM ICPC",
    group: "achievements",
    color: "#ffb86c",
    size: 18,
    description: "Regional Finalist 2014-2015"
  },
  {
    id: "ach-inventor",
    label: "Inventor Awards",
    group: "achievements",
    color: "#ffb86c",
    size: 20,
    description: "5 patent awards (Meta + Amazon)"
  },

  // Education
  {
    id: "edu-anna",
    label: "Anna University",
    group: "education",
    color: "#8be9fd",
    size: 18,
    description: "B.E. Computer Science (2011-2015)",
    details: {
      degree: "Bachelor of Engineering, Computer Science",
      achievement: "First Class with Distinction"
    }
  }
];

export const graphLinks: GraphLink[] = [
  // Center to experience
  { source: "vaidy", target: "exp-meta", strength: 1 },
  { source: "vaidy", target: "exp-amazon-rufus", strength: 0.8 },
  { source: "vaidy", target: "exp-amazon-alexa", strength: 0.7 },
  { source: "vaidy", target: "exp-amazon-retail", strength: 0.6 },

  // Center to skills
  { source: "vaidy", target: "skill-llm", strength: 0.9 },
  { source: "vaidy", target: "skill-nlp", strength: 0.8 },
  { source: "vaidy", target: "skill-infra", strength: 0.7 },
  { source: "vaidy", target: "skill-lang", strength: 0.7 },

  // Center to achievements
  { source: "vaidy", target: "ach-connect", strength: 0.8 },
  { source: "vaidy", target: "ach-inventor", strength: 0.7 },
  { source: "vaidy", target: "ach-icpc", strength: 0.6 },

  // Center to education
  { source: "vaidy", target: "edu-anna", strength: 0.5 },

  // Experience to patents
  { source: "exp-meta", target: "patent-kg", strength: 0.9 },
  { source: "exp-amazon-alexa", target: "patent-voice", strength: 0.8 },
  { source: "exp-amazon-alexa", target: "patent-asr", strength: 0.8 },
  { source: "exp-amazon-alexa", target: "patent-product", strength: 0.8 },
  { source: "exp-amazon-alexa", target: "patent-utterance", strength: 0.8 },

  // Experience to skills
  { source: "exp-meta", target: "skill-llm", strength: 0.9 },
  { source: "exp-amazon-rufus", target: "skill-llm", strength: 0.9 },
  { source: "exp-amazon-alexa", target: "skill-nlp", strength: 0.9 },
  { source: "exp-amazon-retail", target: "skill-infra", strength: 0.8 },

  // Experience to achievements
  { source: "exp-meta", target: "ach-connect", strength: 0.9 },

  // Patents to skills
  { source: "patent-kg", target: "skill-llm", strength: 0.8 },
  { source: "patent-asr", target: "skill-nlp", strength: 0.8 }
];

export const getNodeById = (id: string): GraphNode | undefined => {
  return graphNodes.find(node => node.id === id);
};

export const getLinksForNode = (nodeId: string): GraphLink[] => {
  return graphLinks.filter(link => link.source === nodeId || link.target === nodeId);
};
