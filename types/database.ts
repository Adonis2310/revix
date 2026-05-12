export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          current_km: number
          bike_model: string
          last_service_km: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          current_km?: number
          bike_model?: string
          last_service_km?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          current_km?: number
          bike_model?: string
          last_service_km?: number
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_sessions: {
        Row: {
          id: string
          user_id: string
          milestone_km: number
          completed_km: number
          service_type: string
          completed_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          milestone_km: number
          completed_km: number
          service_type: string
          completed_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          milestone_km?: number
          completed_km?: number
          service_type?: string
          completed_at?: string
          notes?: string | null
        }
        Relationships: []
      }
      pending_tasks: {
        Row: {
          id: string
          user_id: string
          milestone_km: number
          task_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          milestone_km: number
          task_id: string
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          milestone_km?: number
          task_id?: string
          completed_at?: string
        }
        Relationships: []
      }
      km_logs: {
        Row: {
          id: string
          user_id: string
          km: number
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          km: number
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          km?: number
          logged_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
