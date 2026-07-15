// ========== Énumérations ==========
export type UserRole = "client" | "artisan_solo" | "responsable" | "employe";
export type ArtisanStatus = "actif" | "en_pause" | "suspendu";
export type AppointmentStatus = "upcoming" | "done" | "cancelled";
export type PendingChangeStatus = "en_attente" | "approuve" | "refuse";
export type PendingChangeType = "service" | "horaire" | "profil";
export type PayoutStatus = "en_attente" | "verse" | "refuse";
export type MessageSender = "client" | "artisan";

// ========== Tables principales ==========

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  slug: string;
  label: string;
  icon: string;
}

export interface Artisan {
  id: number;
  owner_id: string;
  name: string;
  category_id: number | null;
  city: string;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  rating: number;
  reviews_count: number;
  verified: boolean;
  available_today: boolean;
  price_from: number | null;
  currency: string;
  is_team: boolean;
  status: ArtisanStatus;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  artisan_id: number;
  name: string;
  description?: string | null;
  price: number;
  duration_min: number;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
}

// ========== Disponibilités & Commodités ==========

export interface ArtisanHours {
  id: number;
  artisan_id: number;
  day_index: number;
  day_label: string;
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
}

export interface ArtisanAmenities {
  id: number;
  artisan_id: number;
  wifi: boolean;
  parking: boolean;
  accessibility: boolean;
  kids_welcome: boolean;
}

export interface ArtisanPaymentMethod {
  id: number;
  artisan_id: number;
  label: string;
}

// ========== Rendez-vous ==========

export interface Appointment {
  id: number;
  artisan_id: number;
  client_id: string;
  service_id?: number | null;
  professional_id?: number | null;
  service_name: string;
  price: number;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  client_preference?: "sans_preference" | "homme" | "femme" | null;
  deposit_paid: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// ========== Avis ==========

export interface Review {
  id: number;
  artisan_id: number;
  client_id: string;
  appointment_id?: number | null;
  member_id?: number | null;
  rating: number;
  comment?: string | null;
  reply_text?: string | null;
  reply_at?: string | null;
  created_at: string;
}

// ========== Favoris ==========

export interface Favorite {
  id: number;
  user_id: string;
  artisan_id: number;
  created_at: string;
}

// ========== Équipe ==========

export interface Team {
  id: number;
  artisan_id: number;
  name: string;
  created_at: string;
  team_members?: TeamMember[];
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id?: string | null;
  name: string;
  specialty?: string | null;
  avatar_url?: string | null;
  role: string;
  status: ArtisanStatus;
  perm_view_stats: boolean;
  perm_modify_services: boolean;
  perm_reply_reviews: boolean;
  has_solo_activity: boolean;
  solo_artisan_id?: number | null;
  created_at: string;
}

// ========== Messagerie ==========

export interface Conversation {
  id: number;
  artisan_id: number;
  client_id: string;
  member_id?: number | null;
  last_message_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: MessageSender;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// ========== Paiement ==========

export interface PaymentSettings {
  id: number;
  artisan_id: number;
  online_payment: boolean;
  deposit_percent: number;
  accepts_mobile_money: boolean;
  accepts_transfer: boolean;
  updated_at: string;
}

export interface Payout {
  id: number;
  artisan_id: number;
  member_id?: number | null;
  amount: number;
  currency: string;
  label: string;
  status: PayoutStatus;
  method?: string | null;
  created_at: string;
  paid_at?: string | null;
}

// ========== Modifications en attente ==========

export interface PendingChange {
  id: number;
  team_id: number;
  member_id: number;
  change_type: PendingChangeType;
  target_id?: number | null;
  description: string;
  proposed_data?: Record<string, unknown> | null;
  status: PendingChangeStatus;
  reviewed_by?: number | null;
  created_at: string;
  reviewed_at?: string | null;
}

// ========== Types composites (pour l'UI) ==========

export interface ArtisanWithDetails extends Artisan {
  services: Service[];
  hours: ArtisanHours[];
  amenities: ArtisanAmenities | null;
  payment_methods: ArtisanPaymentMethod[];
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
  artisan_name?: string;
  artisan_avatar?: string;
  client_name?: string;
  client_avatar?: string;
  unread: boolean;
}
