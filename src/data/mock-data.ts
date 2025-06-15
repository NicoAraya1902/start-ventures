
export interface Role {
  roleId: string;
  roleTitle: string;
  roleDescription: string;
  requiredSkills: string[];
  status: 'Open' | 'Closed';
}

export interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectStage: 'Idea / Conceptualization' | 'Prototype / MVP' | 'In Active Development' | 'Beta / Testing' | 'Launched & Scaling';
  technologies: string[];
  projectImageUrl: string;
  roles: Role[];
}

export const projects: Project[] = [
  {
    projectId: 'p1',
    projectName: 'AI-Powered Personal Finance App',
    projectDescription: 'A mobile-first application that uses AI to provide personalized financial advice, budget tracking, and investment opportunities. We aim to make financial literacy accessible to everyone.',
    projectStage: 'Prototype / MVP',
    technologies: ['React Native', 'Firebase', 'Plaid API', 'TypeScript'],
    projectImageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    roles: [
      { roleId: 'r1-1', roleTitle: 'Mobile Developer (React Native)', roleDescription: 'Lead the development of our cross-platform mobile app.', requiredSkills: ['React Native', 'TypeScript', 'Firebase'], status: 'Open' },
      { roleId: 'r1-2', roleTitle: 'UI/UX Designer', roleDescription: 'Design an intuitive and engaging user interface.', requiredSkills: ['Figma', 'User Research', 'Prototyping'], status: 'Open' },
    ],
  },
  {
    projectId: 'p2',
    projectName: 'Eco-Friendly Marketplace',
    projectDescription: 'An e-commerce platform dedicated to connecting consumers with sustainable and eco-friendly products. Our mission is to promote conscious consumerism and support small, ethical businesses.',
    projectStage: 'Idea / Conceptualization',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    projectImageUrl: 'https://images.unsplash.com/photo-1542601906-823862b36a73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    roles: [
      { roleId: 'r2-1', roleTitle: 'Full-Stack Developer', roleDescription: 'Build the core platform from scratch using Next.js and PostgreSQL.', requiredSkills: ['Next.js', 'React', 'Node.js', 'SQL'], status: 'Open' },
      { roleId: 'r2-2', roleTitle: 'Marketing Specialist', roleDescription: 'Develop and execute our go-to-market strategy.', requiredSkills: ['SEO', 'Content Marketing', 'Social Media'], status: 'Open' },
    ],
  },
  {
    projectId: 'p3',
    projectName: "Indie Game: 'Cosmic Wanderer'",
    projectDescription: 'A 2D pixel-art adventure game set in a mysterious, procedurally generated galaxy. Players explore, trade, and uncover ancient secrets. We are a small team passionate about storytelling and classic RPGs.',
    projectStage: 'In Active Development',
    technologies: ['Unity', 'C#', 'Blender', 'Aseprite'],
    projectImageUrl: 'https://images.unsplash.com/photo-1588723957936-d5b74a8d057d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    roles: [
      { roleId: 'r3-1', roleTitle: 'Game Developer (Unity)', roleDescription: 'Implement core game mechanics and systems in Unity.', requiredSkills: ['Unity', 'C#', 'Game Physics'], status: 'Open' },
      { roleId: 'r3-2', roleTitle: 'Pixel Artist', roleDescription: 'Create characters, environments, and assets.', requiredSkills: ['Pixel Art', 'Aseprite', 'Animation'], status: 'Open' },
    ],
  },
];
