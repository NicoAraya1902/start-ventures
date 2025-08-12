import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Bug, Send, Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  type: z.enum(["error", "suggestion"], {
    required_error: "Selecciona un tipo de feedback",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres",
  }),
  email: z.string().email({
    message: "Ingresa un email válido",
  }).optional().or(z.literal("")),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

interface FeedbackDialogProps {
  children: React.ReactNode;
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: undefined,
      description: "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);
    
    try {
      // Create URL with query parameters for GET request
      const baseUrl = "https://n8n.srv928892.hstgr.cloud/webhook/55107802-e7cf-461a-8e3b-c30a67f0cb91";
      const params = new URLSearchParams({
        type: data.type,
        description: data.description,
        contactEmail: data.email || "",
        userId: user?.id || "",
        userName: user?.user_metadata?.full_name || "",
        userEmail: user?.email || "",
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        screenResolution: `${screen.width}x${screen.height}`,
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al enviar el feedback");
      }

      toast({
        title: "¡Feedback enviado!",
        description: data.type === "error" 
          ? "Gracias por reportar el error. Lo revisaremos pronto."
          : "Gracias por tu sugerencia. La consideraremos para futuras mejoras.",
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description: "No pudimos enviar tu feedback. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Reportar Error o Sugerencia
          </DialogTitle>
          <DialogDescription>
            Ayúdanos a mejorar la plataforma reportando errores o compartiendo tus ideas.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de feedback</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="error">🐛 Reportar Error</SelectItem>
                      <SelectItem value="suggestion">💡 Sugerencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        form.watch("type") === "error"
                          ? "Describe qué error encontraste y qué estabas haciendo cuando ocurrió..."
                          : "Describe tu sugerencia o idea de mejora..."
                      }
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contacto (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu-email@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}