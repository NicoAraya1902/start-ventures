import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessageDialogProps {
  recipientId: string;
  recipientName: string;
}

export function MessageDialog({ recipientId, recipientName }: MessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para enviar mensajes",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El mensaje no puede estar vacío",
      });
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: recipientId,
        subject: subject.trim() || `Mensaje de ${user.user_metadata?.full_name || user.email}`,
        content: content.trim(),
      });

      if (error) throw error;

      toast({
        title: "Mensaje enviado",
        description: `Tu mensaje ha sido enviado a ${recipientName}`,
      });

      setSubject("");
      setContent("");
      setOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" size="sm" disabled>
        <MessageSquare className="h-4 w-4 mr-2" />
        Contactar
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contactar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar mensaje a {recipientName}</DialogTitle>
          <DialogDescription>
            Envía un mensaje directo a este estudiante. Recibirá una notificación en su bandeja de entrada.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Asunto (opcional)</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del mensaje..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Mensaje *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendMessage} disabled={sending || !content.trim()}>
            {sending ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}