export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aliments: {
        Row: {
          calcium: number
          categorie: string
          composes_bioactifs: string[]
          description: string | null
          fer: number
          fibres: number
          glucides: number
          id: string
          image_url: string
          lipides: number
          lipides_satures: number
          magnesium: number
          mono_insatures: number
          nom: string
          omega_3_ala: number
          omega_3_dha: number
          omega_3_epa: number
          omega_6: number
          poly_insatures: number
          proprietes_sante: string[]
          proteines: number
          ratio_omega3_omega6: number
          saisons: string[]
          selenium: number
          vitamine_b12: number
          vitamine_b6: number
          vitamine_b9: number
          vitamine_c: number
          vitamine_d: number
          zinc: number
        }
        Insert: {
          calcium?: number
          categorie: string
          composes_bioactifs?: string[]
          description?: string | null
          fer?: number
          fibres?: number
          glucides?: number
          id?: string
          image_url: string
          lipides?: number
          lipides_satures?: number
          magnesium?: number
          mono_insatures?: number
          nom: string
          omega_3_ala?: number
          omega_3_dha?: number
          omega_3_epa?: number
          omega_6?: number
          poly_insatures?: number
          proprietes_sante?: string[]
          proteines?: number
          ratio_omega3_omega6?: number
          saisons?: string[]
          selenium?: number
          vitamine_b12?: number
          vitamine_b6?: number
          vitamine_b9?: number
          vitamine_c?: number
          vitamine_d?: number
          zinc?: number
        }
        Update: {
          calcium?: number
          categorie?: string
          composes_bioactifs?: string[]
          description?: string | null
          fer?: number
          fibres?: number
          glucides?: number
          id?: string
          image_url?: string
          lipides?: number
          lipides_satures?: number
          magnesium?: number
          mono_insatures?: number
          nom?: string
          omega_3_ala?: number
          omega_3_dha?: number
          omega_3_epa?: number
          omega_6?: number
          poly_insatures?: number
          proprietes_sante?: string[]
          proteines?: number
          ratio_omega3_omega6?: number
          saisons?: string[]
          selenium?: number
          vitamine_b12?: number
          vitamine_b6?: number
          vitamine_b9?: number
          vitamine_c?: number
          vitamine_d?: number
          zinc?: number
        }
        Relationships: []
      }
      aliments_selectionnes: {
        Row: {
          aliment_id: string
          date_selection: string
          id: string
          profil_id: string
        }
        Insert: {
          aliment_id: string
          date_selection?: string
          id?: string
          profil_id: string
        }
        Update: {
          aliment_id?: string
          date_selection?: string
          id?: string
          profil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aliments_selectionnes_aliment_id_fkey"
            columns: ["aliment_id"]
            isOneToOne: false
            referencedRelation: "aliments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aliments_selectionnes_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: false
            referencedRelation: "profils_utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      profils_utilisateurs: {
        Row: {
          calcium: number
          fer: number
          fibres: number
          glucides: number
          id: string
          lipides: number
          magnesium: number
          omega_3_total: number
          poids: number
          prenom: string
          proteines: number
          sexe: string
          vitamine_c: number
          vitamine_d: number
          zinc: number
        }
        Insert: {
          calcium?: number
          fer?: number
          fibres?: number
          glucides?: number
          id?: string
          lipides?: number
          magnesium?: number
          omega_3_total?: number
          poids: number
          prenom: string
          proteines?: number
          sexe: string
          vitamine_c?: number
          vitamine_d?: number
          zinc?: number
        }
        Update: {
          calcium?: number
          fer?: number
          fibres?: number
          glucides?: number
          id?: string
          lipides?: number
          magnesium?: number
          omega_3_total?: number
          poids?: number
          prenom?: string
          proteines?: number
          sexe?: string
          vitamine_c?: number
          vitamine_d?: number
          zinc?: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
