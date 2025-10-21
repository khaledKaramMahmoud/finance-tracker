import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { Budget, BudgetPeriod, CreateBudgetRequest } from '../../core/models/budget.model';
import { TransactionCategory } from '../../core/models/transaction.model';

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {
  showModal = signal(false);
  isEditMode = signal(false);
  editingBudgetId = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  budgetForm: FormGroup;

  // Enums for template
  TransactionCategory = TransactionCategory;
  BudgetPeriod = BudgetPeriod;

  // Arrays for dropdowns
  categories = Object.values(TransactionCategory).filter(c => 
    c !== TransactionCategory.SALARY && 
    c !== TransactionCategory.FREELANCE && 
    c !== TransactionCategory.INVESTMENT
  );
  periods = Object.values(BudgetPeriod);

  constructor(
    private fb: FormBuilder,
    public budgetService: BudgetService
  ) {
    this.budgetForm = this.fb.group({
      category: [TransactionCategory.FOOD, Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      period: [BudgetPeriod.MONTHLY, Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingBudgetId.set(null);
    this.budgetForm.reset({
      category: TransactionCategory.FOOD,
      period: BudgetPeriod.MONTHLY,
      startDate: new Date().toISOString().split('T')[0]
    });
    this.showModal.set(true);
  }

  openEditModal(budget: Budget): void {
    this.isEditMode.set(true);
    this.editingBudgetId.set(budget.id);
    this.budgetForm.patchValue({
      category: budget.category,
      amount: budget.amount,
      period: budget.period
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.errorMessage.set(null);
    this.budgetForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.budgetForm.invalid) {
      this.markFormGroupTouched(this.budgetForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const formValue = this.budgetForm.value;

      if (this.isEditMode()) {
        const { startDate, ...updateData } = formValue;
        await this.budgetService.updateBudget(
          this.editingBudgetId()!,
          { ...updateData, amount: parseFloat(updateData.amount) }
        );
      } else {
        const request: CreateBudgetRequest = {
          category: formValue.category,
          amount: parseFloat(formValue.amount),
          period: formValue.period,
          startDate: new Date(formValue.startDate)
        };
        await this.budgetService.createBudget(request);
      }

      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.error || 'Operation failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteBudget(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await this.budgetService.deleteBudget(id);
    } catch (error: any) {
      alert('Failed to delete budget: ' + (error.error || 'Unknown error'));
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(budget: any): string {
    if (budget.isOverBudget) return 'over-budget';
    if (budget.progress >= 80) return 'warning';
    return 'good';
  }

  get category() {
    return this.budgetForm.get('category');
  }

  get amount() {
    return this.budgetForm.get('amount');
  }

  get period() {
    return this.budgetForm.get('period');
  }

  get startDate() {
    return this.budgetForm.get('startDate');
  }
}

