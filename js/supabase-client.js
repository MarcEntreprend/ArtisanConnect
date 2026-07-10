// js/supabase-client.js

// js/supabase-client.js
// Charge ce fichier APRÈS le script Supabase CDN dans ton HTML :
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

(function () {
  // ========== CONFIGURATION ==========
  const SUPABASE_URL = "https://unxuqudjptvcorprupos.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueHVxdWRqcHR2Y29ycHJ1cG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTY1NDAsImV4cCI6MjA5OTIzMjU0MH0.TzsgJLMozl0I0F9bjo3xcqEUK849C2194X_tlpkA6h8";

  if (!window.supabase) {
    console.error(
      "Supabase JS library not loaded. Add the CDN script before this file.",
    );
    return;
  }

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );

  // ========== API ==========
  window.SupabaseAPI = {
    // --- Auth ---
    auth: {
      signUp: async (email, password, fullName, role = "client") => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { data: null, error };
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          role,
          full_name: fullName,
        });
        return { data, error: profileError };
      },
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
      },
      getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        return { data, error }; // <-- data contient { session: ... }
      },
      getUser: async () => {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user || null;
        if (error || !user) return { user: null, error };
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        return { user: { ...user, ...profile }, error: null };
      },
      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        return { error };
      },
    },

    // --- Artisans ---
    artisans: {
      getAll: async (filters = {}) => {
        let query = supabase.from("artisans").select("*").eq("status", "actif");
        if (filters.category_id)
          query = query.eq("category_id", filters.category_id);
        if (filters.city) query = query.ilike("city", `%${filters.city}%`);
        if (filters.available_today !== undefined)
          query = query.eq("available_today", filters.available_today);
        if (filters.search)
          query = query.or(
            `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
          );
        const { data, error } = await query;
        return { data, error };
      },
      getById: async (id) => {
        const { data, error } = await supabase
          .from("artisans")
          .select("*")
          .eq("id", id)
          .single();
        return { data, error };
      },
      getByOwner: async (ownerId) => {
        const { data, error } = await supabase
          .from("artisans")
          .select("*")
          .eq("owner_id", ownerId);
        return { data, error };
      },
      update: async (id, updates) => {
        const { data, error } = await supabase
          .from("artisans")
          .update(updates)
          .eq("id", id)
          .select();
        return { data, error };
      },
      create: async (artisan) => {
        const { data, error } = await supabase
          .from("artisans")
          .insert(artisan)
          .select();
        return { data, error };
      },
    },

    // --- Services ---
    services: {
      getByArtisan: async (artisanId, activeOnly = true) => {
        let query = supabase
          .from("services")
          .select("*")
          .eq("artisan_id", artisanId);
        if (activeOnly) query = query.eq("is_active", true);
        const { data, error } = await query;
        return { data, error };
      },
      create: async (service) => {
        const { data, error } = await supabase
          .from("services")
          .insert(service)
          .select();
        return { data, error };
      },
      update: async (id, updates) => {
        const { data, error } = await supabase
          .from("services")
          .update(updates)
          .eq("id", id)
          .select();
        return { data, error };
      },
      delete: async (id) => {
        const { error } = await supabase.from("services").delete().eq("id", id);
        return { error };
      },
    },

    // --- Disponibilités (artisan_hours) ---
    hours: {
      getByArtisan: async (artisanId) => {
        const { data, error } = await supabase
          .from("artisan_hours")
          .select("*")
          .eq("artisan_id", artisanId)
          .order("day_index");
        return { data, error };
      },
      upsert: async (artisanId, hoursArray) => {
        // Supprime les anciennes et insère les nouvelles (ou upsert avec contrainte unique)
        await supabase
          .from("artisan_hours")
          .delete()
          .eq("artisan_id", artisanId);
        const { data, error } = await supabase
          .from("artisan_hours")
          .insert(hoursArray.map((h) => ({ artisan_id: artisanId, ...h })))
          .select();
        return { data, error };
      },
    },

    // --- Rendez-vous ---
    appointments: {
      getByClient: async (clientId) => {
        const { data, error } = await supabase
          .from("appointments")
          .select("*, artisans(name, avatar_url), services(name, price)")
          .eq("client_id", clientId)
          .order("appointment_date", { ascending: false });
        return { data, error };
      },
      getByArtisan: async (artisanId) => {
        const { data, error } = await supabase
          .from("appointments")
          .select("*, services(name, price), team_members(name, avatar_url)")
          .eq("artisan_id", artisanId)
          .order("appointment_date", { ascending: true });
        return { data, error };
      },
      create: async (appointment) => {
        const { data, error } = await supabase
          .from("appointments")
          .insert(appointment)
          .select();
        return { data, error };
      },
      update: async (id, updates) => {
        const { data, error } = await supabase
          .from("appointments")
          .update(updates)
          .eq("id", id)
          .select();
        return { data, error };
      },
      cancel: async (id) => {
        return await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", id);
      },
    },

    // --- Avis ---
    reviews: {
      getByArtisan: async (artisanId) => {
        const { data, error } = await supabase
          .from("reviews")
          .select("*, users(full_name, avatar_url), team_members(name)")
          .eq("artisan_id", artisanId)
          .order("created_at", { ascending: false });
        return { data, error };
      },
      create: async (review) => {
        const { data, error } = await supabase
          .from("reviews")
          .insert(review)
          .select();
        return { data, error };
      },
      reply: async (id, replyText) => {
        const { data, error } = await supabase
          .from("reviews")
          .update({
            reply_text: replyText,
            reply_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select();
        return { data, error };
      },
    },

    // --- Favoris ---
    favorites: {
      getByUser: async (userId) => {
        const { data, error } = await supabase
          .from("favorites")
          .select("artisan_id, artisans(*)")
          .eq("user_id", userId);
        return { data, error };
      },
      add: async (userId, artisanId) => {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: userId, artisan_id: artisanId });
        return { error };
      },
      remove: async (userId, artisanId) => {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("artisan_id", artisanId);
        return { error };
      },
    },

    // --- Messages ---
    messages: {
      getConversations: async (userId, role) => {
        let query = supabase
          .from("conversations")
          .select(
            "*, artisans(name, avatar_url), users!client_id(full_name, avatar_url), team_members(name, avatar_url)",
          );
        if (role === "client") query = query.eq("client_id", userId);
        else query = query.or(`artisan_id.eq.${userId}`); // à adapter si l'utilisateur est un membre d'équipe
        const { data, error } = await query.order("last_message_at", {
          ascending: false,
        });
        return { data, error };
      },
      getMessages: async (conversationId) => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        return { data, error };
      },
      send: async (conversationId, senderType, senderId, content) => {
        const { data, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            sender_type: senderType,
            sender_id: senderId,
            content,
          })
          .select();
        return { data, error };
      },
    },

    // --- Équipe (teams & team_members) ---
    team: {
      getByArtisan: async (artisanId) => {
        const { data: team } = await supabase
          .from("teams")
          .select("*")
          .eq("artisan_id", artisanId)
          .single();
        if (!team) return { data: null };
        const { data: members, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", team.id)
          .order("role");
        return { data: { ...team, members }, error };
      },
      updateMember: async (memberId, updates) => {
        const { data, error } = await supabase
          .from("team_members")
          .update(updates)
          .eq("id", memberId)
          .select();
        return { data, error };
      },
      addMember: async (member) => {
        const { data, error } = await supabase
          .from("team_members")
          .insert(member)
          .select();
        return { data, error };
      },
      removeMember: async (memberId) => {
        const { error } = await supabase
          .from("team_members")
          .delete()
          .eq("id", memberId);
        return { error };
      },
    },

    // --- Finances (payouts) ---
    finances: {
      getPayouts: async (artisanId, memberId = null) => {
        let query = supabase
          .from("payouts")
          .select("*")
          .eq("artisan_id", artisanId);
        if (memberId) query = query.eq("member_id", memberId);
        const { data, error } = await query.order("created_at", {
          ascending: false,
        });
        return { data, error };
      },
      createPayout: async (payout) => {
        const { data, error } = await supabase
          .from("payouts")
          .insert(payout)
          .select();
        return { data, error };
      },
      updatePayout: async (id, updates) => {
        const { data, error } = await supabase
          .from("payouts")
          .update(updates)
          .eq("id", id)
          .select();
        return { data, error };
      },
    },

    // --- Paiement settings ---
    paymentSettings: {
      get: async (artisanId) => {
        const { data, error } = await supabase
          .from("payment_settings")
          .select("*")
          .eq("artisan_id", artisanId)
          .single();
        return { data, error };
      },
      upsert: async (artisanId, settings) => {
        const { data, error } = await supabase
          .from("payment_settings")
          .upsert(
            { artisan_id: artisanId, ...settings },
            { onConflict: "artisan_id" },
          )
          .select();
        return { data, error };
      },
    },

    // --- Catégories ---
    categories: {
      getAll: async () => {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("id");
        return { data, error };
      },
    },

    // --- Utilitaires ---
    storage: {
      uploadAvatar: async (bucket, path, file) => {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true });
        if (error) return { error };
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
        return { publicUrl: urlData.publicUrl, error: null };
      },
    },
  };

  console.log("SupabaseAPI ready");
})();
