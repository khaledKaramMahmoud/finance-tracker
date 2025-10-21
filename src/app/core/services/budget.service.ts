import { Injectable, signal, computed } from '@angular/core';
import { Budget, CreateBudgetRequest, UpdateBudgetRequest, BudgetPeriod } from '../models/budget.model';
import { TransactionCategory } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  // Signal for reactive budget list
  private budgetsSignal = signal<Budget[]>(this.loadMockBudgets());

  // Public readonly signals
  budgets = this.budgetsSignal.asReadonly();

  // Computed signal for budgets with progress
  budgetsWithProgress = computed(() => {
    return this.budgetsSignal().map(budget => ({
      ...budget,
      progress: (budget.spent / budget.amount) * 100,
      remaining: budget.amount - budget.spent,
      isOverBudget: budget.spent > budget.amount
    }));
  });

  /**
   * Get all budgets
   */
  getBudgets(): Promise<Budget[]> {
    return Promise.resolve(this.budgetsSignal());
  }

  /**
   * Get budget by ID
   */
  getBudgetById(id: string): Promise<Budget | undefined> {
    const budget = this.budgetsSignal().find(b => b.id === id);
    return Promise.resolve(budget);
  }

  /**
   * Create new budget
   */
  createBudget(request: CreateBudgetRequest): Promise<Budget> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const endDate = this.calculateEndDate(request.startDate, request.period);
        
        const newBudget: Budget = {
          id: this.generateId(),
          userId: '1', // Mock user ID
          ...request,
          spent: 0,
          endDate,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.budgetsSignal.update(budgets => [...budgets, newBudget]);
        resolve(newBudget);
      }, 300);
    });
  }

  /**
   * Update budget
   */
  updateBudget(id: string, request: UpdateBudgetRequest): Promise<Budget> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.budgetsSignal().findIndex(b => b.id === id);
        if (index !== -1) {
          const currentBudget = this.budgetsSignal()[index];
          const updatedBudget: Budget = {
            ...currentBudget,
            ...request,
            updatedAt: new Date()
          };

          this.budgetsSignal.update(budgets => {
            const newBudgets = [...budgets];
            newBudgets[index] = updatedBudget;
            return newBudgets;
          });

          resolve(updatedBudget);
        } else {
          reject({ error: 'Budget not found' });
        }
      }, 300);
    });
  }

  /**
   * Delete budget
   */
  deleteBudget(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = this.budgetsSignal().some(b => b.id === id);
        if (exists) {
          this.budgetsSignal.update(budgets => budgets.filter(b => b.id !== id));
          resolve();
        } else {
          reject({ error: 'Budget not found' });
        }
      }, 300);
    });
  }

  /**
   * Update spent amount for a budget category
   */
  updateSpent(category: TransactionCategory, amount: number): void {
    this.budgetsSignal.update(budgets => {
      return budgets.map(budget => {
        if (budget.category === category) {
          return {
            ...budget,
            spent: budget.spent + amount,
            updatedAt: new Date()
          };
        }
        return budget;
      });
    });
  }

  /**
   * Calculate end date based on period
   */
  private calculateEndDate(startDate: Date, period: BudgetPeriod): Date {
    const date = new Date(startDate);
    switch (period) {
      case BudgetPeriod.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case BudgetPeriod.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case BudgetPeriod.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  }

  /**
   * Load mock budgets
   */
  private loadMockBudgets(): Budget[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return [
      {
        id: '1',
        userId: '1',
        category: TransactionCategory.FOOD,
        amount: 600,
        spent: 250,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        createdAt: startOfMonth,
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: '1',
        category: TransactionCategory.ENTERTAINMENT,
        amount: 300,
        spent: 80,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        createdAt: startOfMonth,
        updatedAt: new Date()
      },
      {
        id: '3',
        userId: '1',
        category: TransactionCategory.TRANSPORT,
        amount: 200,
        spent: 120,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        createdAt: startOfMonth,
        updatedAt: new Date()
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


