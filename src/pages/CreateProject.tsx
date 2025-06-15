import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { X } from "lucide-react"

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

const roleSchema = z.object({
  roleTitle: z.string().min(3, { message: "El título del puesto debe tener al menos 3 caracteres." }),
  roleDescription: z.string().min(10, { message: "La descripción del puesto debe tener al menos 10 caracteres." }),
  requiredSkills: z.string().min(2, { message: "Ingresa al menos una habilidad, separada por comas." }),
});

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
  projectCategory: z.string({
    required_error: "Por favor selecciona una categoría para el proyecto.",
  }),
  technologies: z.string().min(2, {
    message: "Ingresa al menos una tecnología o herramienta."
  }),
  roles: z.array(roleSchema).min(1, "Debes agregar al menos un puesto buscado."),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const defaultValues: Partial<ProjectFormValues> = {
  projectName: "",
  projectDescription: "",
  technologies: "",
  roles: [{ roleTitle: "", roleDescription: "", requiredSkills: "" }],
}

const projectStages = [
  'Idea / Conceptualización',
  'Prototipo / MVP',
  'En Desarrollo Activo',
  'Beta / Pruebas',
  'Lanzado y Escalando'
];

const projectCategories = [
  'Tecnología / Software',
  'Alimenticio',
  'Salud y Bienestar',
  'Fintech',
  'Educación',
  'E-commerce / Retail',
  'Entretenimiento y Medios',
  'Sostenibilidad / Ecológico',
  'Inmobiliario',
  'Seguridad',
  'Otro',
];

const CreateProjectPage = () => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roles",
  });

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
            name="projectCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría del Proyecto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la categoría de tu proyecto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Clasificar tu proyecto ayuda a que los colaboradores adecuados lo encuentren.
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
                <FormLabel>Stack Tecnológico Principal del Proyecto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: React, Next.js, Firebase" {...field} />
                </FormControl>
                <FormDescription>
                  Enumera las tecnologías o herramientas principales del proyecto. Sepáralas por comas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-base font-semibold">Puestos Buscados</FormLabel>
            <FormDescription className="mb-4">
              Define los roles que necesitas para tu equipo. Puedes agregar varios.
            </FormDescription>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border rounded-lg relative space-y-4 bg-muted/20">
                  <FormField
                    control={form.control}
                    name={`roles.${index}.roleTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Puesto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Desarrollador/a Frontend" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`roles.${index}.roleDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del Puesto</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe las responsabilidades y lo que buscas en un colaborador para este puesto." {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`roles.${index}.requiredSkills`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habilidades Requeridas</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: React, TypeScript, Figma" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enumera las habilidades clave. Sepáralas por comas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          className="absolute -top-3 -right-3 rounded-full h-7 w-7"
                      >
                          <X className="h-4 w-4" />
                      </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ roleTitle: "", roleDescription: "", requiredSkills: "" })}
            >
                Agregar otro puesto
            </Button>
            <FormMessage>
              {form.formState.errors.roles?.root?.message || form.formState.errors.roles?.message}
            </FormMessage>
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto">Publicar Proyecto</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateProjectPage;
