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

export interface IPollWithOptions extends IPoll {
  options: {
    id: number;
    text: string;
    votes_count: number;
  }[];
  user_vote?: number;
}
