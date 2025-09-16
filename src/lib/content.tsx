import type { App } from './types';
import { FileText, Briefcase, Code, User, Terminal as TerminalIcon, Mail } from 'lucide-react';
import React from 'react';

export const personalInfo = {
  name: "Dickens Okoth Otieno",
  title: "IT Professional",
  contact: {
    email: "dickenokoth@gmail.com",
    linkedin: "https://linkedin.com/in/dickens-okoth", // Placeholder, not in CV
    github: "https://github.com/dickens-okoth", // Placeholder, not in CV
    phone: "(+254) 792475055",
  },
};

export const aboutContent = `
I am a motivated and adaptable IT professional with a strong passion for technology and problem-solving. I take pride in my ability to learn quickly, work well under pressure, and collaborate effectively with teams to deliver reliable solutions. My hands-on experience in network troubleshooting, system maintenance, and user support has helped me develop a practical approach to solving complex challenges. I am committed to continuous learning and growth, with the goal of applying innovative IT solutions that drive efficiency and support organizational success.
`;

export const resumeContent = {
  experience: [
    {
      role: "ICT Support Intern",
      company: "Ministry Of Investments Trade and Industry",
      period: "26/05/2025 - 25/08/2025",
      description: "Assisted in troubleshooting and resolving hardware and software issues on computers, printers, and other office equipment. Helped configure and maintain network connections and IP settings for office devices. Installed and updated operating systems (Windows, Linux) and essential software such as Microsoft Office. Assisted in setting up new user accounts and workstations. Supported the ICT team in monitoring and maintaining local area network (LAN) performance. Maintained records of technical issues, troubleshooting steps, and resolutions in daily logbooks."
    },
    {
      role: "Cyber Cafe Attendant",
      company: "Jofrah Stores",
      period: "2022 - 2023",
      description: "Delivered technical support to customers, assisting with computer access, internet use, and troubleshooting software and hardware issues. Maintained system performance by performing regular updates, scans, and security checks to prevent malware and unauthorized downloads. Assisted clients with printing, scanning, and document formatting, ensuring high-quality service and customer satisfaction. Configured and monitored network connections to ensure consistent connectivity and minimized downtime. Promoted safe computing practices by educating customers on privacy and responsible internet use. Demonstrated adaptability by efficiently handling multiple tasks and customer requests in a fast-paced environment."
    },
  ],
  education: [
    // Education details were not in the provided CV.
  ],
  skills: [
    "Technical Support", "Troubleshooting Hardware & Software", "Computer hardware and Software Components",
    "Basic Networking configuration and maintenance", "Windows and Linux Operating Systems",
    "Productivity tools( Microsoft Office Suite and Google Workspace", "Cybersecurity Fundamentals",
    "Communication and teamwork", "Problem solving and Critical thinking"
  ]
};

export const projectsContent = [
    // Project details were not in the provided CV. I will leave this section blank.
];


const AboutContent = () => (
    <div className="p-4">
        <h2 className="text-xl font-bold font-headline mb-2 text-accent">About Me</h2>
        <p className="whitespace-pre-wrap">{aboutContent}</p>
    </div>
);

const ResumeContent = () => (
    <div className="p-4 space-y-6">
        <div>
            <h2 className="text-xl font-bold font-headline mb-4 text-accent">Resume</h2>
            <h3 className="text-lg font-semibold font-headline mb-2">Work Experience</h3>
            <div className="space-y-4">
                {resumeContent.experience.map((job, i) => (
                    <div key={i}>
                        <h4 className="font-bold">{job.role}</h4>
                        <p className="text-sm text-muted-foreground">{job.company} | {job.period}</p>
                        <p className="mt-1 whitespace-pre-wrap">{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {resumeContent.education.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold font-headline mt-6 mb-2">Education</h3>
                {resumeContent.education.map((edu, i) => (
                    <div key={i} className="mb-4">
                        <h4 className="font-bold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                    </div>
                ))}
            </div>
        )}

        <div>
            <h3 className="text-lg font-semibold font-headline mt-6 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {resumeContent.skills.map(skill => <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{skill}</span>)}
            </div>
        </div>
    </div>
);

const ProjectsContent = () => (
    <div className="p-4">
        <h2 className="text-xl font-bold font-headline mb-4 text-accent">Projects</h2>
        {projectsContent.length > 0 ? (
            <div className="space-y-4">
            {projectsContent.map((proj, i) => (
                 <div key={i}>
                    <h3 className="font-bold">{proj.title}</h3>
                    <p className="mt-1 mb-2">{proj.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {proj.tech.map(t => <span key={t} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{t}</span>)}
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">View on GitHub &rarr;</a>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <p>No projects listed in the provided CV.</p>
        )}
    </div>
);

const ContactContent = () => (
     <div className="p-4">
        <h2 className="text-xl font-bold font-headline mb-4 text-accent">Contact</h2>
        <p className="mb-4">You can reach me through the following channels:</p>
        <ul className="space-y-2">
            <li><a href={`mailto:${personalInfo.contact.email}`} className="flex items-center gap-2 hover:text-accent"><Mail size={16} /> {personalInfo.contact.email}</a></li>
            <li><a href={personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              LinkedIn
            </a></li>
            <li><a href={personalInfo.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </a></li>
        </ul>
    </div>
);


const PlaceholderTerminal = () => React.Fragment;

export const APPS: App[] = [
    { id: 'about', name: 'About Me', icon: <User size={32} />, component: AboutContent },
    { id: 'resume', name: 'Resume', icon: <FileText size={32} />, component: ResumeContent },
    { id: 'projects', name: 'Projects', icon: <Briefcase size={32} />, component: ProjectsContent },
    { id: 'contact', name: 'Contact', icon: <Mail size={32} />, component: ContactContent },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={32} />, component: PlaceholderTerminal },
];
