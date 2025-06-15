
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Link as LinkIcon, Newspaper } from "lucide-react";

const clubNews = [
  {
    title: "Lanzamiento de la plataforma START",
    date: "15 de Junio, 2025",
    description: "¡Estamos emocionados de lanzar la primera versión de nuestra plataforma para conectar a estudiantes y proyectos universitarios!",
  },
  {
    title: "Próximo Taller de Pitch",
    date: "20 de Julio, 2025",
    description: "Aprende a presentar tu idea de proyecto de manera efectiva en nuestro próximo taller. ¡Inscripciones abiertas!",
  },
  {
    title: "Sesión de networking con mentores",
    date: "5 de Agosto, 2025",
    description: "Conecta con profesionales de la industria y recibe feedback para tu proyecto.",
  },
];

const contests = [
  {
    name: "Fondo Semilla Inicia FEN",
    stage: "Idea",
    description: "Apoyo para ideas de negocio innovadoras en etapa temprana.",
    link: "https://fen.uchile.cl/",
  },
  {
    name: "Concurso Emprende Santander",
    stage: "Prototipo",
    description: "Financiamiento para proyectos con un prototipo funcional.",
    link: "https://www.santander.cl/universidades",
  },
  {
    name: "Desafío de Innovación Abierta",
    stage: "Validación",
    description: "Busca soluciones a problemas reales de la industria.",
    link: "#",
  },
];


const News = () => {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Noticias y Oportunidades</h1>
        <p className="mt-4 text-lg text-muted-foreground">Mantente al día con las últimas novedades y encuentra fondos para tu proyecto.</p>
      </div>

      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-3">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-6">
            <Newspaper className="h-7 w-7" />
            Noticias del Club
          </h2>
          <div className="space-y-6">
            {clubNews.map((newsItem, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{newsItem.title}</CardTitle>
                  <CardDescription>{newsItem.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{newsItem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-6">
            <ClipboardList className="h-7 w-7" />
            Fondos Activos
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concurso</TableHead>
                  <TableHead className="text-right">Postular</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests.map((contest, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{contest.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">Etapa:</span> {contest.stage}
                      </div>
                       <p className="text-sm text-muted-foreground mt-1">{contest.description}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <a href={contest.link} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
