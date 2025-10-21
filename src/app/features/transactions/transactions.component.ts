import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { AccountService } from '../../core/services/account.service';
import { Transaction, TransactionType, TransactionCategory, CreateTransactionRequest } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  showModal = signal(false);
  isEditMode = signal(false);
  editingTransactionId = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  transactionForm: FormGroup;

  // Enums for template
  TransactionType = TransactionType;
  TransactionCategory = TransactionCategory;

  // Arrays for dropdowns
  types = Object.values(TransactionType);
  categories = Object.values(TransactionCategory);

  constructor(
    private fb: FormBuilder,
    public transactionService: TransactionService,
    public accountService: AccountService
  ) {
    this.transactionForm = this.fb.group({
      accountId: ['', Validators.required],
      type: [TransactionType.EXPENSE, Validators.required],
      category: [TransactionCategory.OTHER, Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingTransactionId.set(null);
    this.transactionForm.reset({
      type: TransactionType.EXPENSE,
      category: TransactionCategory.OTHER,
      date: new Date().toISOString().split('T')[0]
    });
    this.showModal.set(true);
  }

  openEditModal(transaction: Transaction): void {
    this.isEditMode.set(true);
    this.editingTransactionId.set(transaction.id);
    this.transactionForm.patchValue({
      accountId: transaction.accountId,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.errorMessage.set(null);
    this.transactionForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.transactionForm.invalid) {
      this.markFormGroupTouched(this.transactionForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const formValue = this.transactionForm.value;
      const request: CreateTransactionRequest = {
        ...formValue,
        date: new Date(formValue.date),
        amount: parseFloat(formValue.amount)
      };

      if (this.isEditMode()) {
        await this.transactionService.updateTransaction(
          this.editingTransactionId()!,
          request
        );
      } else {
        await this.transactionService.createTransaction(request);
      }

      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.error || 'Operation failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await this.transactionService.deleteTransaction(id);
    } catch (error: any) {
      alert('Failed to delete transaction: ' + (error.error || 'Unknown error'));
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
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

  get accountId() {
    return this.transactionForm.get('accountId');
  }

  get type() {
    return this.transactionForm.get('type');
  }

  get category() {
    return this.transactionForm.get('category');
  }

  get amount() {
    return this.transactionForm.get('amount');
  }

  get description() {
    return this.transactionForm.get('description');
  }

  get date() {
    return this.transactionForm.get('date');
  }
}

