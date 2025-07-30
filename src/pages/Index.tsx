import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Filter, Users as UsersIcon, GraduationCap, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentCard from '@/components/StudentCard';
import { students } from '@/data/students-data';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const universities = ['all', ...Array.from(new Set(students.map(s => s.university)))];
  const years = ['all', ...Array.from(new Set(students.map(s => s.year.toString())))];
  const skills = ['all', ...Array.from(new Set(students.flatMap(s => s.skills)))];
  const regions = ['all', ...Array.from(new Set(students.map(s => s.region)))];

  const filteredStudents = students.filter(student => {
    const searchContent = `${student.name} ${student.description} ${student.skills.join(' ')} ${student.interests.join(' ')}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === 'all' || student.university === selectedUniversity;
    const matchesYear = selectedYear === 'all' || student.year.toString() === selectedYear;
    const matchesSkill = selectedSkill === 'all' || student.skills.includes(selectedSkill);
    const matchesRegion = selectedRegion === 'all' || student.region === selectedRegion;
    
    return matchesSearch && matchesUniversity && matchesYear && matchesSkill && matchesRegion;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container pt-24 pb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Matchmaking de Emprendedores Universitarios
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Conecta con estudiantes talentosos de todo Chile. Encuentra tu co-fundador ideal y forma el equipo perfecto para tu próxima startup.
          </p>
        </section>

        {/* Filters Section */}
        <section className="container pb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, habilidades, intereses..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setSelectedRegion} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[200px]">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regions.filter(r => r !== 'all').map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedUniversity} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[280px]">
                <GraduationCap className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Universidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las universidades</SelectItem>
                {universities.filter(u => u !== 'all').map(university => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedYear} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {years.filter(y => y !== 'all').map(year => (
                  <SelectItem key={year} value={year}>
                    Año {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedSkill} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Habilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las habilidades</SelectItem>
                {skills.filter(s => s !== 'all').slice(0, 15).map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredStudents.length} de {students.length} estudiantes
            </p>
          </div>

          {/* Students Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map(student => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No se encontraron estudiantes</h3>
              <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;