export interface TICRecord {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  email: string;
  bio: string;
  message: string;
  photoUrl: string;
  startYear: number;
  endYear: number | null;
  achievements: string[];
  eventsConducted: string[];
  projectsGuided: string[];
}

export interface StudentLeader {
  name: string;
  role: string;
  photoUrl: string;
  email: string;
  linkedIn: string;
  bio: string;
}

export interface SessionRecord {
  id: string;
  startYear: number;
  endYear: number;
  ticId: string;
  ticName: string;
  president: StudentLeader;
  vicePresident: StudentLeader;
  secretary: StudentLeader;
  jointSecretary?: StudentLeader;
  treasurer: StudentLeader;
  roboticsHeads?: StudentLeader[];
  roboticsCoHeads?: StudentLeader[];
  contentHead?: StudentLeader;
  contentCoHead?: StudentLeader;
  seniorExecutives?: StudentLeader[];
  juniorExecutives?: StudentLeader[];
  coreTeam: StudentLeader[];
  members: string[];
  annualReportUrl?: string;
  yearbookPdfUrl?: string;
  achievements: string[];
  events: string[];
  projects: string[];
  gallery: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'robotics' | 'iot' | 'embedded' | 'ai-ml' | 'communication' | 'vlsi' | 'research';
  teamMembers: { name: string; role: string; email?: string; linkedIn?: string }[];
  technologies: string[];
  githubLink: string;
  paperLink?: string;
  demoVideoUrl?: string;
  gallery: string[];
  status: 'completed' | 'in-progress' | 'concept';
  sessionId: string;
  createdAt: string;
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'seminar' | 'lecture' | 'competition' | 'hackathon' | 'visit' | 'bootcamp';
  date: string;
  venue: string;
  speakers: { name: string; designation: string; organization: string; photoUrl?: string }[];
  bannerUrl: string;
  gallery: string[];
  attendanceCount: number;
  feedback?: { rating: number; comment: string; email: string }[];
  sessionId: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category: 'workshops' | 'competitions' | 'meetings' | 'projects' | 'visits' | 'festivals' | 'achievements';
  sessionId: string;
  uploadedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'competition' | 'hackathon' | 'publication' | 'patent' | 'scholarship' | 'internship' | 'award';
  description: string;
  team: string[];
  date: string;
  proofUrl?: string;
  year: number;
  sessionId: string;
}

export interface Alumnus {
  id: string;
  name: string;
  photoUrl: string;
  passingBatch: number;
  positionsHeld: string[];
  currentCompany: string;
  currentRole: string;
  linkedIn: string;
  email?: string;
  achievements: string[];
  approved?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: 'notes' | 'manuals' | 'papers' | 'books' | 'tools' | 'tutorials';
  description: string;
  fileUrl: string;
  downloadCount: number;
  subjectCode?: string;
  semester: number;
  uploadedAt: string;
}

// -------------------------------------------------------------
// MOCK DATA SEED
// -------------------------------------------------------------

export const mockTICRecords: TICRecord[] = [
  {
    id: "tic-1",
    name: "Dr. Jyoti Anand",
    designation: "Associate Professor, Department of Electronics",
    qualification: "Ph.D. in Microelectronics, Delhi University",
    email: "jyotianand@kmv.du.ac.in",
    bio: "Dr. Jyoti Anand has over 20 years of academic experience specializing in semiconductor physics, VLSI design, and embedded architectures. She has published numerous papers in top IEEE journals and is passionate about guiding students toward research careers.",
    message: "Welcome to ELEKTRONICA. Our society stands as a bridge between theoretical academic paradigms and hands-on industrial innovation. We encourage every electronics student to build, break, learn, and excel.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    startYear: 2024,
    endYear: null,
    achievements: [
      "Recipient of DU Best Faculty Researcher Award 2023",
      "Principal Investigator for DST-sponsored VLSI Lab Project"
    ],
    eventsConducted: [
      "National Workshop on VLSI & FPGA Prototyping (2025)",
      "Delhi University IoT Hackathon (2024)"
    ],
    projectsGuided: [
      "AeroSentinel Quadcopter (2025)",
      "RISC-V Micro-architecture Design (2024)"
    ]
  },
  {
    id: "tic-2",
    name: "Dr. Anil Kumar",
    designation: "Associate Professor, Department of Electronics",
    qualification: "Ph.D. in Optoelectronics, IIT Delhi",
    email: "anilkumar@kmv.du.ac.in",
    bio: "Dr. Anil Kumar served as the Teacher-In-Charge of ELEKTRONICA during a key period of growth in embedded systems and robotics activities. His research interest lies in optical communication systems and fiber lasers.",
    message: "Innovation is the cornerstone of engineering. ELEKTRONICA has continuously fostered a culture of deep technical engagement, and I am proud to see its legacy continue to grow.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
    startYear: 2020,
    endYear: 2024,
    achievements: [
      "Author of 'Introduction to Optoelectronics and Fiber Optics' (Academic Press)",
      "IEEE Senior Member"
    ],
    eventsConducted: [
      "Seminar on Career Paths in Communication Systems (2023)",
      "Annual Inter-College Technical Fest 'ELECTROMANIA 2022'"
    ],
    projectsGuided: [
      "Smart Crop Irrigation System (2022)",
      "Autonomous Line Following Robot with Collision Avoidance (2021)"
    ]
  }
];

export const mockStudentLeaders: Record<string, Record<string, StudentLeader>> = {
  "2026-27": {
    president: {
      name: "Siddharth Sharma",
      role: "President",
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      email: "siddharth.elec@gmail.com",
      linkedIn: "https://linkedin.com/in/siddharth-sharma",
      bio: "Robotics geek, embedded firmware developer. Enthusiastic about Edge AI, brushless motor control, and RTOS configurations."
    },
    vicePresident: {
      name: "Ananya Kapoor",
      role: "Vice President",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      email: "ananya.kapoor@gmail.com",
      linkedIn: "https://linkedin.com/in/ananya-kapoor",
      bio: "IoT systems developer. Works on sensor mesh networking, low-power telemetry, and cloud dashboard integrations."
    },
    secretary: {
      name: "Aryan Goel",
      role: "Secretary",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      email: "aryan.goel@gmail.com",
      linkedIn: "https://linkedin.com/in/aryan-goel",
      bio: "Enthusiastic PCB designer and analog circuit troubleshooter. Specializes in Altium Designer and high-speed routing."
    },
    treasurer: {
      name: "Ishita Verma",
      role: "Treasurer",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
      email: "ishita.verma@gmail.com",
      linkedIn: "https://linkedin.com/in/ishita-verma",
      bio: "VLSI designer. Interested in CMOS layout, digital logic verification, and digital signal processing on FPGAs."
    }
  }
};

export const mockCoreTeam2026: StudentLeader[] = [
  {
    name: "Kabir Mehta",
    role: "Technical Head",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    email: "kabir.mehta@gmail.com",
    linkedIn: "https://linkedin.com/in/kabir-mehta",
    bio: "Python wizard and Machine Learning enthusiast. Integrating AI algorithms with microcontroller edge units."
  },
  {
    name: "Riya Sen",
    role: "Event Coordinator Head",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    email: "riya.sen@gmail.com",
    linkedIn: "https://linkedin.com/in/riya-sen",
    bio: "Operations coordinator. Manages partnerships, speakers, logistics, and inter-college event setups."
  },
  {
    name: "Vikram Malhotra",
    role: "PR & Outreach Head",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    email: "vikram.malhotra@gmail.com",
    linkedIn: "https://linkedin.com/in/vikram-malhotra",
    bio: "Communications strategist. Elevates public relations, handles official social handles, and drives registrations."
  },
  {
    name: "Meera Nair",
    role: "Design & Media Head",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    email: "meera.nair@gmail.com",
    linkedIn: "https://linkedin.com/in/meera-nair",
    bio: "Creative lead. Focuses on premium poster design, website UX feedback, brand aesthetic guidelines, and event photography."
  }
];

export const mockSessions: SessionRecord[] = [
  {
    id: "2026-27",
    startYear: 2026,
    endYear: 2027,
    ticId: "tic-1",
    ticName: "Dr. Jyoti Anand",
    president: mockStudentLeaders["2026-27"].president,
    vicePresident: mockStudentLeaders["2026-27"].vicePresident,
    secretary: mockStudentLeaders["2026-27"].secretary,
    jointSecretary: {
      name: "Divya Teja",
      role: "Joint Secretary",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
      email: "divya.teja@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Active embedded programmer. Enthusiastic about micro-mouse projects and motor controller assemblies."
    },
    treasurer: mockStudentLeaders["2026-27"].treasurer,
    roboticsHeads: [
      {
        name: "Kabir Mehta",
        role: "Robotics Head",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
        email: "kabir.mehta@gmail.com",
        linkedIn: "https://linkedin.com",
        bio: "Specializes in kinematics, control algorithms, and ROS navigation nodes."
      },
      {
        name: "Rohan Kapoor",
        role: "Robotics Head",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300",
        email: "rohan.k@gmail.com",
        linkedIn: "https://linkedin.com",
        bio: "Specializes in custom SMT circuit designs, sensor networks, and mechanical chassis design."
      }
    ],
    roboticsCoHeads: [
      {
        name: "Aryan Goel",
        role: "Robotics Co-Head",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
        email: "aryan.goel@gmail.com",
        linkedIn: "https://linkedin.com",
        bio: "Passionate about sensor calibrations, PCB layouts, and 3D printing custom mounts."
      },
      {
        name: "Neha Bansal",
        role: "Robotics Co-Head",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
        email: "neha.bansal@gmail.com",
        linkedIn: "https://linkedin.com",
        bio: "Develops obstacle avoidance codes and servo-feedback linkages."
      }
    ],
    contentHead: {
      name: "Meera Nair",
      role: "Content Head",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
      email: "meera.nair@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Technical writer. Drafts research summaries, newsletters, and maintains public document archives."
    },
    contentCoHead: {
      name: "Ishita Verma",
      role: "Content Co-Head",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300",
      email: "ishita.verma@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Focuses on documentation of schematics, repository READMEs, and technical blog posts."
    },
    seniorExecutives: [
      { name: "Varun Joshi", role: "Senior Executive", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300", email: "varun@gmail.com", linkedIn: "https://linkedin.com", bio: "Assists with hardware logistics and components acquisition." },
      { name: "Sanya Arora", role: "Senior Executive", photoUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=300", email: "sanya@gmail.com", linkedIn: "https://linkedin.com", bio: "Works on public relationships and inter-college invitations." },
      { name: "Dhruv Taneja", role: "Senior Executive", photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300", email: "dhruv@gmail.com", linkedIn: "https://linkedin.com", bio: "Assists with coding workshops and repository maintenance." },
      { name: "Sneha Sen", role: "Senior Executive", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300", email: "snehasen@gmail.com", linkedIn: "https://linkedin.com", bio: "Manages social media content, flyers, and event announcements." }
    ],
    juniorExecutives: [
      { name: "Kunal Dixit", role: "Junior Executive", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300", email: "kunal@gmail.com", linkedIn: "https://linkedin.com", bio: "Volunteers for lab inventory setups and component sorting." },
      { name: "Anjali Mishra", role: "Junior Executive", photoUrl: "https://images.unsplash.com/photo-1558203728-00f45181dd84?q=80&w=300", email: "anjali@gmail.com", linkedIn: "https://linkedin.com", bio: "Assists with event registrations and session feedback collections." },
      { name: "Tarun Roy", role: "Junior Executive", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300", email: "tarun@gmail.com", linkedIn: "https://linkedin.com", bio: "Volunteers in circuit building and breadboard soldering drills." },
      { name: "Mehak Chawla", role: "Junior Executive", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300", email: "mehak@gmail.com", linkedIn: "https://linkedin.com", bio: "Handles visual recordings and media backups during workshops." }
    ],
    coreTeam: mockCoreTeam2026,
    members: [
      "Raghav Gupta", "Priya Sethi", "Aayush Sharma", "Karan Malhotra", "Ridhi Bhatia"
    ],
    achievements: ["ach-1", "ach-2"],
    events: ["evt-1", "evt-2"],
    projects: ["proj-1", "proj-2", "proj-3"],
    gallery: ["gal-1", "gal-2", "gal-3"]
  },
  {
    id: "2025-26",
    startYear: 2025,
    endYear: 2026,
    ticId: "tic-1",
    ticName: "Dr. Jyoti Anand",
    president: {
      name: "Rohan Kapoor",
      role: "President",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
      email: "rohan.kapoor@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Interested in high-speed microcontrollers and sensor integration. Led society to 3 inter-college trophy wins."
    },
    vicePresident: {
      name: "Meera Nair",
      role: "Vice President",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
      email: "meera.nair@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Focuses on signal integrity and PCB RF designs. Managed relations for inter-college hackathons."
    },
    secretary: {
      name: "Siddharth Sharma",
      role: "Secretary",
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      email: "siddharth.elec@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Robotics developer and team mentor. Handled official college communications."
    },
    treasurer: {
      name: "Sanya Gupta",
      role: "Treasurer",
      photoUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=300&auto=format&fit=crop",
      email: "sanya.gupta@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Embedded programmer with focus on RTOS operations and VLSI system simulations."
    },
    coreTeam: [],
    members: ["Jatin Sood", "Prerna Jain", "Abhishek Khurana", "Mehak Chawla"],
    achievements: ["ach-3"],
    events: ["evt-3"],
    projects: ["proj-4"],
    gallery: ["gal-4"]
  },
  {
    id: "2024-25",
    startYear: 2024,
    endYear: 2025,
    ticId: "tic-2",
    ticName: "Dr. Anil Kumar",
    president: {
      name: "Tanmay Singhal",
      role: "President",
      photoUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=300&auto=format&fit=crop",
      email: "tanmay.singh@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Hardware generalist. Built multiple custom autonomous drone units. Curated open lab spaces."
    },
    vicePresident: {
      name: "Rohan Kapoor",
      role: "Vice President",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
      email: "rohan.k@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Microcontroller engineer focusing on STM32 ARM cores."
    },
    secretary: {
      name: "Priyanka Vats",
      role: "Secretary",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
      email: "priyanka.v@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Communications lead. Guided multiple workshops on introductory PCB designs."
    },
    treasurer: {
      name: "Lakshya Khanna",
      role: "Treasurer",
      photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
      email: "lakshya.k@gmail.com",
      linkedIn: "https://linkedin.com",
      bio: "Analog circuitry developer. Optimized society event budgets."
    },
    coreTeam: [],
    members: ["Jatin Sood", "Abhinav Singh", "Manoj Kumar", "Tania Sen"],
    achievements: ["ach-4"],
    events: ["evt-4"],
    projects: ["proj-5"],
    gallery: []
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "AeroSentinel: Autonomous Quadcopter with Edge AI",
    description: "An autonomous surveillance drone featuring on-board companion computing using Nvidia Jetson Nano. Executes lightweight YOLO algorithms for real-time person detection, custom obstacle avoidance protocols, and long-range telemetry mapping.",
    category: "robotics",
    teamMembers: [
      { name: "Siddharth Sharma", role: "Hardware & Flight Controller Integration" },
      { name: "Kabir Mehta", role: "Edge AI Model Optimization" }
    ],
    technologies: ["STM32", "Nvidia Jetson Nano", "Python", "ROS 2", "YOLO v8", "Pixhawk PX4"],
    githubLink: "https://github.com/elektronica-kmv/aerosentinel-drone",
    demoVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop"
    ],
    status: "completed",
    sessionId: "2026-27",
    createdAt: "2026-04-12T10:00:00Z",
    featured: true
  },
  {
    id: "proj-2",
    name: "NeuroLink: Gesture-Controlled Prosthetic Hand",
    description: "A low-cost 3D-printed bionic prosthetic hand. Acquires surface electromyography (sEMG) bio-signals from the user's forearm, processes them via filtering and scaling, and maps them to a multi-servo actuator matrix to perform daily gripping gestures.",
    category: "embedded",
    teamMembers: [
      { name: "Aryan Goel", role: "Analog Signal Conditioning & PCB Design" },
      { name: "Ananya Kapoor", role: "Servo Actuator Firmware Development" }
    ],
    technologies: ["Arduino Nano", "sEMG Sensor", "SolidWorks", "Altium Designer", "C++"],
    githubLink: "https://github.com/elektronica-kmv/neurolink-bionic-hand",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
    ],
    status: "in-progress",
    sessionId: "2026-27",
    createdAt: "2026-05-18T14:30:00Z",
    featured: true
  },
  {
    id: "proj-3",
    name: "SolarMesh: IoT Environmental Sensing Network",
    description: "A self-powered outdoor telemetry system. Utilizes ESP32 nodes communicating over an ESP-NOW wireless mesh network. Each node harvests solar power, reports relative humidity, PM2.5 particles, temperature, and UV Index, and relays data to a central Raspberry Pi gateway.",
    category: "iot",
    teamMembers: [
      { name: "Ananya Kapoor", role: "Mesh Protocol Setup & Solar Harvester" },
      { name: "Ishita Verma", role: "Web Dashboard & Relational Schema" }
    ],
    technologies: ["ESP32", "ESP-NOW", "Raspberry Pi", "InfluxDB", "Grafana", "MPPT Circuits"],
    githubLink: "https://github.com/elektronica-kmv/solarmesh-iot",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
    ],
    status: "completed",
    sessionId: "2026-27",
    createdAt: "2026-03-05T09:00:00Z",
    featured: false
  },
  {
    id: "proj-4",
    name: "8-Bit RISC-V Custom Softcore Processor",
    description: "An educational softcore microprocessor architecture programmed in Verilog HDL. Standard Harvard memory system, single-cycle execute architecture, supporting a core subset of the RV32I ISA, successfully synthesized and benchmarked on a Xilinx Artix-7 FPGA.",
    category: "vlsi",
    teamMembers: [
      { name: "Sanya Gupta", role: "Instruction Decoder & ALU Design" },
      { name: "Rohan Kapoor", role: "FPGA Benchmarking & Clock Dividers" }
    ],
    technologies: ["Verilog HDL", "Xilinx Vivado", "Artix-7 FPGA", "ModelSim"],
    githubLink: "https://github.com/elektronica-kmv/riscv-8bit-softcore",
    gallery: [
      "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?q=80&w=600&auto=format&fit=crop"
    ],
    status: "completed",
    sessionId: "2025-26",
    createdAt: "2025-11-20T12:00:00Z",
    featured: true
  },
  {
    id: "proj-5",
    name: "LiFi Audio Transmission System",
    description: "An optical communication link capable of wireless audio streaming. Modulates sound signals into high-frequency light pulses via a power-MOSFET driving an LED array, received and demodulated via a photodiode-amplification circuit.",
    category: "communication",
    teamMembers: [
      { name: "Tanmay Singhal", role: "Transmitter & Analog Amplifiers" },
      { name: "Lakshya Khanna", role: "Receiver Demodulator & Speaker Coupling" }
    ],
    technologies: ["Analog Op-Amps", "Power MOSFETs", "Laser Diodes", "LDR/Photodiode"],
    githubLink: "https://github.com/elektronica-kmv/lifi-audio-transceiver",
    gallery: [],
    status: "completed",
    sessionId: "2024-25",
    createdAt: "2024-10-15T10:00:00Z",
    featured: false
  }
];

export const mockEvents: Event[] = [
  {
    id: "evt-1",
    title: "InnovateX 2027: Inter-College Robotics Challenge",
    description: "Our annual robotics arena event, challenging teams across the Delhi NCR region to construct autonomous maze-solving and heavy-lift RC bots. Supported by 12 major university engineering groups.",
    category: "competition",
    date: "2027-02-18T10:00:00Z",
    venue: "College Auditorium & Sports Plaza",
    speakers: [
      { name: "Mr. Ramesh Adhikari", designation: "Lead Systems Engineer", organization: "DRDO Robotics Division" }
    ],
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop"
    ],
    attendanceCount: 180,
    feedback: [
      { rating: 5, comment: "Incredible tracks! The organization and timing were flawless.", email: "stud1@gmail.com" }
    ],
    sessionId: "2026-27"
  },
  {
    id: "evt-2",
    title: "Practical PCB Design & Prototyping Workshop",
    description: "A two-day intensive boot camp covering the complete manufacturing workflow of modern printed circuit boards. Students designed schematic layouts, executed custom routing in Altium Designer, and physically etched a double-sided board.",
    category: "workshop",
    date: "2026-10-10T09:30:00Z",
    venue: "Department Electronics Lab 2",
    speakers: [
      { name: "Dr. Jyoti Anand", designation: "Associate Professor", organization: "Keshav Mahavidyalaya" }
    ],
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
    ],
    attendanceCount: 45,
    sessionId: "2026-27"
  },
  {
    id: "evt-3",
    title: "Introduction to Edge AI and TinyML Systems",
    description: "A specialized seminar detailing the compression of deep neural network architectures to run on microcontroller units (MCUs) using TensorFlow Lite for Microcontrollers.",
    category: "lecture",
    date: "2025-11-14T11:00:00Z",
    venue: "Seminar Room 102",
    speakers: [
      { name: "Dr. Sumit Vats", designation: "AI Researcher", organization: "Microsoft Research India" }
    ],
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    gallery: [],
    attendanceCount: 95,
    sessionId: "2025-26"
  },
  {
    id: "evt-4",
    title: "Industrial Visit to Sahasra Electronics Plant",
    description: "A hands-on facility visit to Sahasra Electronics SMT plant in Noida. Students experienced the functioning of pick-and-place systems, solder stencil machines, reflow ovens, and quality inspections.",
    category: "visit",
    date: "2025-02-22T08:00:00Z",
    venue: "Sahasra SMT Facility, Noida",
    speakers: [
      { name: "Mr. V. K. Gupta", designation: "Operations Director", organization: "Sahasra Electronics" }
    ],
    bannerUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    gallery: [],
    attendanceCount: 35,
    sessionId: "2024-25"
  }
];

export const mockGallery: GalleryImage[] = [
  {
    id: "gal-1",
    title: "InnovateX 2027 - Drone Pit Stop",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
    category: "projects",
    sessionId: "2026-27",
    uploadedAt: "2027-02-18T18:00:00Z"
  },
  {
    id: "gal-2",
    title: "PCB Design Workshop - Hardware Assembly",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    category: "workshops",
    sessionId: "2026-27",
    uploadedAt: "2026-10-10T17:00:00Z"
  },
  {
    id: "gal-3",
    title: "Core Committee Meeting 2026",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    category: "meetings",
    sessionId: "2026-27",
    uploadedAt: "2026-08-15T12:00:00Z"
  },
  {
    id: "gal-4",
    title: "TinyML Seminar - Question Round",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    category: "meetings",
    sessionId: "2025-26",
    uploadedAt: "2025-11-14T14:00:00Z"
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "First Position at Delhi University Tech Fest Robotics Challenge",
    category: "competition",
    description: "Siddharth Sharma and team secured the first position with their autonomous maze-solving micro-mouse bot at the annual cluster event.",
    team: ["Siddharth Sharma", "Aryan Goel", "Dhruv Taneja"],
    date: "2027-03-02",
    year: 2027,
    sessionId: "2026-27"
  },
  {
    id: "ach-2",
    title: "Best Innovation Award - DU Innovation Summit 2026",
    category: "award",
    description: "Awarded to the NeuroLink bionic arm project for its low cost and potential to assist disabled individuals.",
    team: ["Aryan Goel", "Ananya Kapoor"],
    date: "2026-11-05",
    year: 2026,
    sessionId: "2026-27"
  },
  {
    id: "ach-3",
    title: "Published Paper in IEEE Global Conference on IoT 2025",
    category: "publication",
    description: "A research publication on ESP-NOW mesh sensors for urban heat island mappings, co-authored with department faculty guidance.",
    team: ["Ananya Kapoor", "Dr. Jyoti Anand"],
    date: "2025-12-18",
    year: 2025,
    sessionId: "2025-26"
  },
  {
    id: "ach-4",
    title: "First Runner-up at HackDelhi National Hackathon",
    category: "hackathon",
    description: "Secured runner-up position in smart infrastructure domain by building a real-time energy tracking smart socket node.",
    team: ["Rohan Kapoor", "Tanmay Singhal"],
    date: "2025-01-20",
    year: 2025,
    sessionId: "2024-25"
  }
];

export const mockAlumni: Alumnus[] = [
  {
    id: "alum-1",
    name: "Tanmay Singhal",
    photoUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=300&auto=format&fit=crop",
    passingBatch: 2025,
    positionsHeld: ["President (2024-25)", "Technical Member (2023-24)"],
    currentCompany: "STMicroelectronics",
    currentRole: "Associate Embedded Firmware Engineer",
    linkedIn: "https://linkedin.com",
    email: "tanmay.singh@gmail.com",
    achievements: ["Led drone build operations", "Created 5 basic lab tutorials"]
  },
  {
    id: "alum-2",
    name: "Priyanka Vats",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
    passingBatch: 2025,
    positionsHeld: ["Secretary (2024-25)"],
    currentCompany: "Intel Corporation",
    currentRole: "Hardware Validation Intern",
    linkedIn: "https://linkedin.com",
    achievements: ["Organized industry expert talks", "Coordinated SMT plant visit"]
  },
  {
    id: "alum-3",
    name: "Lakshya Khanna",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    passingBatch: 2025,
    positionsHeld: ["Treasurer (2024-25)"],
    currentCompany: "Texas Instruments",
    currentRole: "Analog Design Engineer",
    linkedIn: "https://linkedin.com",
    achievements: ["Designed analog optical receiver modules", "Scored 9.8 CGPA in B.Sc. Electronics"]
  }
];

export const mockResources: Resource[] = [
  {
    id: "res-1",
    title: "Microprocessors & Microcontrollers Lab Manual",
    category: "manuals",
    description: "Official laboratory guide detailing assembly programming for Intel 8085 and basic register operations of 8051 controllers.",
    fileUrl: "#",
    downloadCount: 142,
    subjectCode: "ELHP-401",
    semester: 4,
    uploadedAt: "2026-01-10T12:00:00Z"
  },
  {
    id: "res-2",
    title: "Digital Signal Processing Lecture Notes",
    category: "notes",
    description: "Detailed, hand-written notes covering DFT, FFT, Z-transforms, and analog filter design algorithms.",
    fileUrl: "#",
    downloadCount: 89,
    subjectCode: "ELHP-502",
    semester: 5,
    uploadedAt: "2025-07-22T10:00:00Z"
  },
  {
    id: "res-3",
    title: "Introduction to VHDL & FPGA Prototyping",
    category: "tutorials",
    description: "Quick tutorial document mapping basic logic gates to VHDL code structures, with synthesis configurations in Vivado.",
    fileUrl: "#",
    downloadCount: 210,
    subjectCode: "ELHP-603",
    semester: 6,
    uploadedAt: "2025-12-05T09:00:00Z"
  },
  {
    id: "res-4",
    title: "Department of Electronics Research Paper: IoT Mesh Nodes",
    category: "papers",
    description: "Archived PDF of the published mesh network paper covering outdoor sensor power optimizations.",
    fileUrl: "#",
    downloadCount: 65,
    semester: 6,
    uploadedAt: "2025-12-18T18:00:00Z"
  }
];

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockContactMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Aarav Gupta",
    email: "aarav.gupta@gmail.com",
    subject: "Inquiry about IoT Workshop registration",
    message: "Hello team, I wanted to ask if registrations are open for the upcoming Microcontroller workshop next week. I am from the CS department. Thank you!",
    timestamp: "2026-06-18T10:30:00Z",
    read: false
  },
  {
    id: "msg-2",
    name: "Professor Sneha Sharma",
    email: "sneha.sharma@du.ac.in",
    subject: "Speaker invitation for National Conference",
    message: "Dear Teachers-in-Charge, we would love to invite the robotics team of ELEKTRONICA to demonstrate their AeroSentinel Drone project at our department conference next month.",
    timestamp: "2026-06-17T14:15:00Z",
    read: true
  }
];

