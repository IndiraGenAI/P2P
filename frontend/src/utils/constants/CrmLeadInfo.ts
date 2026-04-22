export interface Course {
    id: number;
    name: string;
    categoryId: number | null;
}

export const courses: Course[] = [
    { id: 1, name: 'Not Known', categoryId: null },
    { id: 4256, name: 'GIM', categoryId: 2051 },
    { id: 4257, name: 'ITA-CS+', categoryId: 2051 },
    { id: 4258, name: 'BIZ TECH', categoryId: 2051 },
    { id: 4259, name: 'Master in Front End Design', categoryId: 2051 },
    { id: 4260, name: 'Master in Front End Development', categoryId: 2051 },
    { id: 4261, name: 'Master in Back End Development', categoryId: 2051 },
    { id: 4262, name: 'Master in Android Development', categoryId: 2051 },
    { id: 4263, name: 'Master in IOS Development', categoryId: 2051 },
    { id: 4264, name: 'Master in Flutter Development', categoryId: 2051 },
    { id: 4265, name: 'Master in Animation (1 year)', categoryId: 2051 },
    { id: 4266, name: 'Master in Animation (2 year)', categoryId: 2051 },
    { id: 4267, name: 'Master in Game Design', categoryId: 2051 },
    { id: 4268, name: 'Master in Game Development', categoryId: 2051 },
    { id: 4269, name: 'Master in Graphics Design', categoryId: 2051 },
    { id: 4270, name: 'Master in Digital Marketing', categoryId: 2051 },
    { id: 4271, name: 'Ethical Hacking (3 Months)', categoryId: 2051 },
    { id: 4272, name: 'UI-UX Design', categoryId: 2051 },
    { id: 4273, name: 'CCC', categoryId: 2051 },
    { id: 4274, name: 'C,C++', categoryId: 2051 },
    { id: 4275, name: 'Python', categoryId: 2051 },
    { id: 4276, name: 'Java', categoryId: 2051 },
    { id: 4277, name: 'PHP/Laravel', categoryId: 2051 },
    { id: 4278, name: 'React JS', categoryId: 2051 },
    { id: 4279, name: 'Angular JS', categoryId: 2051 },
    { id: 4280, name: 'Node JS', categoryId: 2051 },
    { id: 4281, name: '.Net', categoryId: 2051 },
    { id: 4282, name: 'BCA', categoryId: 2052 },
    { id: 4283, name: 'B.Sc IT', categoryId: 2052 },
    { id: 4284, name: 'B.Com', categoryId: 2052 },
    { id: 4285, name: 'BBA', categoryId: 2052 },
    { id: 4286, name: 'MCA', categoryId: 2052 },
    { id: 4287, name: 'M.Sc IT', categoryId: 2052 },
    { id: 4288, name: "Diploma in Computer Engineering", categoryId: 2052 },
    { id: 4289, name: "B.Tech Computer Engineering", categoryId: 2052 },
    { id: 4290, name: "B.Sc in Fashion", categoryId: 2053 },
    { id: 4291, name: "Advance Diploma in Fashion", categoryId: 2053 },
    { id: 4292, name: "Diploma in Fashion", categoryId: 2053 },
    { id: 4293, name: "IELTS", categoryId: 2054 },
    { id: 4294, name: "PTE", categoryId: 2054 },
    { id: 4295, name: "Spoken English", categoryId: 2054 },
    { id: 4296, name: "Poster Designing", categoryId: 2051 },
    { id: 4297, name: "Public Speaking", categoryId: 2051 },
    { id: 4298, name: "Full Stack Development", categoryId: 2051 },
    { id: 4303, name: "PHP Project Training", categoryId: 2051 },
    { id: 4304, name: "Android Project Training", categoryId: 2051 },
    { id: 4305, name: "Flutter Project Training", categoryId: 2051 },
    { id: 4306, name: "C/C++/CORE JAVA", categoryId: 2051 },
    { id: 4307, name: "C", categoryId: 2051 },
    { id: 4308, name: "C++", categoryId: 2051 },
    { id: 4309, name: "PRE GIM", categoryId: 2051 },
    { id: 4310, name: "UK Student Visa", categoryId: 2054 },
    { id: 4311, name: "Canada Student Visa", categoryId: 2054 },
    { id: 4312, name: "Student Visa", categoryId: 2054 },
    { id: 4313, name: "Work Permit", categoryId: 2054 },
    { id: 4314, name: "Python Project", categoryId: 2051 },
    { id: 4315, name: "Master in React JS", categoryId: 2051 },
    { id: 4316, name: "Master in React Native", categoryId: 2051 },
    { id: 4317, name: "Advance Python", categoryId: 2051 },
    { id: 4319, name: "MASTER IN UI/UX DESIGN & GRAPHICS DESIGN", categoryId: 2051 },
    { id: 4320, name: "BSC.CYBER", categoryId: 2052 }
];

export interface Branch {
    id: number;
    name: string;
}

export const branches: Branch[] = [
    { id: 1, name: "Not Known" },
    { id: 85, name: "RW1 - A.K Road" },
    { id: 86, name: "RW2 - Yogichowk" },
    { id: 87, name: "RW3 - Sarthana" },
    { id: 88, name: "RW4 - Mota Varachha" },
    { id: 89, name: "RW5 - Vedroad" },
    { id: 90, name: "RW6 - Adajan" },
    { id: 93, name: "RWV1 - Alkapuri, Vadodara" },
    { id: 94, name: "RWA1 - Nikol, Ahmedabad" },
    { id: 95, name: "RWA2 - Navrangpura, Ahmedabad" },
    { id: 103, name: "RWA3 - Maninangar, Ahmedabad" },
    { id: 104, name: "RW7 - Vesu" },
    { id: 105, name: "RW8 - Dindoli" },
    { id: 106, name: "RWR1 - Kalavad Road, Rajkot" },
    { id: 107, name: "RWR2 - Mavdi Chowk, Rajkot" },
    { id: 108, name: "RWA4 - Bopal, Ahmedabad" },
];

export interface Department {
    id: number;
    name: string;
}

export const departments: Department[] = [
    { id: 1, name: "Not Known" },
    { id: 2051, name: "Multimedia" },
    { id: 2052, name: "College" },
    { id: 2053, name: "Design" },
    { id: 2054, name: "International" },
];

export interface Channel {
    id: number;
    name: string;
}

export const channels: Channel[] = [
    { id: 1, name: "Telephonic Quick Add" },
    { id: 2, name: "Telephonic Missed Call" },
    { id: 7, name: "Online" },
    { id: 17, name: "Offline" },
    { id: 23, name: "Planned Meeting" },
];

export interface Source {
    id: number;
    name: string;
    channelId: number | null;
}

export const sources: Source[] = [
    { id: 14, name: "Repeated Student", channelId: null },
    { id: 60, name: "Website", channelId: 7 },
    { id: 61, name: "Sulekha", channelId: 7 },
    { id: 62, name: "JustDial", channelId: 7 },
    { id: 63, name: "Facebook", channelId: 7 },
    { id: 64, name: "Google", channelId: 7 },
    { id: 65, name: "Instagram", channelId: 7 },
    { id: 66, name: "Youtube", channelId: 7 },
    { id: 67, name: "WhatsApp", channelId: 7 },
    { id: 68, name: "Seminar", channelId: 17 },
    { id: 69, name: "Reference (Friends/Family)", channelId: 17 },
    { id: 70, name: "Hoarding", channelId: 17 },
    { id: 71, name: "Leaflet", channelId: 17 },
    { id: 72, name: "Newspaper", channelId: 17 },
    { id: 73, name: "Bulk data", channelId: 17 },
    { id: 74, name: "Expo & Exhibition", channelId: 17 },
    { id: 79, name: "Website - Surat", channelId: 7 },
    { id: 80, name: "Website - Ahmedabad", channelId: 7 },
    { id: 81, name: "Website - Vadodara", channelId: 7 },
    { id: 82, name: "Website - Rajkot", channelId: 7 },
    { id: 84, name: "Linkedin", channelId: 7 },
    { id: 85, name: "Web Chatbot", channelId: 7 },
    { id: 86, name: "Branch Banner", channelId: 17 },
    { id: 89, name: "Home Visit", channelId: 23 },
    { id: 90, name: "Exhibition", channelId: 23 },
    { id: 91, name: "Seminar", channelId: 23 },
    { id: 92, name: "College Workshop", channelId: 17 },
    { id: 93, name: "Walk-In Form", channelId: 17 },
    { id: 99, name: "Google-Website", channelId: null },
    { id: 101, name: "Telephonic Quick Add", channelId: 1 },
    { id: 102, name: "Telephonic Missed Call", channelId: 2 },
];
