export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  organization_name?: string;
  role: 'Food Donor' | 'Food Recipient' | 'Administrator';
  location: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number?: string;
  organization_name?: string;
  role: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminOverview {
  total_users: number;
  total_surplus_offers: number;
  total_recipient_needs: number;
  total_waste_observations: number;
  total_matches: number;
  approved_matches: number;
  rejected_matches: number;
  pending_matches: number;
}

export interface SurplusOffer {
  id?: number;
  donor: string;
  food_category: string;
  description?: string;
  quantity: number;
  unit: string;
  availability_timestamp?: string;
  collection_deadline?: string;
  pickup_location: string;
  latitude?: number;
  longitude?: number;
  storage_info?: string;
  status?: string; // pending, claimed, completed, expired
  data_source?: string;
  verification_status?: string;
  user_id?: number;
}

export interface RecipientNeed {
  id?: number;
  recipient_org: string;
  food_category: string;
  quantity: number;
  unit: string;
  required_date?: string;
  delivery_location: string;
  latitude?: number;
  longitude?: number;
  priority?: string; // normal, high, urgent
  priority_reason?: string;
  verification_status?: string;
  fulfillment_status?: string; // open, partial, fulfilled
  user_id?: number;
}

export interface WasteObservation {
  id?: number;
  reporting_source: string;
  food_category: string;
  quantity: number;
  unit: string;
  observation_date?: string;
  source_location: string;
  latitude?: number;
  longitude?: number;
  waste_classification?: string;
  data_provenance?: string;
}

export interface Match {
  id?: number;
  surplus_offer_id: number;
  recipient_need_id: number;
  proposed_quantity: number;
  compatibility_score?: number;
  recommendation_explanation: string;
  decision?: string; // proposed, approved, rejected, cancelled
  decision_timestamp?: string;
  status?: string; // pending, completed
}

export interface AnalyticsSummary {
  total_waste: number;
  total_surplus: number;
  total_need: number;
}

export interface CategoryBreakdown {
  category: string;
  surplus: number;
  need: number;
}

export interface TrendData {
  date: string;
  total: number;
}

export interface NearbySurplusItem {
  id: number;
  donor: string;
  food_category: string;
  description?: string;
  quantity: number;
  unit: string;
  pickup_location: string;
  latitude: number;
  longitude: number;
  collection_deadline?: string;
  status: string;
  distance_km: number;
}

export interface NearbyNeedItem {
  id: number;
  recipient_org: string;
  food_category: string;
  quantity: number;
  unit: string;
  delivery_location: string;
  latitude: number;
  longitude: number;
  priority: string;
  fulfillment_status: string;
  distance_km: number;
}

export interface MapMarker {
  id: number;
  type: 'surplus' | 'need';
  title: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  latitude: number;
  longitude: number;
  badge: string;
  distance_km?: number;
}
