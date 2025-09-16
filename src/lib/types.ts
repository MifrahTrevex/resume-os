export type App = {
  id: 'about' | 'resume' | 'projects' | 'terminal' | 'contact' | 'css-invaders';
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
};

export type WindowInstance = {
  id: string;
  appId: App['id'];
  title: string;
  position: { x: number; y: number };
  size: { width: number, height: number };
  zIndex: number;
};

export type PersonalInfo = {
  name: string;
  title: string;
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

export type ResumeContent = {
  experience: Experience[];
  education: Education[];
  skills: string[];
};

export type Project = {
    title: string;
    description: string;
    tech: string[];
    link: string;
}

export type CvContent = {
  personalInfo: PersonalInfo;
  about: string;
  resume: ResumeContent;
  projects: Project[];
};
