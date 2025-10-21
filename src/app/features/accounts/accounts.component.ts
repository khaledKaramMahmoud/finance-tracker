import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { Account, AccountType, CreateAccountRequest } from '../../core/models/account.model';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  showModal = signal(false);
  isEditMode = signal(false);
  editingAccountId = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  accountForm: FormGroup;

  // Enums for template
  AccountType = AccountType;
  
  // Arrays for dropdowns
  accountTypes = Object.values(AccountType);

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: [AccountType.CHECKING, Validators.required],
      balance: ['', [Validators.required]],
      currency: ['USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingAccountId.set(null);
    this.accountForm.reset({
      type: AccountType.CHECKING,
      currency: 'USD'
    });
    this.showModal.set(true);
  }

  openEditModal(account: Account): void {
    this.isEditMode.set(true);
    this.editingAccountId.set(account.id);
    this.accountForm.patchValue({
      name: account.name,
      type: account.type,
      currency: account.currency
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.errorMessage.set(null);
    this.accountForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.accountForm.invalid) {
      this.markFormGroupTouched(this.accountForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      if (this.isEditMode()) {
        const { balance, ...updateData } = this.accountForm.value;
        await this.accountService.updateAccount(
          this.editingAccountId()!,
          updateData
        );
      } else {
        const request: CreateAccountRequest = {
          ...this.accountForm.value,
          balance: parseFloat(this.accountForm.value.balance)
        };
        await this.accountService.createAccount(request);
      }

      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.error || 'Operation failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      return;
    }

    try {
      await this.accountService.deleteAccount(id);
    } catch (error: any) {
      alert('Failed to delete account: ' + (error.error || 'Unknown error'));
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getAccountIcon(type: AccountType): string {
    const icons: Record<AccountType, string> = {
      [AccountType.CHECKING]: '💳',
      [AccountType.SAVINGS]: '🏦',
      [AccountType.CREDIT_CARD]: '💎',
      [AccountType.INVESTMENT]: '📈',
      [AccountType.CASH]: '💵'
    };
    return icons[type];
  }

  getAccountColor(type: AccountType): string {
    const colors: Record<AccountType, string> = {
      [AccountType.CHECKING]: 'checking',
      [AccountType.SAVINGS]: 'savings',
      [AccountType.CREDIT_CARD]: 'credit',
      [AccountType.INVESTMENT]: 'investment',
      [AccountType.CASH]: 'cash'
    };
    return colors[type];
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

  get name() {
    return this.accountForm.get('name');
  }

  get type() {
    return this.accountForm.get('type');
  }

  get balance() {
    return this.accountForm.get('balance');
  }

  get currency() {
    return this.accountForm.get('currency');
  }
}

