export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  achievement?: string;
}

export const education: Education[] = [
  {
    id: "anna-university",
    degree: "Bachelor of Engineering, Computer Science",
    institution: "Anna University",
    location: "Chennai, India",
    period: "2011 - 2015",
    achievement: "First Class with Distinction"
  },
  {
    id: "higher-secondary",
    degree: "Higher Secondary Education",
    institution: "All Angels Matriculation",
    location: "Chennai, India",
    period: "2010 - 2011",
    achievement: "98% Aggregate, District Topper"
  }
];

export const leadership = [
  {
    id: "mlft",
    title: "Amazon Leadership Team - Management Leadership For Tomorrow",
    description: "Represented Amazon to deliver tech talks for 1000 underrepresented students across the US."
  },
  {
    id: "bootcamp",
    title: "Amazon SDE Bootcamp Instructor",
    description: "Instructor for Amazon SDE bootcamp to mentor new hire SDEs about Amazon culture and tech platforms."
  },
  {
    id: "volunteering",
    title: "Education & Volunteering",
    description: "Active coordinator for Amazon Future Engineer programs and served as senior volunteer for educational programs in TamilNadu, India, supporting underrepresented communities."
  }
];
