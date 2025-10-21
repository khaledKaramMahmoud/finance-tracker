export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum TransactionCategory {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  HEALTHCARE = 'Healthcare',
  SHOPPING = 'Shopping',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  category?: TransactionCategory;
  amount?: number;
  description?: string;
  date?: Date;
}


