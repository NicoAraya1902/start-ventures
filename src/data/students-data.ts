export interface Student {
  id: string;
  name: string;
  age: number;
  university: string;
  degree: string;
  year: number;
  skills: string[];
  interests: string[];
  description: string;
  profileImageUrl: string;
  lookingFor: string;
  experience: string[];
  location: string;
  availability: 'Full-time' | 'Part-time' | 'Weekends only';
  contact: {
    email: string;
    linkedin?: string;
    github?: string;
  };
}

export const students: Student[] = [
  {
    id: 's1',
    name: 'María González',
    age: 22,
    university: 'Universidad Politécnica de Madrid',
    degree: 'Ingeniería Informática',
    year: 4,
    skills: ['React', 'Node.js', 'Python', 'MongoDB'],
    interests: ['FinTech', 'IA', 'Blockchain'],
    description: 'Apasionada por el desarrollo full-stack y la inteligencia artificial. Busco co-fundadores para crear una startup de FinTech que democratice las inversiones.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Co-fundador técnico y especialista en marketing',
    experience: ['Prácticas en Amazon', 'Hackathon winner 2024'],
    location: 'Madrid',
    availability: 'Part-time',
    contact: {
      email: 'maria.gonzalez@estudiante.upm.es',
      linkedin: 'linkedin.com/in/mariagonzalez',
      github: 'github.com/mariagonzalez'
    }
  },
  {
    id: 's2',
    name: 'Carlos Ruiz',
    age: 21,
    university: 'ESADE Business School',
    degree: 'Administración de Empresas',
    year: 3,
    skills: ['Marketing Digital', 'Análisis Financiero', 'Ventas', 'Estrategia'],
    interests: ['E-commerce', 'Moda Sostenible', 'Marketing'],
    description: 'Estudiante de negocios con experiencia en marketing digital. Busco cofundadores técnicos para lanzar una plataforma de moda sostenible.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Desarrollador full-stack y diseñador UX/UI',
    experience: ['CMO en startup estudiantil', 'Consultoría en McKinsey (summer intern)'],
    location: 'Barcelona',
    availability: 'Full-time',
    contact: {
      email: 'carlos.ruiz@esade.edu',
      linkedin: 'linkedin.com/in/carlosruiz'
    }
  },
  {
    id: 's3',
    name: 'Ana Martín',
    age: 23,
    university: 'Universidad Complutense Madrid',
    degree: 'Diseño Digital',
    year: 4,
    skills: ['Figma', 'Adobe Creative Suite', 'Prototipado', 'Research'],
    interests: ['EdTech', 'Salud Digital', 'UX/UI'],
    description: 'Diseñadora UX/UI especializada en aplicaciones móviles. Interesada en proyectos de impacto social, especialmente en educación y salud.',
    profileImageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Desarrolladores y experto en educación',
    experience: ['Diseñadora freelance', 'UI/UX en startup EdTech'],
    location: 'Madrid',
    availability: 'Part-time',
    contact: {
      email: 'ana.martin@ucm.es',
      linkedin: 'linkedin.com/in/anamartin'
    }
  },
  {
    id: 's4',
    name: 'David López',
    age: 20,
    university: 'Universidad de Barcelona',
    degree: 'Ingeniería de Datos',
    year: 2,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    interests: ['IA', 'Data Science', 'HealthTech'],
    description: 'Especialista en ciencia de datos e IA. Busco equipo para desarrollar soluciones de salud digital basadas en machine learning.',
    profileImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Experto en salud y desarrollador mobile',
    experience: ['Investigación en IA médica', 'Kaggle competitions'],
    location: 'Barcelona',
    availability: 'Weekends only',
    contact: {
      email: 'david.lopez@ub.edu',
      github: 'github.com/davidlopez'
    }
  },
  {
    id: 's5',
    name: 'Laura Sánchez',
    age: 22,
    university: 'IE Business School',
    degree: 'Emprendimiento e Innovación',
    year: 4,
    skills: ['Estrategia', 'Pitch', 'Fundraising', 'Lean Startup'],
    interests: ['CleanTech', 'Sostenibilidad', 'Impact Investing'],
    description: 'Emprendedora con experiencia en fundraising y desarrollo de negocios. Busco cofundadores técnicos para crear soluciones sostenibles.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Ingeniero ambiental y desarrollador',
    experience: ['Fundadora de 2 startups', 'Pitch competition winner'],
    location: 'Madrid',
    availability: 'Full-time',
    contact: {
      email: 'laura.sanchez@ie.edu',
      linkedin: 'linkedin.com/in/laurasanchez'
    }
  },
  {
    id: 's6',
    name: 'Miguel Torres',
    age: 21,
    university: 'Universidad Politécnica de Valencia',
    degree: 'Ingeniería de Videojuegos',
    year: 3,
    skills: ['Unity', 'C#', 'Blender', 'Game Design'],
    interests: ['Gaming', 'AR/VR', 'EdTech'],
    description: 'Desarrollador de videojuegos interesado en crear experiencias educativas inmersivas. Busco equipo para desarrollar juegos educativos con AR/VR.',
    profileImageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Experto en educación y artista 3D',
    experience: ['Desarrollador indie', 'Ganador GameJam Valencia'],
    location: 'Valencia',
    availability: 'Part-time',
    contact: {
      email: 'miguel.torres@upv.es',
      github: 'github.com/migueltorres'
    }
  }
];