
import type { App, CvContent, Project, Education, Referee } from './types';
import React, from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Mail, Linkedin, Github, Phone, Copy, Check, ExternalLink, Plus } from 'lucide-react';
import CSSInvaders from '@/components/css-invaders';
import DesktopIcon from '@/components/desktop-icon';
import HackerClicker from '@/components/hacker-clicker';
import SystemOverride from '@/components/system-override';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
);

const GamepadIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="#2A2A2A"/>
        <path d="M24 30H18V36H24V30Z" fill="#4ade80"/>
        <path d="M21 27V39" stroke="#4ade80" strokeWidth="2"/>
        <circle cx="40" cy="36" r="3" fill="#4ade80"/>
        <circle cx="46" cy="30" r="3" fill="#4ade80"/>
    </svg>
);

const HackerAvatar = () => (
    <svg width="128" height="128" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8ZM14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8Z" fill="hsl(var(--foreground))" fillOpacity="0.5"/>
        <path d="M12 14C16.4183 14 20 15.7909 20 18V20H4V18C4 15.7909 7.58172 14 12 14Z" fill="hsl(var(--primary))"/>
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.6234 2.4045 15.1442 3.10107 16.4699C4.98151 14.9613 8.27317 14 12 14C15.7268 14 19.0185 14.9613 20.8989 16.4699C21.5955 15.1442 22 13.6234 22 12C22 6.47715 17.5228 2 12 2Z" fill="hsl(var(--foreground))" />
    </svg>
);


export const initialCvContent: CvContent = {
    personalInfo: {
        name: "Dickens Okoth Otieno",
        title: "IT Professional",
        contact: {
            email: "dickenokoth@gmail.com",
            linkedin: "https://www.linkedin.com/in/dickens-okoth-930147248",
            github: "https://github.com/MifrahTrevex",
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
        education: [
            {
                degree: "Diploma in Information Communication Technology",
                institution: "The Cooperative University of Kenya",
                period: "2021 - 2024",
            }
        ],
        skills: [
            "Technical Support", "Troubleshooting Hardware & Software", "Computer hardware and Software Components",
            "Basic Networking configuration and maintenance", "Windows and Linux Operating Systems",
            "Productivity tools( Microsoft Office Suite and Google Workspace", "Cybersecurity Fundamentals",
            "Communication and teamwork", "Problem solving and Critical thinking"
        ],
        referees: [
             {
                name: "Available Upon Request",
                title: "",
                contact: "",
            }
        ]
    },
    projects: [],
};


const AboutContent = ({ content, onSave }: { content: CvContent; onSave: (newContent: string) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [about, setAbout] = React.useState(content.about);

    const handleSave = () => {
        onSave(about);
        setIsEditing(false);
    }
    
    return (
        <ScrollArea className="h-full">
            <div className="p-4 h-full flex flex-col">
                <Card className="bg-card/50">
                    <CardHeader className="items-center text-center">
                         <div className="rounded-full border-4 border-primary/50" data-ai-hint="hacker avatar">
                            <HackerAvatar />
                        </div>
                        <CardTitle className="text-2xl pt-2">{content.personalInfo.name}</CardTitle>
                        <CardDescription>{content.personalInfo.title}</CardDescription>
                         <div className="flex items-center gap-4 pt-2">
                            <Button asChild variant="ghost" size="icon">
                                <a href={content.personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin />
                                </a>
                            </Button>
                             <Button asChild variant="ghost" size="icon">
                                <a href={content.personalInfo.contact.github} target="_blank" rel="noopener noreferrer">
                                    <Github />
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold font-headline text-foreground">About Me</h2>
                            {isAuthenticated && !isEditing && (
                                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                            )}
                            {isAuthenticated && isEditing && (
                                <Button onClick={handleSave}>Save</Button>
                            )}
                        </div>
                        {isEditing && isAuthenticated ? (
                             <Textarea 
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="flex-grow bg-input text-accent font-code border-border focus:ring-ring h-48"
                             />
                        ) : (
                            <p className="whitespace-pre-wrap text-sm">{content.about}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
};

const ResumeContent = ({ content, onSave }: { content: CvContent; onSave: (newContent: CvContent['resume']) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [resume, setResume] = React.useState(content.resume);
    
    const handleSave = () => {
        onSave(resume);
        setIsEditing(false);
    }

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const newExperience = [...resume.experience];
        (newExperience[index] as any)[field] = value;
        setResume({...resume, experience: newExperience});
    }
    const addExperience = () => setResume({...resume, experience: [...resume.experience, { role: '', company: '', period: '', description: '' }]});
    const removeExperience = (index: number) => setResume({...resume, experience: resume.experience.filter((_, i) => i !== index) });

    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...resume.education];
        newEducation[index][field] = value;
        setResume({...resume, education: newEducation});
    }
    const addEducation = () => setResume({...resume, education: [...resume.education, { degree: '', institution: '', period: '' }]});
    const removeEducation = (index: number) => setResume({...resume, education: resume.education.filter((_, i) => i !== index) });

    const handleRefereeChange = (index: number, field: keyof Referee, value: string) => {
        const newReferees = [...resume.referees];
        newReferees[index][field] = value;
        setResume({...resume, referees: newReferees});
    }
    const addReferee = () => setResume({...resume, referees: [...resume.referees, { name: '', title: '', contact: '' }]});
    const removeReferee = (index: number) => setResume({...resume, referees: resume.referees.filter((_, i) => i !== index) });


    if (isEditing && isAuthenticated) {
        return (
            <div className="p-4 space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-headline text-foreground">Edit Resume</h2>
                    <Button onClick={handleSave}>Save</Button>
                </div>
                <ScrollArea className="flex-grow pr-4">
                    {/* Experience Editing */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold font-headline">Work Experience</h3>
                            <Button variant="outline" size="sm" onClick={addExperience}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                        {resume.experience.map((job, i) => (
                            <div key={i} className="space-y-2 border-b border-border pb-4 mb-4 relative">
                                <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeExperience(i)}><Trash2 size={14} /></Button>
                                <Label>Role</Label><Input value={job.role} onChange={e => handleExperienceChange(i, 'role', e.target.value)} className="bg-input"/>
                                <Label>Company</Label><Input value={job.company} onChange={e => handleExperienceChange(i, 'company', e.target.value)} className="bg-input"/>
                                <Label>Period</Label><Input value={job.period} onChange={e => handleExperienceChange(i, 'period', e.target.value)} className="bg-input"/>
                                <Label>Description</Label><Textarea value={job.description} onChange={e => handleExperienceChange(i, 'description', e.target.value)} className="bg-input"/>
                            </div>
                        ))}
                    </div>

                    {/* Education Editing */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold font-headline">Education</h3>
                            <Button variant="outline" size="sm" onClick={addEducation}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                        {resume.education.map((edu, i) => (
                            <div key={i} className="space-y-2 border-b border-border pb-4 mb-4 relative">
                                <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeEducation(i)}><Trash2 size={14} /></Button>
                                <Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleEducationChange(i, 'degree', e.target.value)} className="bg-input"/>
                                <Label>Institution</Label><Input value={edu.institution} onChange={e => handleEducationChange(i, 'institution', e.target.value)} className="bg-input"/>
                                <Label>Period</Label><Input value={edu.period} onChange={e => handleEducationChange(i, 'period', e.target.value)} className="bg-input"/>
                            </div>
                        ))}
                    </div>

                    {/* Referees Editing */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold font-headline">Referees</h3>
                            <Button variant="outline" size="sm" onClick={addReferee}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                        {resume.referees.map((ref, i) => (
                            <div key={i} className="space-y-2 border-b border-border pb-4 mb-4 relative">
                                <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeReferee(i)}><Trash2 size={14} /></Button>
                                <Label>Name</Label><Input value={ref.name} onChange={e => handleRefereeChange(i, 'name', e.target.value)} className="bg-input"/>
                                <Label>Title/Company</Label><Input value={ref.title} onChange={e => handleRefereeChange(i, 'title', e.target.value)} className="bg-input"/>
                                <Label>Contact (Email/Phone)</Label><Input value={ref.contact} onChange={e => handleRefereeChange(i, 'contact', e.target.value)} className="bg-input"/>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-headline text-foreground">Resume</h2>
                    {isAuthenticated && <Button onClick={() => setIsEditing(true)}>Edit</Button>}
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
                         <div className="space-y-4">
                            {content.resume.education.map((edu, i) => (
                                <div key={i}>
                                    <h4 className="font-bold">{edu.degree}</h4>
                                    <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold font-headline mt-6 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {content.resume.skills.map(skill => <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{skill}</span>)}
                    </div>
                </div>

                {content.resume.referees.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold font-headline mt-6 mb-2">Referees</h3>
                        <div className="space-y-4">
                            {content.resume.referees.map((ref, i) => (
                                <div key={i}>
                                    <h4 className="font-bold">{ref.name}</h4>
                                    <p className="text-sm text-muted-foreground">{ref.title}</p>
                                    <p className="text-sm text-muted-foreground">{ref.contact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

const ProjectsContent = ({ content, onSave }: { content: CvContent, onSave: (newProjects: Project[]) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [projects, setProjects] = React.useState(content.projects);

    const handleSave = () => {
        onSave(projects);
        setIsEditing(false);
    };

    const handleProjectChange = (index: number, field: keyof Project, value: string) => {
        const newProjects = [...projects];
        if (field === 'tech') {
            newProjects[index][field] = value.split(',').map(s => s.trim());
        } else {
            (newProjects[index] as any)[field] = value;
        }
        setProjects(newProjects);
    };

    const addProject = () => {
        setProjects([...projects, { title: '', description: '', tech: [], link: '' }]);
    };

    const removeProject = (index: number) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects);
    };

    if (isEditing && isAuthenticated) {
        return (
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-headline text-foreground">Edit Projects</h2>
                    <div className="flex gap-2">
                        <Button onClick={addProject}>Add Project</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
                <ScrollArea className="flex-grow pr-4">
                    {projects.map((proj, i) => (
                        <div key={i} className="space-y-2 border-b border-border pb-4 mb-4 relative">
                            <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-7 w-7" onClick={() => removeProject(i)}>
                                <Trash2 size={16} />
                            </Button>
                            <Label>Title</Label>
                            <Input
                                value={proj.title}
                                onChange={e => handleProjectChange(i, 'title', e.target.value)}
                                className="bg-input text-accent font-code border-border"
                            />
                            <Label>Description</Label>
                            <Textarea
                                value={proj.description}
                                onChange={e => handleProjectChange(i, 'description', e.target.value)}
                                className="bg-input text-accent font-code border-border"
                            />
                            <Label>Technologies (comma-separated)</Label>
                            <Input
                                value={proj.tech.join(', ')}
                                onChange={e => handleProjectChange(i, 'tech', e.target.value)}
                                className="bg-input text-accent font-code border-border"
                            />
                            <Label>Link</Label>
                            <Input
                                value={proj.link}
                                onChange={e => handleProjectChange(i, 'link', e.target.value)}
                                className="bg-input text-accent font-code border-border"
                            />
                        </div>
                    ))}
                </ScrollArea>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-headline text-foreground">Projects</h2>
                    {isAuthenticated && <Button onClick={() => setIsEditing(true)}>Edit</Button>}
                </div>
                {content.projects.length > 0 ? (
                    <div className="space-y-4">
                        {content.projects.map((proj, i) => (
                            <Card key={i} className="bg-card/50">
                                <CardHeader>
                                    <CardTitle>{proj.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{proj.description}</p>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {proj.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                                    </div>
                                    {proj.link && (
                                        <Button asChild variant="link" className="p-0 h-auto">
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer">
                                                View Project <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>No projects listed yet. Log in to add some!</p>
                )}
            </div>
        </ScrollArea>
    );
};

const ContactContent = ({ content }: { content: CvContent }) => {
    const [copiedItem, setCopiedItem] = React.useState<string | null>(null);

    const handleCopy = (text: string, itemName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(itemName);
        setTimeout(() => setCopiedItem(null), 2000); // Reset after 2 seconds
    };
    
    const contact = content.personalInfo.contact;

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold font-headline text-foreground">Contact Information</h2>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span>{contact.email}</span>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(contact.email, 'email')}>
                        {copiedItem === 'email' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span>{contact.phone}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(contact.phone, 'phone')}>
                        {copiedItem === 'phone' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                    <span>LinkedIn</span>
                </a>
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Github className="w-5 h-5 text-muted-foreground" />
                    <span>GitHub</span>
                </a>
            </div>
        </div>
    );
};


const GamesFolderContent = ({ openApp }: { openApp: (appId: string) => void }) => {
    const ICONS_PER_ROW = 4;
    const ICON_WIDTH = 96; // Corresponds to w-24
    const ICON_HEIGHT = 96; // Corresponds to h-24
    const PADDING = 16; // Corresponds to p-4

    return (
        <div className="relative p-4 h-full w-full">
            {GAME_APPS.map((app, index) => {
                const row = Math.floor(index / ICONS_PER_ROW);
                const col = index % ICONS_PER_ROW;
                const initialPosition = {
                    x: col * (ICON_WIDTH + PADDING),
                    y: row * (ICON_HEIGHT + PADDING),
                };
                return (
                    <DesktopIcon
                        key={app.id}
                        name={app.name}
                        icon={app.icon}
                        onClick={() => openApp(app.id)}
                        initialPosition={initialPosition}
                    />
                );
            })}
        </div>
    );
};


const PlaceholderTerminal = () => React.Fragment;

export const GAME_APPS: App[] = [
    { id: 'css-invaders', name: 'CSS Invaders', icon: <GamepadIcon />, component: CSSInvaders, isTerminal: false },
    { id: 'data-breach', name: 'Data Breach', icon: <GamepadIcon />, component: HackerClicker, isTerminal: false },
    { id: 'system-override', name: 'System Override', icon: <GamepadIcon />, component: SystemOverride, isTerminal: false },
    { id: 'firewall-defender-game', name: 'Firewall Defender', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true },
    { id: 'tic-tac-toe-game', name: 'Tic-Tac-Toe', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true },
    { id: 'guess-the-number-game', name: 'Guess The Number', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true },
    { id: 'netrun-game', name: 'NetRun', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true },
    { id: 'mainframe-breach-game', name: 'Mainframe Breach', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true },
];

export const APPS: App[] = [
    { id: 'about', name: 'About.txt', icon: <FileIcon color="#a7f3d0" />, component: AboutContent },
    { id: 'resume', name: 'Resume.pdf', icon: <FileIcon color="#fecaca" />, component: ResumeContent },
    { id: 'projects', name: 'Projects', icon: <FolderIcon />, component: ProjectsContent },
    { id: 'contact', name: 'Contact', icon: <FolderIcon />, component: ContactContent },
    { id: 'terminal', name: 'Terminal', icon: <TerminalAppIcon />, component: PlaceholderTerminal },
    { id: 'games', name: 'Games', icon: <FolderIcon />, component: GamesFolderContent },
];

    

      

    




    