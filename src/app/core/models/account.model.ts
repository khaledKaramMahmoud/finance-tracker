export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  CREDIT_CARD = 'Credit Card',
  INVESTMENT = 'Investment',
  CASH = 'Cash'
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  currency?: string;
}


