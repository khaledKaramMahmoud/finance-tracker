import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AccountService } from '../../core/services/account.service';
import { BudgetService } from '../../core/services/budget.service';
import { TransactionType, TransactionCategory } from '../../core/models/transaction.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Filter signals
  filterType = signal<'ALL' | TransactionType>('ALL');
  filterCategory = signal<'ALL' | TransactionCategory>('ALL');
  filterDateFrom = signal<string>('');
  filterDateTo = signal<string>('');

  // Computed filtered transactions using signals
  filteredTransactions = computed(() => {
    let transactions = this.transactionService.transactions();

    // Filter by type
    if (this.filterType() !== 'ALL') {
      transactions = transactions.filter(t => t.type === this.filterType());
    }

    // Filter by category
    if (this.filterCategory() !== 'ALL') {
      transactions = transactions.filter(t => t.category === this.filterCategory());
    }

    // Filter by date range
    if (this.filterDateFrom()) {
      const fromDate = new Date(this.filterDateFrom());
      transactions = transactions.filter(t => new Date(t.date) >= fromDate);
    }

    if (this.filterDateTo()) {
      const toDate = new Date(this.filterDateTo());
      transactions = transactions.filter(t => new Date(t.date) <= toDate);
    }

    // Sort by date (newest first)
    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  // Computed statistics from filtered data
  filteredIncome = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  filteredExpenses = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  filteredBalance = computed(() => {
    return this.filteredIncome() - this.filteredExpenses();
  });

  // Enums for template
  TransactionType = TransactionType;
  TransactionCategory = TransactionCategory;

  // Categories array for dropdown
  categories = Object.values(TransactionCategory);

  constructor(
    public authService: AuthService,
    public transactionService: TransactionService,
    public accountService: AccountService,
    public budgetService: BudgetService,
    private router: Router
  ) {
    // Effect to log filter changes
    effect(() => {
      console.log('Filters changed:', {
        type: this.filterType(),
        category: this.filterCategory(),
        dateFrom: this.filterDateFrom(),
        dateTo: this.filterDateTo(),
        resultCount: this.filteredTransactions().length
      });
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  navigateToBudgets(): void {
    this.router.navigate(['/budgets']);
  }

  clearFilters(): void {
    this.filterType.set('ALL');
    this.filterCategory.set('ALL');
    this.filterDateFrom.set('');
    this.filterDateTo.set('');
  }

  hasActiveFilters(): boolean {
    return this.filterType() !== 'ALL' || 
           this.filterCategory() !== 'ALL' || 
           !!this.filterDateFrom() || 
           !!this.filterDateTo();
  }

  getAccountName(accountId: string): string {
    const account = this.accountService.accounts().find(a => a.id === accountId);
    return account?.name || 'Unknown Account';
  }

  getCategoryIcon(category: TransactionCategory): string {
    const icons: Record<TransactionCategory, string> = {
      [TransactionCategory.SALARY]: '💼',
      [TransactionCategory.FREELANCE]: '💻',
      [TransactionCategory.INVESTMENT]: '📈',
      [TransactionCategory.FOOD]: '🍔',
      [TransactionCategory.TRANSPORT]: '🚗',
      [TransactionCategory.ENTERTAINMENT]: '🎮',
      [TransactionCategory.UTILITIES]: '💡',
      [TransactionCategory.HEALTHCARE]: '🏥',
      [TransactionCategory.SHOPPING]: '🛍️',
      [TransactionCategory.OTHER]: '📦'
    };
    return icons[category];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

