

export type App = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  isTerminal?: boolean;
  active?: boolean;
  isFolderContent?: boolean;
  parentId?: string;
};

export type WindowInstance = {
  id: string;
  appId: App['id'];
  title: string;
  position: { x: number; y: number };
  size: { width: number, height: number };
  zIndex: number;
  minimized: boolean;
  history: string[];
};

export type PersonalInfo = {
  name: string;
  title: string;
  imageUrl: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
    phone: string;
  };
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
};

export type Referee = {
  name: string;
  title: string;
  contact: string;
};

export type ResumeContent = {
  experience: Experience[];
  education: Education[];
  skills: string[];
  referees: Referee[];
};

export type Project = {
    title: string;
    description: string;
    tech: string[];
    link?: string;
}

export type CvContent = {
  personalInfo: PersonalInfo;
  about: string;
  interests: string[];
  details: string[];
  resume: ResumeContent;
  projects: Project[];
};
