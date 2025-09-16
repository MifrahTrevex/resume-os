
import type { App, CvContent, Project, Education, Referee } from './types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Mail, Linkedin, Github, Phone, Copy, Check, ExternalLink, Plus, Edit, Settings, Cpu } from 'lucide-react';
import CSSInvaders from '@/components/css-invaders';
import HackerClicker from '@/components/hacker-clicker';
import SystemOverride from '@/components/system-override';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PersonalInfo } from './types';
import { Switch } from '@/components/ui/switch';
import TaskManager from '@/components/task-manager';

const FileIcon = ({ colorClass = "text-primary/70", type = 'file' }: { colorClass?: string, type?: 'file' | 'pdf' }) => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`s-6 w-16 h-16 ${colorClass}`}>
        <defs>
            <clipPath id="clip0_806_2">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
        <g clipPath="url(#clip0_806_2)">
            <path d="M4 2L4 22L20 22L20 8L14 2L4 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M14 2L14 8L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M11 14L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 14L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 18L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 18L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
         <path d="M14 2L4 2L4 22L20 22L20 8M14 2L20 8M14 2V8H20" fill="currentColor" fillOpacity={0.1}/>
         {type === 'pdf' && (
            <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">
                PDF
            </text>
        )}
    </svg>
);


const FolderIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary/80">
        <path d="M3 20V4C3 2.89543 3.89543 2 5 2H9.37868C9.75704 2 10.1226 2.11333 10.4239 2.3219L12.4239 3.6781C12.7252 3.88667 13.0908 4 13.4691 4H19C20.1046 4 21 4.89543 21 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.1818 16.5455L12 14M12 14L13.8182 11.4545M12 14L10.1818 11.4545M12 14L13.8182 16.5455" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 20V9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
    </svg>
);


const TerminalAppIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary/80">
        <path d="M4 2L4 22L20 22L20 8L14 2L4 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
        <path d="M14 2L14 8L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 14L9 16L7 18" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18H17" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const GamepadIcon = () => (
     <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary/80">
        <path d="M9.88246 3.99997L13.2303 3.39313C17.0621 2.7037 20.242 5.92383 19.6053 9.72083L19.0606 13.1165L14.0738 12.0127L14.6185 8.61704C15.0211 6.279 13.2828 4.2208 10.9268 4.02082L9.88246 3.99997Z" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
        <path d="M12.9159 20.5186L9.56804 21.1254C5.73628 21.8149 2.55648 18.5947 3.19321 14.7977L4.25431 8.24285C4.89104 4.44585 9.15783 2.50379 12.2227 5.06452L14.0738 6.64998L19.0606 7.75375L12.9159 20.5186Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
        <path d="M19.0607 13.1165L14.0739 12.0127L9.0871 13.1165L12.9159 20.5186L19.6054 9.72083C20.2421 5.92383 17.0622 2.7037 13.2304 3.39313L12.75 3.5" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
    </svg>
);

const AdminIcon = () => (
     <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary/80">
        <path d="M19 10C21.2091 10 23 8.20914 23 6C23 3.79086 21.2091 2 19 2C16.7909 2 15 3.79086 15 6C15 8.20914 16.7909 10 19 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity={0.1}/>
        <path d="M5 22C7.20914 22 9 20.2091 9 18C9 15.7909 7.20914 14 5 14C2.79086 14 1 15.7909 1 18C1 20.2091 2.79086 22 5 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity={0.1}/>
        <path d="M14 6L10 6" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 18L10 6" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TaskManagerIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary/80">
        <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
        <path d="M7 12L10 15L17 8" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7H22" stroke="currentColor" strokeWidth="1.5"/>
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
            linkedin: "https://www.linkedin.com/in/dickens-okoth-930147248",
            github: "https://github.com/MifrahTrevex",
            phone: "(+254) 792475055",
        },
    },
    about: `I am a motivated and adaptable IT professional with a strong passion for technology and problem-solving. I take pride in my ability to learn quickly, work well under pressure, and collaborate effectively with teams to deliver reliable solutions. My hands-on experience in network troubleshooting, system maintenance, and user support has helped me develop a practical approach to solving complex challenges. I am committed to continuous learning and growth, with the goal of applying innovative IT solutions that drive efficiency and support organizational success.
`,
    interests: [
        "Exploring new technologies and open-source projects.",
        "Watching sci-fi movies and series.",
        "Playing strategy and puzzle-based video games.",
        "Reading articles on cybersecurity and digital forensics.",
        "Listening to tech podcasts.",
    ],
    details: [
        "Nationality: Kenyan",
        "Country: Kenya",
    ],
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

const InterestsContent = ({ content, onSave }: { content: CvContent; onSave: (newInterests: { interests: string[] }) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [interests, setInterests] = React.useState(content.interests.join('\n'));

    const handleSave = () => {
        onSave({ interests: interests.split('\n').filter(line => line.trim() !== '') });
        setIsEditing(false);
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold font-headline text-foreground">Personal Interests</h2>
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
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="h-48"
                        placeholder="Enter each interest on a new line."
                    />
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {content.interests.map((interest, index) => (
                            <li key={index}>{interest}</li>
                        ))}
                    </ul>
                )}
            </div>
        </ScrollArea>
    );
};

const DetailsContent = ({ content, onSave }: { content: CvContent; onSave: (newDetails: { details: string[] }) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [details, setDetails] = React.useState(content.details.join('\n'));

    const handleSave = () => {
        onSave({ details: details.split('\n').filter(line => line.trim() !== '') });
        setIsEditing(false);
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold font-headline text-foreground">Personal Details</h2>
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
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="h-48"
                        placeholder="Enter each detail on a new line."
                    />
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {content.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                        ))}
                    </ul>
                )}
            </div>
        </ScrollArea>
    );
};


const GamesFolderContent = ({ openApp, games }: { openApp: (appId: string) => void; games: App[] }) => {
    const { isAuthenticated } = useAuth();
    const visibleGames = isAuthenticated ? games : games.filter(g => g.active);

    return (
        <div className="p-4 h-full w-full grid grid-cols-4 gap-4 content-start">
            {visibleGames.map((app) => (
                <button
                    key={app.id}
                    onClick={() => openApp(app.id)}
                    className="relative flex flex-col items-center justify-start gap-1 p-2 rounded-md w-24 h-24 text-center text-white/90 transition-colors hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                    <div className="w-16 h-16 flex items-center justify-center pointer-events-none">{app.icon}</div>
                    <span className="text-sm select-none pointer-events-none">{app.name}</span>
                    {isAuthenticated && !app.active && (
                        <div className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground text-xs leading-none">
                            Off
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};

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

const PersonalFolderContent = ({ openApp }: { openApp: (appId: string) => void; }) => {
    const apps = [
        { id: 'interests', name: 'Interests.txt', icon: <FileIcon colorClass="text-foreground/70" /> },
        { id: 'details', name: 'Details.txt', icon: <FileIcon colorClass="text-foreground/70" /> },
    ];

    return (
         <div className="p-4 h-full w-full grid grid-cols-4 gap-4 content-start">
            {apps.map((app) => (
                <button
                    key={app.id}
                    onClick={() => openApp(app.id)}
                    className="relative flex flex-col items-center justify-start gap-1 p-2 rounded-md w-24 h-24 text-center text-white/90 transition-colors hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                    <div className="w-16 h-16 flex items-center justify-center pointer-events-none">{app.icon}</div>
                    <span className="text-sm select-none pointer-events-none">{app.name}</span>
                </button>
            ))}
        </div>
    );
}

const PlaceholderTerminal = () => React.Fragment;

export const initialGameApps: App[] = [
    { id: 'css-invaders', name: 'CSS Invaders', icon: <GamepadIcon />, component: CSSInvaders, isTerminal: false, active: true, parentId: 'games' },
    { id: 'data-breach', name: 'Data Breach', icon: <GamepadIcon />, component: HackerClicker, isTerminal: false, active: true, parentId: 'games' },
    { id: 'system-override', name: 'System Override', icon: <GamepadIcon />, component: SystemOverride, isTerminal: false, active: true, parentId: 'games' },
    { id: 'firewall-defender-game', name: 'Firewall Defender', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: true, parentId: 'games' },
    { id: 'tic-tac-toe-game', name: 'Tic-Tac-Toe', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: true, parentId: 'games' },
    { id: 'guess-the-number-game', name: 'Guess The Number', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false, parentId: 'games' },
    { id: 'netrun-game', name: 'NetRun', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false, parentId: 'games' },
    { id: 'mainframe-breach-game', name: 'Mainframe Breach', icon: <GamepadIcon />, component: PlaceholderTerminal, isTerminal: true, active: false, parentId: 'games' },
];

export const ALL_APPS: (cvContent: CvContent, games: App[], onGameToggle: (gameId: string) => void) => App[] = (cvContent, games, onGameToggle) => [
    { id: 'about', name: 'About.me', icon: <FileIcon colorClass="text-foreground/70" />, component: (props: any) => <AboutContent {...props} content={cvContent} /> },
    { id: 'resume', name: 'Resume.pdf', icon: <FileIcon colorClass="text-destructive/80" type="pdf"/>, component: (props: any) => <ResumeContent {...props} content={cvContent} /> },
    { id: 'projects', name: 'Projects', icon: <FolderIcon />, component: (props: any) => <ProjectsContent {...props} content={cvContent} /> },
    { id: 'contact', name: 'Contact', icon: <FolderIcon />, component: () => <ContactContent content={cvContent} /> },
    { id: 'personal', name: 'Personal', icon: <FolderIcon />, component: PersonalFolderContent },
    { id: 'interests', name: 'Interests.txt', icon: <FileIcon colorClass="text-foreground/70" />, component: (props: any) => <InterestsContent {...props} content={cvContent} />, isFolderContent: true, parentId: 'personal' },
    { id: 'details', name: 'Details.txt', icon: <FileIcon colorClass="text-foreground/70" />, component: (props: any) => <DetailsContent {...props} content={cvContent} />, isFolderContent: true, parentId: 'personal' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalAppIcon />, component: PlaceholderTerminal },
    { id: 'games', name: 'Games', icon: <FolderIcon />, component: (props: any) => <GamesFolderContent {...props} games={games} /> },
    ...games.map(g => ({...g, isFolderContent: true, parentId: 'games'})),
    { id: 'game-manager', name: 'Game Manager', icon: <AdminIcon />, component: () => <GameManagerContent games={games} onToggle={onGameToggle} /> },
    { id: 'task-manager', name: 'Task Manager', icon: <TaskManagerIcon />, component: TaskManager },
].filter((app, index, self) => index === self.findIndex((t) => (t.id === app.id)));

    
