# 🚀 Quick Start Guide

## Running the Application

### 1. Start Development Server
```bash
npm start
```
or
```bash
ng serve
```

The app will be available at: **http://localhost:4200**

### 2. Login
Use any credentials (mock authentication):
- **Email**: demo@example.com (or any valid email)
- **Password**: demo123 (or any password 6+ characters)

### 3. Explore Features

## 📱 Navigation Flow

```
Login → Dashboard → Explore Features
```

### Dashboard
- View financial overview
- See recent transactions
- Check budget progress
- Filter transactions by type, category, date

### Transactions
- Add new income/expense
- Edit existing transactions
- Delete transactions
- View transaction history

### Accounts
- Create new accounts (Checking, Savings, Credit Card, etc.)
- Edit account details
- View account balances
- Delete accounts

### Budgets
- Set spending budgets by category
- Track budget progress
- View spending vs. budget
- Get alerts when over budget

## 🎯 Quick Actions

### Add a Transaction
1. Go to Transactions or click "Add Transaction" button
2. Select account
3. Choose type (Income/Expense)
4. Select category
5. Enter amount and description
6. Set date
7. Click "Create"

### Create a Budget
1. Go to Budgets
2. Click "Create Budget"
3. Select category (Food, Transport, etc.)
4. Set budget amount
5. Choose period (Weekly/Monthly/Yearly)
6. Select start date
7. Click "Create"

### Filter Transactions
1. On Dashboard
2. Use filter dropdowns:
   - Filter by Type (Income/Expense)
   - Filter by Category
   - Filter by Date Range
3. View filtered results and statistics
4. Click "Clear Filters" to reset

## 🎨 Features to Explore

### Real-time Updates
- Add a transaction and watch the balance update instantly
- Edit amounts and see statistics recalculate
- Delete items and UI updates automatically

### Responsive Design
- Resize browser window to see responsive layouts
- Try on mobile device
- Test on tablet

### Form Validation
- Try submitting empty forms to see validation
- Test email format validation
- Try password mismatch in registration

### Authentication Flow
- Logout and login again
- Try accessing protected routes without login
- Register a new account

## 📊 Mock Data Included

The app comes with sample data:
- **5 transactions** (mix of income and expenses)
- **3 accounts** (Checking, Savings, Credit Card)
- **3 budgets** (Food, Entertainment, Transport)

You can:
- Modify this data
- Delete it
- Add your own

## 🔍 Testing Checklist

- [ ] Login with any credentials
- [ ] View dashboard overview
- [ ] Filter transactions by different criteria
- [ ] Add a new transaction
- [ ] Edit an existing transaction
- [ ] Delete a transaction
- [ ] Create a new account
- [ ] Edit an account
- [ ] Delete an account
- [ ] Create a budget
- [ ] Edit a budget
- [ ] Delete a budget
- [ ] Test responsive design (resize window)
- [ ] Logout
- [ ] Try accessing protected route (should redirect to login)

## 🛠️ Development Commands

### Run Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
ng lint
```

## 📱 Browser DevTools

### Check Signals in Action
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Perform actions (add transaction, filter, etc.)
4. See console logs showing signal updates

### View HTTP Interceptor
1. Open DevTools → Network tab
2. Perform any action that would trigger API call
3. Check request headers
4. See "Authorization: Bearer [token]" added automatically

## 🎓 Code Structure to Review

### Start with these files:
1. `src/app/app.routes.ts` - Routing configuration
2. `src/app/app.config.ts` - App configuration
3. `src/app/core/services/transaction.service.ts` - Signals in action
4. `src/app/features/dashboard/dashboard.component.ts` - Computed signals & filtering
5. `src/app/core/guards/auth.guard.ts` - Route guards
6. `src/app/core/interceptors/auth.interceptor.ts` - HTTP interceptor

## 💡 Tips

### Understanding Signals
- Look for `signal()`, `computed()`, and `effect()` in services
- Notice how UI updates automatically when signals change
- No need for `ChangeDetectorRef` or manual updates

### Lazy Loading
- Check Network tab when navigating
- See chunks loaded on demand
- Only initial route loads at startup

### Form Validation
- Try submitting empty forms
- See real-time validation feedback
- Check error messages

### Responsive Design
- Use browser responsive mode (F12 → Toggle Device Toolbar)
- Test different screen sizes
- See layout adaptations

## 🐛 Troubleshooting

### Port Already in Use
```bash
ng serve --port 4300
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Rebuild
```bash
npm run build
```

## 📚 Next Steps

1. **Explore the code** - Read through components and services
2. **Modify features** - Add your own categories or transaction types
3. **Extend functionality** - Add charts, reports, export features
4. **Customize design** - Change colors, layouts, themes
5. **Add backend** - Connect to real API
6. **Deploy** - Host on Vercel, Netlify, or Firebase

## 🎉 Enjoy!

You now have a fully functional Angular finance tracker showcasing modern Angular features. Perfect for learning, portfolio, or as a starting point for a real application!

---

**Questions?** Check the code comments and README.md for detailed information.



