// src\pages\Messages.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
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
      .or(`client_id.eq.${user.id}`)
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
      <div className="empty-state" style={{ marginTop: "4rem" }}>
        <div className="empty-state-icon">
          <MessageSquare size={28} />
        </div>
        <h3>Connectez-vous pour accéder à vos messages</h3>
        <p>
          Échangez en temps réel avec vos artisans et suivez vos chantiers ou
          commandes en cours.
        </p>
        <Link to="/auth" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
      <div className="page-header">
        <h1 className="text-3xl font-extrabold text-ink">Messagerie</h1>
        <p className="text-sm text-ink-faint mt-1">
          Discutez directement et planifiez avec vos artisans locaux.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] border border-border bg-bg-elevated rounded-3xl overflow-hidden mt-8 shadow-sm min-h-137.5">
        {/* Conversation list */}
        <div
          className={`border-r border-border overflow-y-auto max-h-150 bg-bg-elevated/40 ${
            activeId ? "hidden md:block" : "block"
          }`}
        >
          {loading ? (
            <div className="p-8 text-center text-ink-faint animate-pulse">
              Chargement…
            </div>
          ) : conversations.length === 0 ? (
            <div
              className="empty-state"
              style={{ border: "none", padding: "3rem 1.5rem" }}
            >
              <div className="empty-state-icon">
                <MessageSquare size={28} />
              </div>
              <h3>Aucune conversation</h3>
              <p>Vos échanges avec les artisans apparaîtront ici.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {conversations.map((c) => {
                const lastMsg = c.messages[c.messages.length - 1];
                const active = activeId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      active
                        ? "bg-accent-soft text-accent"
                        : "hover:bg-bg-sunken/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {c.artisan_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-bold text-sm ${active ? "text-accent-strong" : "text-ink"}`}
                        >
                          {c.artisan_name || "Artisan"}
                        </span>
                        <span className="text-[10px] text-ink-faint">
                          {lastMsg
                            ? new Date(lastMsg.created_at).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate mt-0.5 ${active ? "text-accent-strong/80" : "text-ink-soft"}`}
                      >
                        {lastMsg ? lastMsg.content : "Commencer la discussion…"}
                      </p>
                    </div>
                    {c.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 shadow-sm animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thread */}
        <div
          className={`flex flex-col bg-bg-elevated ${!activeId ? "hidden md:flex" : "flex"}`}
        >
          {!activeConv ? (
            <div
              className="empty-state"
              style={{ border: "none", flex: 1, justifyContent: "center" }}
            >
              <div className="empty-state-icon">
                <MessageSquare size={28} />
              </div>
              <h3>Sélectionnez une conversation</h3>
              <p>
                Choisissez un artisan dans la liste pour démarrer la discussion.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border bg-bg-sunken/20">
                <button
                  onClick={() => setActiveId(null)}
                  className="md:hidden p-1 rounded-full hover:bg-bg-sunken text-ink-soft"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                  {activeConv.artisan_name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">
                    {activeConv.artisan_name || "Artisan"}
                  </p>
                  <p className="text-[10px] text-forest font-semibold uppercase tracking-wider">
                    En ligne
                  </p>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-100 min-h-87.5 bg-bg-sunken/5">
                {activeConv.messages.map((m) => {
                  const isMe = m.sender_id === user.id;
                  return (
                    <div
                      key={m.id}
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "ml-auto bg-accent text-white rounded-br-none"
                          : "mr-auto bg-bg-elevated border border-border text-ink rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed">{m.content}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right font-medium ${isMe ? "text-white/70" : "text-ink-faint"}`}
                      >
                        {new Date(m.created_at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className="flex items-center gap-3 p-4 border-t border-border bg-bg-elevated">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Écrire un message…"
                  className="flex-1 px-4.5 py-3 rounded-full border border-border bg-bg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-40 hover:bg-accent-strong shadow-md transition-all active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
