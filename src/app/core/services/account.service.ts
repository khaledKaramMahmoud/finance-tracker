import { Injectable, signal, computed } from '@angular/core';
import { Account, CreateAccountRequest, UpdateAccountRequest, AccountType } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Signal for reactive account list
  private accountsSignal = signal<Account[]>(this.loadMockAccounts());

  // Public readonly signals
  accounts = this.accountsSignal.asReadonly();

  // Computed signal for total balance across all accounts
  totalBalance = computed(() => {
    return this.accountsSignal().reduce((total, account) => total + account.balance, 0);
  });

  /**
   * Get all accounts
   */
  getAccounts(): Promise<Account[]> {
    return Promise.resolve(this.accountsSignal());
  }

  /**
   * Get account by ID
   */
  getAccountById(id: string): Promise<Account | undefined> {
    const account = this.accountsSignal().find(a => a.id === id);
    return Promise.resolve(account);
  }

  /**
   * Create new account
   */
  createAccount(request: CreateAccountRequest): Promise<Account> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAccount: Account = {
          id: this.generateId(),
          userId: '1', // Mock user ID
          ...request,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.accountsSignal.update(accounts => [...accounts, newAccount]);
        resolve(newAccount);
      }, 300);
    });
  }

  /**
   * Update account
   */
  updateAccount(id: string, request: UpdateAccountRequest): Promise<Account> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.accountsSignal().findIndex(a => a.id === id);
        if (index !== -1) {
          const updatedAccount: Account = {
            ...this.accountsSignal()[index],
            ...request,
            updatedAt: new Date()
          };

          this.accountsSignal.update(accounts => {
            const newAccounts = [...accounts];
            newAccounts[index] = updatedAccount;
            return newAccounts;
          });

          resolve(updatedAccount);
        } else {
          reject({ error: 'Account not found' });
        }
      }, 300);
    });
  }

  /**
   * Delete account
   */
  deleteAccount(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = this.accountsSignal().some(a => a.id === id);
        if (exists) {
          this.accountsSignal.update(accounts => accounts.filter(a => a.id !== id));
          resolve();
        } else {
          reject({ error: 'Account not found' });
        }
      }, 300);
    });
  }

  /**
   * Update account balance
   */
  updateBalance(accountId: string, amount: number, isIncome: boolean): void {
    this.accountsSignal.update(accounts => {
      return accounts.map(account => {
        if (account.id === accountId) {
          return {
            ...account,
            balance: isIncome ? account.balance + amount : account.balance - amount,
            updatedAt: new Date()
          };
        }
        return account;
      });
    });
  }

  /**
   * Load mock accounts
   */
  private loadMockAccounts(): Account[] {
    return [
      {
        id: '1',
        userId: '1',
        name: 'Main Checking',
        type: AccountType.CHECKING,
        balance: 15420,
        currency: 'USD',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-10-12')
      },
      {
        id: '2',
        userId: '1',
        name: 'Savings Account',
        type: AccountType.SAVINGS,
        balance: 25000,
        currency: 'USD',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-10-12')
      },
      {
        id: '3',
        userId: '1',
        name: 'Credit Card',
        type: AccountType.CREDIT_CARD,
        balance: -1250,
        currency: 'USD',
        createdAt: new Date('2025-03-15'),
        updatedAt: new Date('2025-10-12')
      }
    ];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}


