import { TransactionCategory } from './transaction.model';

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum BudgetPeriod {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

export interface CreateBudgetRequest {
  category: TransactionCategory;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
}

export interface UpdateBudgetRequest {
  category?: TransactionCategory;
  amount?: number;
  period?: BudgetPeriod;
}


