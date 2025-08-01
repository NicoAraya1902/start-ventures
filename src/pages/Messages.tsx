import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
  id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  sender_profile?: {
    full_name: string;
    email: string;
  } | null;
  receiver_profile?: {
    full_name: string;
    email: string;
  } | null;
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      // Primero obtenemos los mensajes sin las relaciones
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Luego obtenemos los perfiles de los usuarios únicos
      const userIds = new Set<string>();
      messagesData?.forEach(msg => {
        userIds.add(msg.sender_id);
        userIds.add(msg.receiver_id);
      });

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", Array.from(userIds));

      // Combinamos los datos
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const messagesWithProfiles = messagesData?.map(msg => ({
        ...msg,
        sender_profile: profilesMap.get(msg.sender_id) || null,
        receiver_profile: profilesMap.get(msg.receiver_id) || null,
      })) || [];

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los mensajes",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId)
        .eq("receiver_id", user.id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read && message.receiver_id === user?.id) {
      markAsRead(message.id);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Debes iniciar sesión para ver tus mensajes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Messages List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Mensajes
              </CardTitle>
              <CardDescription>
                {messages.length} mensaje{messages.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {messages.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No tienes mensajes
                  </div>
                ) : (
                  messages.map((message) => {
                    const isReceived = message.receiver_id === user.id;
                    const contact = isReceived 
                      ? message.sender_profile 
                      : message.receiver_profile;
                    
                    return (
                      <div
                        key={message.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => openMessage(message)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isReceived && !message.read && (
                                <Badge variant="default" className="text-xs">
                                  Nuevo
                                </Badge>
                              )}
                              {isReceived ? (
                                <MailOpen className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Mail className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="font-medium text-sm truncate">
                              {isReceived ? "De: " : "Para: "}
                              {contact?.full_name || contact?.email || "Usuario"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {message.subject}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(message.created_at), "d MMM, HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedMessage.receiver_id === user.id ? "De: " : "Para: "}
                      {(selectedMessage.receiver_id === user.id 
                        ? selectedMessage.sender_profile 
                        : selectedMessage.receiver_profile
                      )?.full_name || "Usuario"}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(selectedMessage.created_at), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Selecciona un mensaje para verlo aquí
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}