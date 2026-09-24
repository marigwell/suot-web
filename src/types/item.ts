export type Item = {
  id: number;
  user_id: number;
  name: string;
  brand: string | null;
  category: string;
  color: string;
  size: string;
  price: string | null;
  purchase_date: string | null;
  condition: string | null;
  notes: string | null;
};

export type ItemPage = {
  items: Item[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
};

export type ItemCreate = {
  name: string;
  brand?: string | null;
  category: string;
  color: string;
  size: string;
  price?: string | null
  purchase_date?: string | null;
  condition?: string | null;
  notes?: string | null;
}

export type ItemUpdate = {
  name?: string;
  brand?: string | null;
  category?: string;
  color?: string;
  size?: string;
  price?: string | null;
  purchase_date?: string | null;
  condition?: string | null;
  notes?: string | null;
};