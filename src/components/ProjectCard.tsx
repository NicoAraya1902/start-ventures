
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/data/mock-data';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-4">
            <img src={project.projectImageUrl} alt={project.projectName} className="w-full h-full object-cover" />
        </div>
        <Badge variant="secondary" className="w-fit">{project.projectStage}</Badge>
        <CardTitle className="pt-2">{project.projectName}</CardTitle>
        <CardDescription className="line-clamp-3">{project.projectDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map(tech => (
            <Badge key={tech} variant="outline">{tech}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/project/${project.projectId}`}>
            View Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
