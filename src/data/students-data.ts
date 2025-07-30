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
  region: string;
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
    university: 'Universidad de Chile',
    degree: 'Ingeniería Civil Industrial',
    year: 4,
    skills: ['React', 'Node.js', 'Python', 'MongoDB'],
    interests: ['FinTech', 'IA', 'Blockchain'],
    description: 'Apasionada por el desarrollo full-stack y la inteligencia artificial. Busco co-fundadores para crear una startup de FinTech que democratice las inversiones.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Co-fundador técnico y especialista en marketing',
    experience: ['Prácticas en Falabella', 'Hackathon winner Santiago 2024'],
    location: 'Santiago',
    region: 'Metropolitana',
    availability: 'Part-time',
    contact: {
      email: 'maria.gonzalez@ug.uchile.cl',
      linkedin: 'linkedin.com/in/mariagonzalez',
      github: 'github.com/mariagonzalez'
    }
  },
  {
    id: 's2',
    name: 'Carlos Ruiz',
    age: 21,
    university: 'Pontificia Universidad Católica de Chile',
    degree: 'Ingeniería Comercial',
    year: 3,
    skills: ['Marketing Digital', 'Análisis Financiero', 'Ventas', 'Estrategia'],
    interests: ['E-commerce', 'Moda Sostenible', 'Marketing'],
    description: 'Estudiante de ingeniería comercial con experiencia en marketing digital. Busco cofundadores técnicos para lanzar una plataforma de moda sostenible.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Desarrollador full-stack y diseñador UX/UI',
    experience: ['CMO en startup estudiantil', 'Consultoría en EY (práctica profesional)'],
    location: 'Santiago',
    region: 'Metropolitana',
    availability: 'Full-time',
    contact: {
      email: 'carlos.ruiz@uc.cl',
      linkedin: 'linkedin.com/in/carlosruiz'
    }
  },
  {
    id: 's3',
    name: 'Ana Martín',
    age: 23,
    university: 'Universidad Diego Portales',
    degree: 'Diseño Digital',
    year: 4,
    skills: ['Figma', 'Adobe Creative Suite', 'Prototipado', 'Research'],
    interests: ['EdTech', 'Salud Digital', 'UX/UI'],
    description: 'Diseñadora UX/UI especializada en aplicaciones móviles. Interesada en proyectos de impacto social, especialmente en educación y salud.',
    profileImageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Desarrolladores y experto en educación',
    experience: ['Diseñadora freelance', 'UI/UX en startup EdTech chilena'],
    location: 'Santiago',
    region: 'Metropolitana',
    availability: 'Part-time',
    contact: {
      email: 'ana.martin@udp.cl',
      linkedin: 'linkedin.com/in/anamartin'
    }
  },
  {
    id: 's4',
    name: 'David López',
    age: 20,
    university: 'Universidad Técnica Federico Santa María',
    degree: 'Ingeniería Civil Informática',
    year: 2,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    interests: ['IA', 'Data Science', 'HealthTech'],
    description: 'Especialista en ciencia de datos e IA. Busco equipo para desarrollar soluciones de salud digital basadas en machine learning.',
    profileImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Experto en salud y desarrollador mobile',
    experience: ['Investigación en IA médica', 'Kaggle competitions'],
    location: 'Valparaíso',
    region: 'Valparaíso',
    availability: 'Weekends only',
    contact: {
      email: 'david.lopez@usm.cl',
      github: 'github.com/davidlopez'
    }
  },
  {
    id: 's5',
    name: 'Laura Sánchez',
    age: 22,
    university: 'Universidad Adolfo Ibáñez',
    degree: 'Ingeniería en Innovación y Emprendimiento',
    year: 4,
    skills: ['Estrategia', 'Pitch', 'Fundraising', 'Lean Startup'],
    interests: ['CleanTech', 'Sostenibilidad', 'Impact Investing'],
    description: 'Emprendedora con experiencia en fundraising y desarrollo de negocios. Busco cofundadores técnicos para crear soluciones sostenibles.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Ingeniero ambiental y desarrollador',
    experience: ['Fundadora de 2 startups', 'Pitch competition winner Corfo'],
    location: 'Santiago',
    region: 'Metropolitana',
    availability: 'Full-time',
    contact: {
      email: 'laura.sanchez@uai.cl',
      linkedin: 'linkedin.com/in/laurasanchez'
    }
  },
  {
    id: 's6',
    name: 'Miguel Torres',
    age: 21,
    university: 'Universidad de Concepción',
    degree: 'Ingeniería Civil Informática',
    year: 3,
    skills: ['Unity', 'C#', 'Blender', 'Game Design'],
    interests: ['Gaming', 'AR/VR', 'EdTech'],
    description: 'Desarrollador de videojuegos interesado en crear experiencias educativas inmersivas. Busco equipo para desarrollar juegos educativos con AR/VR.',
    profileImageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Experto en educación y artista 3D',
    experience: ['Desarrollador indie', 'Ganador GameJam Concepción'],
    location: 'Concepción',
    region: 'Biobío',
    availability: 'Part-time',
    contact: {
      email: 'miguel.torres@udec.cl',
      github: 'github.com/migueltorres'
    }
  },
  {
    id: 's7',
    name: 'Camila Vargas',
    age: 23,
    university: 'Universidad de La Frontera',
    degree: 'Ingeniería en Biotecnología',
    year: 4,
    skills: ['Biotecnología', 'Investigación', 'Análisis de Datos', 'Python'],
    interests: ['BioTech', 'AgTech', 'Innovación'],
    description: 'Biotecnóloga especializada en investigación aplicada. Busco equipo para desarrollar soluciones biotecnológicas para la agricultura chilena.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Desarrollador de software y experto en agro',
    experience: ['Investigación en INIA', 'Becaria CONICYT'],
    location: 'Temuco',
    region: 'Araucanía',
    availability: 'Part-time',
    contact: {
      email: 'camila.vargas@ufrontera.cl',
      linkedin: 'linkedin.com/in/camilavargas'
    }
  },
  {
    id: 's8',
    name: 'Felipe Morales',
    age: 20,
    university: 'Universidad Católica del Norte',
    degree: 'Ingeniería en Sistemas',
    year: 2,
    skills: ['Blockchain', 'Solidity', 'Web3', 'React'],
    interests: ['Crypto', 'DeFi', 'Web3'],
    description: 'Desarrollador blockchain especializado en DeFi. Busco formar equipo para crear soluciones financieras descentralizadas para Latinoamérica.',
    profileImageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lookingFor: 'Especialista en finanzas y marketing',
    experience: ['Smart contracts developer', 'Hackathon ETH Santiago'],
    location: 'Antofagasta',
    region: 'Antofagasta',
    availability: 'Weekends only',
    contact: {
      email: 'felipe.morales@ucn.cl',
      github: 'github.com/felipemorales'
    }
  }
];