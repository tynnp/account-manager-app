export interface Account {
  id: string;
  name: string;
  username: string;
  category: 'banking' | 'social' | 'email' | 'work' | 'other';
  passwords: Password[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Password {
  id: string;
  label: string;
  value: string;
}
