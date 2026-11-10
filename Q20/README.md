# TrustBank — MERN Savings Account Banking Application

A full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application engineered for maintaining savings accounts in a bank. It provides genuine account holders with a secure portal to **deposit** and **withdraw** funds, inspect real-time balances, view their digital transaction passbook, and open new verified accounts while enforcing core banking rules (including mandatory minimum balances and security PIN authorization).

---

## 🌟 Key Features

### 1. Genuine Account Holder Authentication & Security
- 🔒 **PIN-Based Transaction Authorization:** Every deposit and withdrawal requires the account holder's 4-digit security PIN, ensuring only genuine account owners can execute transactions.
- 🛡️ **KYC Genuine Holder Verification:** Accounts store verified Government ID / Passport details with visual genuine status badges.
- 🔑 **Account Authenticator:** Account holders can look up and access their savings dashboard by entering their unique Account Number and Security PIN.

### 2. Savings Account Deposit Operations
- 💵 **Real-Time Deposits:** Instant balance crediting with customizable amounts or quick preset chips ($50, $100, $250, $500, $1,000, $2,500).
- 📝 **Transaction Purpose & Remarks:** Option to attach payment notes (e.g. Salary, Dividend, Gift).
- 📈 **Instant Ledger Recording:** Generates an official reference ID (`TXN-XXXXXX-DEP`) with exact before-and-after balances.

### 3. Savings Account Withdrawal Operations
- 💸 **Funds Withdrawal with Minimum Balance Guard:**
  - Enforces the mandatory **$100.00 Minimum Balance Rule** for savings accounts.
  - Automatically calculates `Available to Withdraw = Total Balance - Minimum Balance ($100.00)`.
  - Rejects attempts to overdraft or deplete the account below the required minimum threshold.
- 🛑 **Daily Withdrawal Limits:** Configurable daily limits (default $5,000) to protect customer savings.

### 4. Interactive Digital Passbook & Ledger
- 📖 **Comprehensive Transaction History:** Filter by **All**, **Deposits**, or **Withdrawals**.
- ⏱️ **Timestamped Audit Trail:** Records date, time, reference ID, amount, and authorization source.

### 5. Onboarding / Open New Savings Account
- ➕ **KYC Account Wizard:** Onboard new genuine account holders with legal name, email, phone, government ID, security PIN, and mandatory minimum initial opening deposit ($100.00+).
- 🏷️ **Unique Account Number Generation:** Automatically creates a unique formatted 10-digit savings account identifier (e.g. `SB-10029384`).

### 6. Bank Manager & Teller Oversight Portal
- 🏦 **Institutional Reserves Dashboard:** View aggregate customer savings deposits, total withdrawal volumes, and active vs frozen accounts.
- ❄️ **Account Status Controls:** Capability to freeze/unfreeze accounts for compliance or suspicious activity.

### 7. Dual-Mode Database Resilience (Zero-Config)
- **MongoDB Connected:** Automatically persists to MongoDB via Mongoose schemas.
- **In-Memory Store Fallback:** If MongoDB is not running locally, the application automatically runs on a secure in-memory ledger so anyone can review and test the application immediately without database setup errors.

---

## 👥 Pre-Configured Demo Genuine Account Holders

For quick evaluation, the application comes with 3 pre-seeded genuine accounts:

| Holder Name | Account Number | Security PIN | Initial Balance | Account Type |
|---|---|---|---|---|
| **Sarah Jenkins** | `SB-10029384` | `1234` | **$5,420.00** | High-Yield Savings (3.85% APY) |
| **David Chen** | `SB-20048192` | `5678` | **$12,850.50** | High-Yield Savings (4.10% APY) |
| **Elena Rodriguez** | `SB-30071645` | `4321` | **$850.00** | Student Savings (3.50% APY) |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Lucide Icons, Plus Jakarta Sans & JetBrains Mono typography
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB & Mongoose (with fallback in-memory ledger)
- **Security:** bcryptjs (PIN hashing), CORS, Dotenv

---

## 📂 Project Directory Structure

```text
savings-bank-mern/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & fallback handler
│   ├── controllers/
│   │   ├── accountController.js  # Account retrieval, onboarding & PIN auth
│   │   └── transactionController.js # Deposit & Withdrawal processing
│   ├── models/
│   │   ├── Account.js            # Mongoose schema for savings accounts
│   │   └── Transaction.js        # Mongoose schema for deposits/withdrawals
│   ├── routes/
│   │   ├── accountRoutes.js      # /api/accounts
│   │   └── transactionRoutes.js  # /api/transactions
│   ├── data/
│   │   ├── seedAccounts.js       # Pre-seeded genuine account holders
│   │   └── memoryStore.js        # Zero-config in-memory ledger
│   ├── .env                      # Environment config (Port 5001)
│   ├── package.json
│   └── server.js                 # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation & view toggle
│   │   │   ├── HolderSwitcher.jsx       # Quick genuine holder switcher & login
│   │   │   ├── AccountSummaryCard.jsx   # Balance showcase & quick actions
│   │   │   ├── DepositModal.jsx         # Deposit money modal
│   │   │   ├── WithdrawModal.jsx        # Withdraw money modal
│   │   │   ├── PassbookLedger.jsx       # Digital passbook transaction table
│   │   │   ├── OpenAccountModal.jsx     # New savings account onboarding
│   │   │   └── BankManagerDashboard.jsx # Institutional reserves & accounts
│   │   ├── services/
│   │   │   └── api.js                   # Client REST API calls
│   │   ├── App.jsx                      # Main app container
│   │   └── index.css                    # Banking design system
│   ├── vite.config.js                   # Vite config (Port 3001, proxy to 5001)
│   └── package.json
├── package.json                         # Root runner scripts
└── README.md
```

---

## 🚀 How to Run the Application

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- *(Optional)* **MongoDB** (If not installed, the app uses its built-in in-memory store automatically).

---

### Step 1: Open Terminal
Navigate to the project root directory:
```bash
cd c:\Users\tatha\Downloads\savings-bank-mern
```

---

### Step 2: Start the Backend Server (Port 5001)

Open your first terminal window and run:
```bash
cd backend
npm install
npm start
```

You should see:
```text
======================================================
🏦 TrustBank Savings API running on http://localhost:5001
🔒 Genuine Account Holder Authentication & KYC Active
📦 Database: MongoDB (or In-Memory Store)
======================================================
```

---

### Step 3: Start the Frontend Application (Port 3001)

Open a **second** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

You will see:
```text
  VITE v8.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

Now open your web browser at:  
👉 **[http://localhost:3001](http://localhost:3001)**

---

## 📡 REST API Reference

### Accounts Endpoints (`/api/accounts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts` | Get all savings accounts (Manager view) |
| `GET` | `/api/accounts/:accountNumber` | Get single savings account by number |
| `POST` | `/api/accounts/verify-holder` | Verify genuine holder with Account # and PIN |
| `POST` | `/api/accounts` | Open a new savings account with minimum deposit |
| `PATCH` | `/api/accounts/:accountNumber/status` | Freeze or activate an account |
| `POST` | `/api/accounts/reset` | Reset demo accounts to initial state |

### Transaction Endpoints (`/api/transactions`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/deposit` | Deposit amount into savings account with PIN authorization |
| `POST` | `/api/transactions/withdraw` | Withdraw amount with PIN verification & minimum balance validation |
| `GET` | `/api/transactions` | Get transactions (supports `?accountNumber=SB-XXXX`) |

---

## 🧪 Testing the Complete Workflow

1. **Inspect Account Balance:**
   - On the homepage [http://localhost:3001](http://localhost:3001), view the active account for **Sarah Jenkins** (`$5,420.00`).
   - Click the eye icon next to the balance to toggle privacy mode.
2. **Deposit Funds:**
   - Click **"Deposit Money"**.
   - Select `+$500` or enter a custom amount.
   - Enter Sarah's 4-digit PIN: `1234`.
   - Click **"Deposit"**. Notice the balance increases to `$5,920.00` and a new green deposit entry appears in the passbook immediately.
3. **Withdraw Funds:**
   - Click **"Withdraw Money"**.
   - Notice the system displays the available balance (`$5,820.00`) which reserves the mandatory **$100.00** minimum balance.
   - Enter `$200.00` and PIN: `1234`.
   - Click **"Withdraw"**. The balance updates and the withdrawal is logged in the passbook ledger.
4. **Test Minimum Balance Enforcement:**
   - Attempt to withdraw an amount exceeding `Balance - $100`.
   - The app actively rejects the transaction with an alert explaining the mandatory savings minimum balance.
5. **Open a New Account:**
   - Click **"Open Savings Account"** in the top navigation.
   - Enter your name, email, phone, Government ID, a 4-digit PIN, and an opening deposit (e.g. `$350.00`).
   - Click **"Open & Verify Account"**. Your new `SB-XXXXXXXX` account number is issued immediately.
6. **Bank Manager Portal:**
   - Click **"Bank Manager Portal"** in the top navigation bar to audit all bank customer accounts, view global deposits/withdrawals, and freeze/unfreeze accounts.
