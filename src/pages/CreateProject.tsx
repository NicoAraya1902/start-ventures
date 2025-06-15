
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const projectFormSchema = z.object({
  projectName: z.string().min(3, {
    message: "El nombre del proyecto debe tener al menos 3 caracteres.",
  }),
  projectDescription: z.string().min(10, {
    message: "La descripción del proyecto debe tener al menos 10 caracteres.",
  }),
  projectStage: z.string({
    required_error: "Por favor selecciona una etapa para el proyecto.",
  }),
  technologies: z.string().min(2, {
    message: "Ingresa al menos una tecnología, habilidad o herramienta."
  }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const defaultValues: Partial<ProjectFormValues> = {
  projectName: "",
  projectDescription: "",
  technologies: "",
}

const projectStages = [
  'Idea / Conceptualización',
  'Prototipo / MVP',
  'En Desarrollo Activo',
  'Beta / Pruebas',
  'Lanzado y Escalando'
];

const CreateProjectPage = () => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProjectFormValues) {
    console.log(data);
    toast.success("¡Proyecto publicado exitosamente!", {
      description: "Tu idea ahora es visible para posibles colaboradores.",
      duration: 5000,
    })
    form.reset();
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Publica tu Idea</h1>
        <p className="mt-4 text-lg text-muted-foreground">Convierte tu visión en realidad. Describe tu proyecto para atraer al equipo perfecto.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Proyecto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Red social para amantes de las plantas" {...field} />
                </FormControl>
                <FormDescription>
                  Un nombre pegadizo y descriptivo ayudará a que tu proyecto destaque.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del Proyecto</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe tu proyecto en detalle. ¿Qué problema resuelve? ¿Quién es tu público objetivo? ¿Qué lo hace único?"
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Una descripción detallada atraerá a colaboradores que compartan tu visión.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa del Proyecto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la etapa actual de tu proyecto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectStages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Esto ayuda a los colaboradores a entender en qué punto te encuentras.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tecnologías, Habilidades o Herramientas Clave</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: React, Figma, SEO, Marketing Digital" {...field} />
                </FormControl>
                <FormDescription>
                  Enumera las tecnologías o habilidades principales. Sepáralas por comas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full md:w-auto">Publicar Proyecto</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateProjectPage;
