import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Contact {
  user_id: string;
  full_name: string;
  email: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
    read: boolean;
  };
  unread_count: number;
}

interface ContactsListProps {
  onStartChat: (contactId: string, contactName: string) => void;
}

export function ContactsList({ onStartChat }: ContactsListProps) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    fetchContacts();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('contacts-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchContacts(); // Refresh contacts when new messages arrive
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      // First, get all accepted contact requests
      const { data: acceptedRequests, error: requestsError } = await supabase
        .from("contact_requests")
        .select("sender_id, receiver_id")
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (requestsError) throw requestsError;

      if (!acceptedRequests || acceptedRequests.length === 0) {
        setContacts([]);
        setLoading(false);
        return;
      }

      // Get unique contact IDs
      const contactIds = acceptedRequests.map(req => 
        req.sender_id === user.id ? req.receiver_id : req.sender_id
      );

      // Get contact profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", contactIds);

      if (profilesError) throw profilesError;

      // Get last message and unread count for each contact
      const contactsWithMessages = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("content, created_at, sender_id, read")
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.user_id}),and(sender_id.eq.${profile.user_id},receiver_id.eq.${user.id})`)
            .order("created_at", { ascending: false })
            .limit(1);

          // Get unread count
          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: 'exact', head: true })
            .eq("sender_id", profile.user_id)
            .eq("receiver_id", user.id)
            .eq("read", false);

          return {
            ...profile,
            last_message: lastMessage?.[0] || undefined,
            unread_count: unreadCount || 0
          };
        })
      );

      // Sort by last message date (most recent first)
      contactsWithMessages.sort((a, b) => {
        if (!a.last_message && !b.last_message) return 0;
        if (!a.last_message) return 1;
        if (!b.last_message) return -1;
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      });

      setContacts(contactsWithMessages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los contactos",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contactos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contactos ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No tienes contactos aún</p>
            <p className="text-xs mt-1">
              Envía solicitudes de contacto desde la página principal
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.user_id}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
              >
                <Avatar>
                  <AvatarFallback>
                    {contact.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {contact.full_name || contact.email}
                    </h4>
                    {contact.unread_count > 0 && (
                      <Badge variant="default" className="text-xs h-5 min-w-5 flex items-center justify-center">
                        {contact.unread_count}
                      </Badge>
                    )}
                  </div>
                  
                  {contact.last_message ? (
                    <div className="text-xs text-muted-foreground">
                      <p className="truncate">
                        {contact.last_message.sender_id === user?.id ? 'Tú: ' : ''}
                        {contact.last_message.content}
                      </p>
                      <p className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(contact.last_message.created_at), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Sin mensajes aún
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onStartChat(contact.user_id, contact.full_name || contact.email)}
                  className="gap-1 shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}