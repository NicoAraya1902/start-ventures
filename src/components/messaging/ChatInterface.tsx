import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { sanitizeUserInput, sanitizeText } from "@/lib/sanitizer";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

interface ChatInterfaceProps {
  contactId: string;
  contactName: string;
  onClose: () => void;
}

export function ChatInterface({ contactId, contactName, onClose }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !contactId) return;
    
    console.log('ChatInterface: Setting up for user', user.id, 'and contact', contactId);
    fetchMessages();
    
    // Set up real-time subscription with better filtering
    const channel = supabase
      .channel(`chat-${user.id}-${contactId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time INSERT received:', payload);
          const newMessage = payload.new as Message;
          
          // Only add messages relevant to this conversation
          if ((newMessage.sender_id === user.id && newMessage.receiver_id === contactId) ||
              (newMessage.sender_id === contactId && newMessage.receiver_id === user.id)) {
            console.log('Adding new message to conversation:', newMessage);
            setMessages(prev => {
              // Avoid duplicates
              if (prev.find(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
            scrollToBottom();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time UPDATE received:', payload);
          const updatedMessage = payload.new as Message;
          
          // Only update messages relevant to this conversation
          if ((updatedMessage.sender_id === user.id && updatedMessage.receiver_id === contactId) ||
              (updatedMessage.sender_id === contactId && updatedMessage.receiver_id === user.id)) {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Chat subscription status:', status);
      });

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [user, contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!user || !contactId) return;

    console.log('Fetching messages for conversation:', user.id, '<->', contactId);
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log('Fetched messages:', data?.length || 0, 'messages');
      setMessages(data || []);
      
      // Mark received messages as read
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === user.id && !msg.read
      ) || [];

      if (unreadMessages.length > 0) {
        console.log('Marking', unreadMessages.length, 'messages as read');
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadMessages.map(msg => msg.id));
      }
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

  const sendMessage = async () => {
    if (!user || !newMessage.trim() || !contactId) return;

    // Sanitize message content before sending
    const sanitizedContent = sanitizeText(newMessage.trim(), 2000);
    
    console.log('Sending message:', sanitizedContent, 'from', user.id, 'to', contactId);
    setSending(true);
    
    try {
      const messageData = {
        content: sanitizedContent,
        sender_id: user.id,
        receiver_id: contactId,
        subject: "Chat message"
      };
      
      const { data, error } = await supabase
        .from("messages")
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log('Message sent successfully:', data);
      setNewMessage("");
      
      // Force refresh messages after sending (fallback if real-time doesn't work)
      setTimeout(() => {
        fetchMessages();
      }, 500);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Asegúrate de que tienes una conexión aceptada.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat con {contactName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {contactName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {contactName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No hay mensajes aún. ¡Inicia la conversación!
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{sanitizeUserInput(message.content)}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {format(new Date(message.created_at), "HH:mm", { locale: es })}
                        {isOwnMessage && (
                          <span className="ml-1">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || sending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}