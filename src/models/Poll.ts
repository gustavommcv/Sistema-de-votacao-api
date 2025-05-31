export interface IPoll {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
}
