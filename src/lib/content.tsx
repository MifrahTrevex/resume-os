import type { App, CvContent } from './types';
import { Terminal as TerminalIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';

const FileIcon = ({ color = "#fde047" }: { color?: string }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41 4H15C13.8954 4 13 4.89543 13 6V58C13 59.1046 13.8954 60 15 60H49C50.1046 60 51 59.1046 51 58V14L41 4Z" fill={color} fillOpacity="0.8"/>
        <path d="M41 4V14H51" fill={color} fillOpacity="0.5"/>
    </svg>
);

const FolderIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53 19H34.4142C33.5858 19 32.7878 18.6839 32.1716 18.0678L29.9322 15.8284C29.3161 15.2122 28.5181 14.8961 27.6897 14.8961H11C9.89543 14.8961 9 15.7916 9 16.8961V49C9 50.1046 9.89543 51 11 51H53C54.1046 51 55 50.1046 55 49V21C55 19.8954 54.1046 19 53 19Z" fill="#a5f3fc" fillOpacity="0.7"/>
    </svg>
);

const TerminalAppIcon = () => (
     <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="#111827"/>
        <path d="M18 28L26 36L18 44" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 44H46" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round"/>
    </svg>
)

export const initialCvContent: CvContent = {
    personalInfo: {
        name: "Dickens Okoth Otieno",
        title: "IT Professional",
        contact: {
            email: "dickenokoth@gmail.com",
            linkedin: "https://linkedin.com/in/dickens-okoth",
            github: "https://github.com/dickens-okoth",
            phone: "(+254) 792475055",
        },
    },
    about: `I am a motivated and adaptable IT professional with a strong passion for technology and problem-solving. I take pride in my ability to learn quickly, work well under pressure, and collaborate effectively with teams to deliver reliable solutions. My hands-on experience in network troubleshooting, system maintenance, and user support has helped me develop a practical approach to solving complex challenges. I am committed to continuous learning and growth, with the goal of applying innovative IT solutions that drive efficiency and support organizational success.
`,
    resume: {
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
        education: [],
        skills: [
            "Technical Support", "Troubleshooting Hardware & Software", "Computer hardware and Software Components",
            "Basic Networking configuration and maintenance", "Windows and Linux Operating Systems",
            "Productivity tools( Microsoft Office Suite and Google Workspace", "Cybersecurity Fundamentals",
            "Communication and teamwork", "Problem solving and Critical thinking"
        ]
    },
    projects: [],
};


const AboutContent = ({ content, onSave }: { content: CvContent; onSave: (newContent: string) => void }) => {
    const { userType, promptLogin, isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [about, setAbout] = useState(content.about);

    const handleEditClick = () => {
        if (userType === 'admin') {
            setIsEditing(true);
        } else {
            promptLogin();
        }
    }

    const handleSave = () => {
        onSave(about);
        setIsEditing(false);
    }
    
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold font-headline text-foreground">About Me</h2>
                {isAuthenticated && !isEditing && (
                    <Button onClick={handleEditClick}>Edit</Button>
                )}
                {isAuthenticated && isEditing && (
                    <Button onClick={handleSave}>Save</Button>
                )}
            </div>
            {isEditing && userType === 'admin' ? (
                 <Textarea 
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="flex-grow bg-black text-slate-100 font-code border-slate-700 focus:ring-amber-400"
                 />
            ) : (
                <p className="whitespace-pre-wrap flex-grow">{content.about}</p>
            )}
        </div>
    );
};

const ResumeContent = ({ content, onSave }: { content: CvContent; onSave: (newContent: CvContent['resume']) => void }) => {
    const { userType, promptLogin, isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [resume, setResume] = useState(content.resume);
    
    const handleEditClick = () => {
        if (userType === 'admin') {
            setIsEditing(true);
        } else {
            promptLogin();
        }
    }

    const handleSave = () => {
        onSave(resume);
        setIsEditing(false);
    }

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const newExperience = [...resume.experience];
        (newExperience[index] as any)[field] = value;
        setResume({...resume, experience: newExperience});
    }

    if (isEditing && userType === 'admin') {
        return (
            <div className="p-4 space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-headline text-foreground">Edit Resume</h2>
                    <Button onClick={handleSave}>Save</Button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <h3 className="text-lg font-semibold font-headline mb-2">Work Experience</h3>
                    {resume.experience.map((job, i) => (
                        <div key={i} className="space-y-2 border-b border-border pb-4 mb-4">
                             <Label className="text-amber-400">Role</Label>
                             <Input 
                                value={job.role} 
                                onChange={e => handleExperienceChange(i, 'role', e.target.value)}
                                className="bg-black text-slate-100 font-code border-slate-700"
                            />
                            <Label className="text-amber-400">Company</Label>
                             <Input 
                                value={job.company} 
                                onChange={e => handleExperienceChange(i, 'company', e.target.value)}
                                className="bg-black text-slate-100 font-code border-slate-700"
                            />
                             <Label className="text-amber-400">Period</Label>
                             <Input 
                                value={job.period} 
                                onChange={e => handleExperienceChange(i, 'period', e.target.value)}
                                className="bg-black text-slate-100 font-code border-slate-700"
                            />
                            <Label className="text-amber-400">Description</Label>
                            <Textarea 
                                value={job.description}
                                onChange={e => handleExperienceChange(i, 'description', e.target.value)}
                                className="bg-black text-slate-100 font-code border-slate-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-headline text-foreground">Resume</h2>
                {isAuthenticated && <Button onClick={handleEditClick}>Edit</Button>}
            </div>
            <div>
                <h3 className="text-lg font-semibold font-headline mb-2">Work Experience</h3>
                <div className="space-y-4">
                    {content.resume.experience.map((job, i) => (
                        <div key={i}>
                            <h4 className="font-bold">{job.role}</h4>
                            <p className="text-sm text-muted-foreground">{job.company} | {job.period}</p>
                            <p className="mt-1 whitespace-pre-wrap">{job.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {content.resume.education.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold font-headline mt-6 mb-2">Education</h3>
                    {content.resume.education.map((edu, i) => (
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
                    {content.resume.skills.map(skill => <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{skill}</span>)}
                </div>
            </div>
        </div>
    );
};

const ProjectsContent = ({ content }: { content: CvContent }) => (
    <div className="p-4">
        <h2 className="text-xl font-bold font-headline mb-4 text-foreground">Projects</h2>
        {content.projects.length > 0 ? (
            <div className="space-y-4">
            {content.projects.map((proj, i) => (
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

const ContactContent = ({ content }: { content: CvContent }) => (
     <div className="p-4">
        <h2 className="text-xl font-bold font-headline mb-4 text-foreground">Contact</h2>
        <p className="mb-4">You can reach me through the following channels:</p>
        <ul className="space-y-2">
            <li><a href={`mailto:${content.personalInfo.contact.email}`} className="flex items-center gap-2 hover:text-primary">{content.personalInfo.contact.email}</a></li>
            <li><a href={content.personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">LinkedIn</a></li>
            <li><a href={content.personalInfo.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">GitHub</a></li>
        </ul>
    </div>
);


const PlaceholderTerminal = () => React.Fragment;

export const APPS: App[] = [
    { id: 'about', name: 'About.txt', icon: <FileIcon color="#a7f3d0" />, component: AboutContent },
    { id: 'resume', name: 'Resume.pdf', icon: <FileIcon color="#fecaca" />, component: ResumeContent },
    { id: 'projects', name: 'Projects', icon: <FolderIcon />, component: ProjectsContent },
    { id: 'contact', name: 'Contact', icon: <FolderIcon />, component: ContactContent },
    { id: 'terminal', name: 'Terminal', icon: <TerminalAppIcon />, component: PlaceholderTerminal },
];
