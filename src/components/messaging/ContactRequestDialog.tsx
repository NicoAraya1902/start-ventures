import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface ContactRequestDialogProps {
  receiverId: string;
  receiverName: string;
}

export function ContactRequestDialog({ receiverId, receiverName }: ContactRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendRequest = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          receiver_id: receiverId,
          message: message || `Hola ${receiverName}, me gustaría conectar contigo para explorar oportunidades de colaboración.`,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Solicitud ya enviada",
            description: "Ya has enviado una solicitud a esta persona",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "¡Solicitud enviada!",
          description: `Tu solicitud de contacto ha sido enviada a ${receiverName}`,
        });
        setOpen(false);
        setMessage("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la solicitud de contacto",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Solicitar contacto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar contacto con {receiverName}</DialogTitle>
          <DialogDescription>
            Envía una solicitud de contacto para poder iniciar una conversación.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder={`Hola ${receiverName}, me gustaría conectar contigo...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendRequest} disabled={loading}>
              {loading ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}