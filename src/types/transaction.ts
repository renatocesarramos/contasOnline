export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  paid: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}