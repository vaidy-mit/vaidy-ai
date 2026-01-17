export interface Patent {
  id: string;
  title: string;
  shortTitle: string;
  company: string;
  status: "issued" | "pending" | "filed";
  patentNumber?: string;
  year: string;
  description: string;
}

export const patents: Patent[] = [
  {
    id: "knowledge-graph",
    title: "AI-Driven Developer Experience Knowledge Graph System",
    shortTitle: "Knowledge Graph System",
    company: "Meta",
    status: "filed",
    year: "2024-2025",
    description: "Novel Knowledge Graph System architecture enabling context-aware code assistance through structured knowledge representation and semantic retrieval."
  },
  {
    id: "voice-communication",
    title: "Announcement in a Communications Session",
    shortTitle: "Voice Communication Systems",
    company: "Amazon (Alexa)",
    status: "issued",
    patentNumber: "US11172001B1",
    year: "2021",
    description: "Novel communication methodology for hands-free calling with privacy and consent management."
  },
  {
    id: "speech-recognition",
    title: "Speech Recognition Through Disambiguation Feedback",
    shortTitle: "Speech Recognition Optimization",
    company: "Amazon (Alexa)",
    status: "issued",
    patentNumber: "WO2021119014A1",
    year: "2023",
    description: "Novel approach to improve ASR accuracy for long tail and rare entity names through adaptive language modeling."
  },
  {
    id: "voice-disambiguation",
    title: "Triggering Voice Control Disambiguation",
    shortTitle: "Product Disambiguation",
    company: "Amazon (Alexa)",
    status: "issued",
    patentNumber: "US11694682B1",
    year: "2023",
    description: "Novel method for disambiguating product catalog items in voice interfaces."
  },
  {
    id: "utterance-generation",
    title: "Utterance Generation & Evaluation",
    shortTitle: "Speech Error Prediction",
    company: "Amazon (Alexa)",
    status: "issued",
    patentNumber: "US11600260B1",
    year: "2023",
    description: "Predictive model for ASR error detection and correction."
  }
];

export const getPatentById = (id: string): Patent | undefined => {
  return patents.find(p => p.id === id);
};

export const getIssuedPatentsCount = (): number => {
  return patents.filter(p => p.status === "issued").length;
};

export const getTotalPatentsCount = (): number => {
  return patents.length;
};
