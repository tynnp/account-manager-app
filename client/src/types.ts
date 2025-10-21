export interface Account {
  _id: string; 
  name: string;
  username: string;
  category: 'banking' | 'social' | 'email' | 'work' | 'database' | 'other';
  passwords: Password[];
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Password {
  _id: string;
  label: string;
  value: string;
}
