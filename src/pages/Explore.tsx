
import { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/mock-data';
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = ['all', ...Array.from(new Set(projects.map(p => p.industry)))];

  const filteredProjects = projects.filter(project => {
    const searchContent = `${project.projectName} ${project.projectDescription}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || project.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Explorar Proyectos</h1>
        <p className="mt-4 text-lg text-muted-foreground">Explora las ideas que están naciendo en tu universidad y otros campus. Encuentra un proyecto que te apasione y aporta tu talento.</p>
      </div>

      <div className="my-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por palabra clave..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setSelectedIndustry} defaultValue="all">
          <SelectTrigger className="w-full md:w-[280px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por rubro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los rubros</SelectItem>
            {industries.filter(i => i !== 'all').map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold">No se encontraron proyectos</h3>
            <p className="text-muted-foreground mt-2">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
