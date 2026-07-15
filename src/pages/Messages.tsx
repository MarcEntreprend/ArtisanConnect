// src/pages/Messages.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Send } from "lucide-react";
import type { Conversation, Message } from "../lib/types";

interface ConversationWithPreview extends Conversation {
  messages: Message[];
  unread: boolean;
  artisan_name?: string;
  client_name?: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithPreview[]>(
    [],
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("conversations")
      .select("*")
      .or(`client_id.eq.${user.id},artisan_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (!error && data) {
          const convs: ConversationWithPreview[] = [];
          for (const c of data) {
            const { data: msgs } = await supabase
              .from("messages")
              .select("*")
              .eq("conversation_id", c.id)
              .order("created_at", { ascending: true });
            convs.push({
              ...c,
              messages: msgs || [],
              unread: (msgs || []).some(
                (m) => !m.is_read && m.sender_id !== user.id,
              ),
            });
          }
          setConversations(convs);
        }
        setLoading(false);
      });
  }, [user]);

  const activeConv = conversations.find((c) => c.id === activeId);

  async function handleSend() {
    if (!newMessage.trim() || !activeId || !user) return;
    await supabase.from("messages").insert({
      conversation_id: activeId,
      sender_id: user.id,
      sender_type: "client",
      content: newMessage.trim(),
    });
    setNewMessage("");
    // Refresh messages
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true });
    if (data)
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: data } : c)),
      );
  }

  if (!user)
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <span className="text-4xl mb-4">💬</span>
        <h2 className="text-xl font-bold mb-2">
          Connectez-vous pour accéder à vos messages
        </h2>
        <p className="text-sm text-ink-faint mb-6">
          Retrouvez ici vos échanges avec les artisans.
        </p>
        <Link to="/auth" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Messagerie</h1>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] border border-border rounded-2xl overflow-hidden min-h-[500px]">
        {/* Conversation list */}
        <div
          className={`border-r border-border overflow-y-auto max-h-[600px] ${activeId ? "hidden md:block" : "block"}`}
        >
          {loading ? (
            <div className="p-6 text-center text-ink-faint">Chargement…</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-ink-faint">
              Aucune conversation
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left p-4 flex items-center gap-3 border-b border-border hover:bg-bg-sunken transition-colors ${activeId === c.id ? "bg-bg-sunken" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center text-sm font-bold text-[var(--color-accent)]">
                  {c.artisan_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">
                      {c.artisan_name || "Artisan"}
                    </span>
                    <span className="text-[10px] text-ink-faint">
                      {c.messages.length
                        ? new Date(
                            c.messages[c.messages.length - 1].created_at,
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-xs text-ink-faint truncate mt-0.5">
                    {c.messages.length
                      ? c.messages[c.messages.length - 1].content
                      : "Commencez la conversation…"}
                  </p>
                </div>
                {c.unread && (
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Thread */}
        <div
          className={`flex flex-col ${!activeId ? "hidden md:flex" : "flex"}`}
        >
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-ink-faint text-sm">
              Sélectionnez une conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <button onClick={() => setActiveId(null)} className="md:hidden">
                  <ArrowLeft size={18} />
                </button>
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-accent)]">
                  {activeConv.artisan_name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {activeConv.artisan_name || "Artisan"}
                  </p>
                  <p className="text-[10px] text-ink-faint">Conversation</p>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
                {activeConv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.sender_id === user.id ? "ml-auto bg-accent text-white rounded-br-md" : "mr-auto bg-bg-sunken rounded-bl-md"}`}
                  >
                    {m.content}
                    <span className="block text-[10px] opacity-60 mt-1">
                      {new Date(m.created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
              {/* Composer */}
              <div className="flex items-center gap-2 p-4 border-t border-border">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Écrire un message…"
                  className="flex-1 px-4 py-2.5 rounded-full border border-border bg-bg-sunken text-sm focus:outline-none focus:border-accent"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-[var(--color-accent-strong)] transition-colors"
                >
                  <Send size={17} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
