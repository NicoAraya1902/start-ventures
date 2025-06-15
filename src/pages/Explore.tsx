
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/mock-data';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

const Explore = () => {
  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Explorar Proyectos</h1>
        <p className="mt-4 text-lg text-muted-foreground">Explora las ideas que están naciendo en tu universidad y otros campus. Encuentra un proyecto que te apasione y aporta tu talento.</p>
      </div>

      <div className="my-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Buscar por palabra clave..." className="pl-10" />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
