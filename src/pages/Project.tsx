
import { useParams, Link, Navigate } from 'react-router-dom';
import { projects } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Code, Briefcase, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const ProjectPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const project = projects.find(p => p.projectId === id);

  if (!project) {
    return <Navigate to="/explore" />;
  }
  
  const handleApplyClick = () => {
    toast({
      title: "Authentication Required",
      description: "Please sign up or log in to apply for this role.",
      variant: "default",
    })
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/explore" className="text-sm text-primary hover:underline mb-4 block">&larr; Back to Projects</Link>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl mb-6">
            <img src={project.projectImageUrl} alt={project.projectName} className="w-full h-full object-cover" />
          </div>
          <Badge variant="secondary" className="mb-2">{project.projectStage}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{project.projectName}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> About the Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.projectDescription}</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase /> Open Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.roles.filter(r => r.status === 'Open').map(role => (
                  <div key={role.roleId} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">{role.roleTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{role.roleDescription}</p>
                     <div className="flex flex-wrap gap-2 mb-4">
                      {role.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                    </div>
                    <Button onClick={handleApplyClick}>
                      <Plus className="mr-2 h-4 w-4" /> Apply Now
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code /> Technologies</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="default">{tech}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
