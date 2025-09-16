
import type { App, CvContent, Project, Education, Referee } from './types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Mail, Linkedin, Github, Phone, Copy, Check, ExternalLink, Plus, Edit, Settings } from 'lucide-react';
import CSSInvaders from '@/components/css-invaders';
import DesktopIcon from '@/components/desktop-icon';
import HackerClicker from '@/components/hacker-clicker';
import SystemOverride from '@/components/system-override';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PersonalInfo } from './types';
import { Switch } from '@/components/ui/switch';


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

const AdminIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="#4A5568"/>
        <path d="M32 36C36.4183 36 40 32.4183 40 28C40 23.5817 36.4183 20 32 20C27.5817 20 24 23.5817 24 28C24 32.4183 27.5817 36 32 36Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 44C27 44 24.5 41.5 22 39" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 44C37 44 39.5 41.5 42 39" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42.001 24.0005L44.8294 25.4147L46.2436 28.2431L44.8294 31.0715L42.001 32.4857L39.1726 31.0715L37.7584 28.2431L39.1726 25.4147L42.001 24.0005Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22.001 24.0005L24.8294 25.4147L26.2436 28.2431L24.8294 31.0715L22.001 32.4857L19.1726 31.0715L17.7584 28.2431L19.1726 25.4147L22.001 24.0005Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        name: "DICKENS OKOTH OTIENO",
        title: "IT Professional",
        imageUrl: "",
        contact: {
            email: "dickenokoth@gmail.com",
            linkedin: "www.linkedin.com/in/dickens-okoth-930147248",
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
                degree: "Bachelor in Information Security and Forensics",
                institution: "KCA University",
                period: "2021 - 2025",
            },
            {
                degree: "KCSE (Final Grade: B plain)",
                institution: "Onjiko Boys Highschool",
                period: "2017 - 2020",
            },
            {
                degree: "KCPE (Final Grade: 368)",
                institution: "Sigoti Primary School",
                period: "2015 - 2016",
            },
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


const AboutContent = ({ content, onSave }: { content: CvContent; onSave: (newContent: Partial<CvContent>) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [about, setAbout] = React.useState(content.about);
    const [personalInfo, setPersonalInfo] = React.useState(content.personalInfo);

    const handleSave = () => {
        onSave({ about, personalInfo });
        setIsEditing(false);
    }
    
    const handlePersonalInfoChange = (field: keyof PersonalInfo | keyof PersonalInfo['contact'], value: string) => {
        if (['email', 'linkedin', 'github', 'phone'].includes(field)) {
             setPersonalInfo(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
        } else {
            setPersonalInfo(prev => ({ ...prev, [field]: value as any }));
        }
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-4 h-full flex flex-col">
                <Card className="bg-card/50">
                    <CardHeader className="items-center text-center">
                        <div className="rounded-full border-4 border-primary/50" data-ai-hint="hacker avatar">
                            {personalInfo.imageUrl ? <img src={personalInfo.imageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover" /> : <HackerAvatar />}
                        </div>
                        
                        {isEditing && isAuthenticated ? (
                            <div className="w-full space-y-2 mt-4">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={personalInfo.name} onChange={(e) => handlePersonalInfoChange('name', e.target.value)} />
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={personalInfo.title} onChange={(e) => handlePersonalInfoChange('title', e.target.value)} />
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input id="imageUrl" value={personalInfo.imageUrl} onChange={(e) => handlePersonalInfoChange('imageUrl', e.target.value)} />
                            </div>
                        ) : (
                            <>
                                <CardTitle className="text-2xl pt-2">{personalInfo.name}</CardTitle>
                                <CardDescription>{personalInfo.title}</CardDescription>
                            </>
                        )}
                        
                        <div className="flex items-center gap-4 pt-2">
                            {isEditing && isAuthenticated ? (
                                <div className="w-full space-y-2 text-left">
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <Input id="linkedin" value={personalInfo.contact.linkedin} onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} />
                                    <Label htmlFor="github">GitHub URL</Label>
                                    <Input id="github" value={personalInfo.contact.github} onChange={(e) => handlePersonalInfoChange('github', e.target.value)} />
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={personalInfo.contact.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} />
                                     <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={personalInfo.contact.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} />
                                </div>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="icon">
                                        <a href={personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin />
                                        </a>
                                    </Button>
                                    <Button asChild variant="ghost" size="icon">
                                        <a href={personalInfo.contact.github} target="_blank" rel="noopener noreferrer">
                                            <Github />
                                        </a>
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold font-headline text-foreground">About Me</h2>
                            {isAuthenticated && !isEditing && (
                                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                            )}
                            {isAuthenticated && isEditing && (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSave}>Save</Button>
                                </div>
                            )}
                        </div>
                        {isEditing && isAuthenticated ? (
                             <Textarea 
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="h-48"
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
    const [isEditing, setIsEditing] = React.useState<string | null>(null);
    const [resume, setResume] = React.useState(content.resume);
    
    const handleSectionSave = () => {
        onSave(resume);
        setIsEditing(null);
    };

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
    
    const handleSkillsChange = (value: string) => {
        setResume({...resume, skills: value.split(',').map(s => s.trim())});
    }

    const handleRefereeChange = (index: number, field: keyof Referee, value: string) => {
        const newReferees = [...resume.referees];
        newReferees[index][field] = value;
        setResume({...resume, referees: newReferees});
    }
    const addReferee = () => setResume({...resume, referees: [...resume.referees, { name: '', title: '', contact: '' }]});
    const removeReferee = (index: number) => setResume({...resume, referees: resume.referees.filter((_, i) => i !== index) });

    const renderEditSection = (title: string, data: any[], addFn: () => void, removeFn: (i: number) => void, changeFn: (i: number, f: any, v: string) => void, fields: {key: string, label: string, type?: 'textarea'}[]) => {
        return (
            <div className="p-4 space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-headline text-foreground">Edit {title}</h2>
                    <div>
                        <Button variant="outline" onClick={() => setIsEditing(null)} className="mr-2">Cancel</Button>
                        <Button onClick={handleSectionSave}>Save</Button>
                    </div>
                </div>
                 <ScrollArea className="flex-grow pr-4">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold font-headline">{title}</h3>
                            <Button variant="outline" size="sm" onClick={addFn}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                        {data.map((item, i) => (
                            <div key={i} className="space-y-2 border-b border-border pb-4 mb-4 relative">
                                <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeFn(i)}><Trash2 size={14} /></Button>
                                {fields.map(field => (
                                    <div key={field.key}>
                                        <Label>{field.label}</Label>
                                        {field.type === 'textarea' ? (
                                            <Textarea value={item[field.key]} onChange={e => changeFn(i, field.key as any, e.target.value)} />
                                        ) : (
                                            <Input value={item[field.key]} onChange={e => changeFn(i, field.key as any, e.target.value)} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    if (isEditing) {
        switch (isEditing) {
            case 'experience':
                return renderEditSection('Work Experience', resume.experience, addExperience, removeExperience, handleExperienceChange, [
                    { key: 'role', label: 'Role' },
                    { key: 'company', label: 'Company' },
                    { key: 'period', label: 'Period' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                ]);
            case 'education':
                return renderEditSection('Education', resume.education, addEducation, removeEducation, handleEducationChange, [
                    { key: 'degree', label: 'Degree/Certificate' },
                    { key: 'institution', label: 'Institution' },
                    { key: 'period', label: 'Period' },
                ]);
            case 'skills':
                 return (
                    <div className="p-4 space-y-6 h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold font-headline text-foreground">Edit Skills</h2>
                            <div>
                                <Button variant="outline" onClick={() => setIsEditing(null)} className="mr-2">Cancel</Button>
                                <Button onClick={handleSectionSave}>Save</Button>
                            </div>
                        </div>
                        <Label>Skills (comma-separated)</Label>
                        <Textarea value={resume.skills.join(', ')} onChange={e => handleSkillsChange(e.target.value)} className="h-48" />
                    </div>
                );
            case 'referees':
                return renderEditSection('Referees', resume.referees, addReferee, removeReferee, handleRefereeChange, [
                    { key: 'name', label: 'Name' },
                    { key: 'title', label: 'Title/Company' },
                    { key: 'contact', label: 'Contact (Email/Phone)' },
                ]);
            default:
                setIsEditing(null);
                return null;
        }
    }


    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold font-headline">Work Experience</h3>
                         {isAuthenticated && <Button size="sm" variant="outline" onClick={() => setIsEditing('experience')}><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
                    </div>
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
                         <div className="flex justify-between items-center mt-6 mb-2">
                            <h3 className="text-lg font-semibold font-headline">Education</h3>
                            {isAuthenticated && <Button size="sm" variant="outline" onClick={() => setIsEditing('education')}><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
                        </div>
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
                    <div className="flex justify-between items-center mt-6 mb-2">
                        <h3 className="text-lg font-semibold font-headline">Skills</h3>
                         {isAuthenticated && <Button size="sm" variant="outline" onClick={() => setIsEditing('skills')}><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {content.resume.skills.map(skill => <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{skill}</span>)}
                    </div>
                </div>

                {content.resume.referees.length > 0 && (
                     <div>
                        <div className="flex justify-between items-center mt-6 mb-2">
                            <h3 className="text-lg font-semibold font-headline">Referees</h3>
                            {isAuthenticated && <Button size="sm" variant="outline" onClick={() => setIsEditing('referees')}><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
                        </div>
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
                        <Button onClick={addProject}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
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
                            />
                            <Label>Description</Label>
                            <Textarea
                                value={proj.description}
                                onChange={e => handleProjectChange(i, 'description', e.target.value)}
                            />
                            <Label>Technologies (comma-separated)</Label>
                            <Input
                                value={proj.tech.join(', ')}
                                onChange={e => handleProjectChange(i, 'tech', e.target.value)}
                            />
                            <Label>Link</Label>
                            <Input
                                value={proj.link}
                                onChange={e => handleProjectChange(i, 'link', e.target.value)}
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
                    {isAuthenticated && <Button onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Projects</Button>}
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


const GamesFolderContent = React.memo(({ openApp, games }: { openApp: (appId: string) => void; games: App[] }) => {
    const { isAuthenticated } = useAuth();
    const ICONS_PER_ROW = 4;
    const ICON_WIDTH = 96;
    const ICON_HEIGHT = 96;
    const PADDING = 16;

    const visibleGames = isAuthenticated ? games : games.filter(g => g.active);

    return (
        <div className="relative p-4 h-full w-full">
            {visibleGames.map((app, index) => {
                const row = Math.floor(index / ICONS_PER_ROW);
                const col = index % ICONS_PER_ROW;
                const initialPosition = {
                    x: col * (ICON_WIDTH + PADDING),
                    y: row * (ICON_HEIGHT + PADDING),
                };
                return (
                    <div key={app.id} className="relative">
                        <DesktopIcon
                            name={app.name}
                            icon={app.icon}
                            onClick={() => openApp(app.id)}
                            initialPosition={initialPosition}
                        />
                        {isAuthenticated && !app.active && (
                            <div className="absolute top-0 right-0 p-1 bg-destructive rounded-full text-destructive-foreground text-xs" style={{ top: initialPosition.y, left: initialPosition.x + ICON_WIDTH - 20}}>
                                Off
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

GamesFolderContent.displayName = 'GamesFolderContent';

const GameManagerContent = ({ games, onToggle }: { games: App[], onToggle: (gameId: string) => void }) => {
    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle>Game Manager</CardTitle>
                        <CardDescription>Activate or deactivate games for visitors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {games.map(game => (
                                <div key={game.id} className="flex items-center justify-between p-2 border rounded-md">
                                    <Label htmlFor={`switch-${game.id}`}>{game.name}</Label>
                                    <Switch
                                        id={`switch-${game.id}`}
                                        checked={game.active}
                                        onCheckedChange={() => onToggle(game.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
};


const PlaceholderTerminal = () => React.Fragment;

export const initialGameApps: App[] = [
    { id: 'css-invaders', name: 'CSS Invaders', icon: <GamepadIcon />, component: CSSInvaders, isTerminal: false, active: true },
    { id: 'data-breach', name: 'Data Breach', icon: <GamepadIcon />, component: HackerClicker, isTerminal: false, active: true },
    { id: 'system-override', name: 'System Override', icon: <GamepadIcon />, component: SystemOverride, isTerminal: false, active: true },
    { id: 'firewall-defender-game', name: 'Firewall Defender', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: true },
    { id: 'tic-tac-toe-game', name: 'Tic-Tac-Toe', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: true },
    { id: 'guess-the-number-game', name: 'Guess The Number', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false },
    { id: 'netrun-game', name: 'NetRun', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false },
    { id: 'mainframe-breach-game', name: 'Mainframe Breach', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false },
];

export const ALL_APPS: (cvContent: CvContent, games: App[], onGameToggle: (gameId: string) => void) => App[] = (cvContent, games, onGameToggle) => [
    { id: 'about', name: 'About.txt', icon: <FileIcon color="#a7f3d0" />, component: (props: any) => <AboutContent {...props} content={cvContent} /> },
    { id: 'resume', name: 'Resume.pdf', icon: <FileIcon color="#fecaca" />, component: (props: any) => <ResumeContent {...props} content={cvContent} /> },
    { id: 'projects', name: 'Projects', icon: <FolderIcon />, component: (props: any) => <ProjectsContent {...props} content={cvContent} /> },
    { id: 'contact', name: 'Contact', icon: <FolderIcon />, component: () => <ContactContent content={cvContent} /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalAppIcon />, component: PlaceholderTerminal },
    { id: 'games', name: 'Games', icon: <FolderIcon />, component: (props: any) => <GamesFolderContent {...props} games={games} /> },
    { id: 'game-manager', name: 'Game Manager', icon: <AdminIcon />, component: () => <GameManagerContent games={games} onToggle={onGameToggle} /> },
];
