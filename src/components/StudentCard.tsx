import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Student } from '@/data/students-data';
import { MapPin, GraduationCap, Clock, Mail, Linkedin, Code, Lightbulb } from 'lucide-react';

const StudentCard = ({ student }: { student: Student }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="w-24 h-24 mx-auto overflow-hidden rounded-full mb-4">
          <img 
            src={student.profileImageUrl} 
            alt={student.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <CardTitle className="text-lg">{student.name}</CardTitle>
        <CardDescription className="text-sm">
          <div className="flex items-center justify-center gap-1 mb-1">
            <GraduationCap className="h-3 w-3" />
            {student.degree} - Año {student.year}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="h-3 w-3" />
            {student.university}
          </div>
          <div className="flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {student.availability}
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {student.description}
        </p>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Perfil</h4>
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant={student.isTechnical ? "default" : "secondary"} className="text-xs">
              <Code className="h-3 w-3 mr-1" />
              {student.isTechnical ? 'Técnico' : 'No técnico'}
            </Badge>
            <Badge variant={student.hasIdea ? "default" : "outline"} className="text-xs">
              <Lightbulb className="h-3 w-3 mr-1" />
              {student.hasIdea ? 'Tiene idea' : 'Sin idea específica'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Área de desarrollo:</strong> {student.projectArea}
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Intereses</h4>
          <div className="flex flex-wrap gap-1">
            {student.interests.slice(0, 2).map(interest => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Busca</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {student.lookingFor}
          </p>
        </div>
        
        <div className="flex justify-center gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Contactar
          </Button>
          {student.contact.linkedin && (
            <Button size="sm" variant="ghost" className="p-2">
              <Linkedin className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;