import { Injectable, signal, computed, effect } from '@angular/core';
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest, TransactionType, TransactionCategory } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Signal for reactive transaction list
  private transactionsSignal = signal<Transaction[]>(this.loadMockTransactions());
  
  // Public readonly signals
  transactions = this.transactionsSignal.asReadonly();

  // Computed signal for total balance
  totalBalance = computed(() => {
    return this.transactionsSignal().reduce((balance, transaction) => {
      return transaction.type === TransactionType.INCOME 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  });

  // Computed signal for total income
  totalIncome = computed(() => {
    return this.transactionsSignal()
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  // Computed signal for total expenses
  totalExpenses = computed(() => {
    return this.transactionsSignal()
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  constructor() {
    // Effect to log balance changes
    effect(() => {
      console.log('Current balance:', this.totalBalance());
    });
  }

  /**
   * Get all transactions
   */
  getTransactions(): Promise<Transaction[]> {
    return Promise.resolve(this.transactionsSignal());
  }

  /**
   * Get transaction by ID
   */
  getTransactionById(id: string): Promise<Transaction | undefined> {
    const transaction = this.transactionsSignal().find(t => t.id === id);
    return Promise.resolve(transaction);
  }

  /**
   * Create new transaction
   */
  createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction: Transaction = {
          id: this.generateId(),
          ...request,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.transactionsSignal.update(transactions => [...transactions, newTransaction]);
        resolve(newTransaction);
      }, 300);
    });
  }

  /**
   * Update transaction
   */
  updateTransaction(id: string, request: UpdateTransactionRequest): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.transactionsSignal().findIndex(t => t.id === id);
        if (index !== -1) {
          const updatedTransaction: Transaction = {
            ...this.transactionsSignal()[index],
            ...request,
            updatedAt: new Date()
          };

          this.transactionsSignal.update(transactions => {
            const newTransactions = [...transactions];
            newTransactions[index] = updatedTransaction;
            return newTransactions;
          });

          resolve(updatedTransaction);
        } else {
          reject({ error: 'Transaction not found' });
        }
      }, 300);
    });
  }

  /**
   * Delete transaction
   */
  deleteTransaction(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = this.transactionsSignal().some(t => t.id === id);
        if (exists) {
          this.transactionsSignal.update(transactions => 
            transactions.filter(t => t.id !== id)
          );
          resolve();
        } else {
          reject({ error: 'Transaction not found' });
        }
      }, 300);
    });
  }

  /**
   * Get transactions by account
   */
  getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const accountTransactions = this.transactionsSignal().filter(t => t.accountId === accountId);
    return Promise.resolve(accountTransactions);
  }

  /**
   * Load mock transactions
   */
  private loadMockTransactions(): Transaction[] {
    const mockData = [
      {
        id: '1',
        accountId: '1',
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        amount: 5000,
        description: 'Monthly Salary',
        date: new Date('2025-10-01'),
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-10-01')
      },
      {
        id: '2',
        accountId: '1',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        amount: 250,
        description: 'Grocery Shopping',
        date: new Date('2025-10-05'),
        createdAt: new Date('2025-10-05'),
        updatedAt: new Date('2025-10-05')
      },
      {
        id: '3',
        accountId: '1',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.TRANSPORT,
        amount: 120,
        description: 'Gas and Parking',
        date: new Date('2025-10-07'),
        createdAt: new Date('2025-10-07'),
        updatedAt: new Date('2025-10-07')
      },
      {
        id: '4',
        accountId: '2',
        type: TransactionType.INCOME,
        category: TransactionCategory.FREELANCE,
        amount: 1200,
        description: 'Web Development Project',
        date: new Date('2025-10-08'),
        createdAt: new Date('2025-10-08'),
        updatedAt: new Date('2025-10-08')
      },
      {
        id: '5',
        accountId: '1',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.ENTERTAINMENT,
        amount: 80,
        description: 'Movie and Dinner',
        date: new Date('2025-10-10'),
        createdAt: new Date('2025-10-10'),
        updatedAt: new Date('2025-10-10')
      }
    ];
    return mockData;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}


