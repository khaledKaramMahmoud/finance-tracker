# 💰 Finance Tracker

A comprehensive Angular finance management application showcasing modern Angular features and best practices.

## 🌟 Features

### Core Functionality
- **User Authentication** - Login and registration with route guards
- **Transaction Management** - Full CRUD operations for income and expenses
- **Account Management** - Track multiple financial accounts
- **Budget Tracking** - Set and monitor spending budgets by category
- **Real-time Dashboard** - Live updates using Angular Signals
- **Advanced Filtering** - Filter transactions by type, category, and date range

### Angular Concepts Demonstrated

#### ✨ Signals & Reactivity
- **Signals** for reactive state management
- **Computed signals** for derived state (filtered transactions, budget progress)
- **Effects** for side effects and logging
- Real-time UI updates without manual change detection

#### 🛡️ Routing & Guards
- **Lazy loading** for optimized bundle size
- **Route guards** (`CanActivateFn`) for authentication
- **Protected routes** for authenticated users only
- **Guest guards** to prevent authenticated users from accessing auth pages

#### 🔄 HTTP & Interceptors
- **HTTP Interceptor** for automatic token attachment
- Mock API services simulating backend calls
- Proper error handling and loading states

#### 📝 Forms
- **Reactive Forms** with validation
- Custom validators (password matching)
- Real-time validation feedback
- Form state management

#### 🎨 Modern UI/UX
- Beautiful gradient designs
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive user interface
- Clean and modern design

## 🏗️ Project Structure

```
src/app/
├── core/                    # Core functionality
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts
│   ├── models/             # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── transaction.model.ts
│   │   ├── account.model.ts
│   │   └── budget.model.ts
│   └── services/           # Business logic services
│       ├── auth.service.ts
│       ├── transaction.service.ts
│       ├── account.service.ts
│       └── budget.service.ts
├── features/               # Feature modules
│   ├── auth/              # Authentication
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Main dashboard
│   ├── transactions/      # Transaction management
│   ├── accounts/          # Account management
│   └── budgets/           # Budget tracking
├── app.component.ts       # Root component
├── app.config.ts          # App configuration
└── app.routes.ts          # Route definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository** (or navigate to the project folder)
   ```bash
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Default Login
The app uses mock authentication. You can login with:
- **Email**: Any valid email format (e.g., demo@example.com)
- **Password**: Any password with 6+ characters (e.g., demo123)

## 📚 Key Angular Features

### 1. Signals for State Management
```typescript
// Reactive state with signals
private transactionsSignal = signal<Transaction[]>([]);

// Computed derived state
totalBalance = computed(() => {
  return this.transactionsSignal().reduce((balance, transaction) => {
    return transaction.type === TransactionType.INCOME 
      ? balance + transaction.amount 
      : balance - transaction.amount;
  }, 0);
});

// Effects for side effects
effect(() => {
  console.log('Balance changed:', this.totalBalance());
});
```

### 2. Advanced Filtering with Computed Signals
```typescript
filteredTransactions = computed(() => {
  let transactions = this.transactionService.transactions();
  
  if (this.filterType() !== 'ALL') {
    transactions = transactions.filter(t => t.type === this.filterType());
  }
  
  if (this.filterCategory() !== 'ALL') {
    transactions = transactions.filter(t => t.category === this.filterCategory());
  }
  
  return transactions;
});
```

### 3. HTTP Interceptor for Authentication
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
```

### 4. Route Guards
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
```

### 5. Reactive Forms with Validation
```typescript
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

## 🎯 Use Cases Covered

1. **Authentication Flow**
   - User registration with validation
   - Login with credential verification
   - Protected routes
   - Logout functionality

2. **CRUD Operations**
   - Create transactions, accounts, and budgets
   - Read and display data in various views
   - Update existing records
   - Delete with confirmation

3. **Real-time Updates**
   - Instant balance calculation
   - Live budget progress tracking
   - Filtered views update automatically

4. **Data Filtering**
   - Filter by transaction type (Income/Expense)
   - Filter by category
   - Filter by date range
   - Combined filters with computed signals

5. **Responsive Design**
   - Mobile-first approach
   - Tablet optimization
   - Desktop layouts
   - Touch-friendly interfaces

## 🛠️ Technologies Used

- **Angular 19** - Latest version with standalone components
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **SCSS** - Advanced styling
- **Angular Signals** - Modern reactive state management
- **Angular Router** - Navigation and routing
- **Reactive Forms** - Form handling and validation

## 📊 Mock Data

The application uses mock data services that simulate API calls:
- Transactions (Income/Expense tracking)
- Accounts (Checking, Savings, Credit Card, etc.)
- Budgets (Monthly spending limits)
- User authentication

## 🎨 Design Highlights

- **Modern Gradient UI** - Beautiful purple gradient theme
- **Card-based Layout** - Clean and organized
- **Smooth Animations** - Professional transitions
- **Icon Integration** - Emoji-based icons for visual appeal
- **Responsive Grid** - Adapts to all screen sizes
- **Accessible** - WCAG compliant color contrasts

## 📝 Code Quality

- **TypeScript Strict Mode** - Type safety
- **Component Architecture** - Modular and reusable
- **Service Layer** - Separation of concerns
- **Signal-based State** - Modern reactive patterns
- **Lazy Loading** - Optimized performance
- **Clean Code** - Well-documented and maintainable

## 🔄 State Management Flow

```
User Action → Component → Service (with Signals) → Update Signal → Computed Signals Recalculate → UI Updates Automatically
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📈 Performance

- **Lazy Loading** - Routes loaded on demand
- **Signals** - Efficient change detection
- **OnPush Strategy** - Optimized rendering (implicit with signals)
- **Tree Shaking** - Minimal bundle size

## 🚧 Future Enhancements

- [ ] Charts and visualizations (Chart.js/D3.js)
- [ ] Export to PDF/CSV
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Data persistence (Local Storage/IndexedDB)
- [ ] Backend API integration
- [ ] Real-time sync across devices
- [ ] Advanced analytics
- [ ] Notifications and alerts
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

## 📄 License

This project is created for educational and portfolio purposes.

## 👨‍💻 Developer

Built with ❤️ using Angular 19

---

**Perfect for CV/Portfolio** ✨
- Demonstrates modern Angular skills
- Shows best practices
- Clean, maintainable code
- Real-world application design
- Comprehensive feature set
