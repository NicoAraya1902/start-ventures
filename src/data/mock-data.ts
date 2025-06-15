
export interface Role {
  roleId: string;
  roleTitle: string;
  roleDescription: string;
  requiredSkills: string[];
  status: 'Abierto' | 'Cerrado';
}

export interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectStage: 'Idea / Conceptualización' | 'Prototipo / MVP' | 'En Desarrollo Activo' | 'Beta / Pruebas' | 'Lanzado y Escalando';
  technologies: string[];
  projectImageUrl: string;
  roles: Role[];
  industry: string;
}

export const projects: Project[] = [
  {
    projectId: 'p1',
    projectName: 'App de Finanzas Personales con IA',
    projectDescription: 'Una aplicación móvil que utiliza IA para ofrecer asesoramiento financiero personalizado, seguimiento de presupuestos y oportunidades de inversión. Nuestro objetivo es hacer que la educación financiera sea accesible para todos.',
    projectStage: 'Prototipo / MVP',
    technologies: ['React Native', 'Firebase', 'Plaid API', 'TypeScript'],
    projectImageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    industry: 'Fintech',
    roles: [
      { roleId: 'r1-1', roleTitle: 'Desarrollador Móvil (React Native)', roleDescription: 'Liderar el desarrollo de nuestra aplicación móvil multiplataforma.', requiredSkills: ['React Native', 'TypeScript', 'Firebase'], status: 'Abierto' },
      { roleId: 'r1-2', roleTitle: 'Diseñador/a UI/UX', roleDescription: 'Diseñar una interfaz de usuario intuitiva y atractiva.', requiredSkills: ['Figma', 'User Research', 'Prototyping'], status: 'Abierto' },
    ],
  },
  {
    projectId: 'p2',
    projectName: 'Marketplace Ecológico',
    projectDescription: 'Una plataforma de comercio electrónico dedicada a conectar consumidores con productos sostenibles y ecológicos. Nuestra misión es promover el consumo consciente y apoyar a pequeñas empresas éticas.',
    projectStage: 'Idea / Conceptualización',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    projectImageUrl: 'https://images.unsplash.com/photo-1542601906-823862b36a73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    industry: 'E-commerce',
    roles: [
      { roleId: 'r2-1', roleTitle: 'Desarrollador/a Full-Stack', roleDescription: 'Construir la plataforma principal desde cero usando Next.js y PostgreSQL.', requiredSkills: ['Next.js', 'React', 'Node.js', 'SQL'], status: 'Abierto' },
      { roleId: 'r2-2', roleTitle: 'Especialista en Marketing', roleDescription: 'Desarrollar y ejecutar nuestra estrategia de lanzamiento al mercado.', requiredSkills: ['SEO', 'Content Marketing', 'Social Media'], status: 'Abierto' },
    ],
  },
  {
    projectId: 'p3',
    projectName: "Juego Indie: 'Vagabundo Cósmico'",
    projectDescription: 'Un juego de aventuras 2D en pixel-art ambientado en una galaxia misteriosa generada proceduralmente. Los jugadores exploran, comercian y descubren secretos antiguos. Somos un equipo pequeño apasionado por la narrativa y los RPG clásicos.',
    projectStage: 'En Desarrollo Activo',
    technologies: ['Unity', 'C#', 'Blender', 'Aseprite'],
    projectImageUrl: 'https://images.unsplash.com/photo-1588723957936-d5b74a8d057d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    industry: 'Videojuegos',
    roles: [
      { roleId: 'r3-1', roleTitle: 'Desarrollador/a de Videojuegos (Unity)', roleDescription: 'Implementar las mecánicas y sistemas centrales del juego en Unity.', requiredSkills: ['Unity', 'C#', 'Game Physics'], status: 'Abierto' },
      { roleId: 'r3-2', roleTitle: 'Artista de Pixel Art', roleDescription: 'Crear personajes, entornos y recursos gráficos.', requiredSkills: ['Pixel Art', 'Aseprite', 'Animation'], status: 'Abierto' },
    ],
  },
  {
    projectId: 'p4',
    projectName: 'Aura Moda Sostenible',
    projectDescription: 'Una marca de moda directa al consumidor enfocada en crear ropa atemporal de alta calidad con materiales sostenibles. Buscamos socios para ayudar a construir nuestra identidad de marca, gestionar nuestra cadena de suministro y lanzar nuestra primera colección.',
    projectStage: 'Idea / Conceptualización',
    technologies: ['Branding', 'E-commerce', 'Social Media Marketing', 'Supply Chain'],
    projectImageUrl: 'https://images.unsplash.com/photo-1523359364024-5d88351b5b85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    industry: 'Moda Sostenible',
    roles: [
      { roleId: 'r4-1', roleTitle: 'Líder de Marca y Marketing', roleDescription: 'Desarrollar la estrategia de marca y liderar los esfuerzos de marketing para nuestro lanzamiento.', requiredSkills: ['Branding', 'Digital Marketing', 'Content Creation'], status: 'Abierto' },
      { roleId: 'r4-2', roleTitle: 'Gerente de Operaciones y Cadena de Suministro', roleDescription: 'Buscar materiales sostenibles y gestionar el proceso de producción.', requiredSkills: ['Supply Chain Management', 'Vendor Relations', 'Sustainability'], status: 'Abierto' },
    ],
  },
];
