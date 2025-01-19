# The Wallet

A comprehensive personal finance tracking system built with TypeScript, Express, React, and PostgreSQL. Manage your accounts, track expenses, and monitor your spending habits all in one place.

**Features**

* 📊 Track income and expenses
* 💳 Multiple account types (bank, mobile money, cash)
* 🏷️ Hierarchical transaction categories
* 💰 Spending limits and alerts
* 📱 Clean, modern interface
* 🔒 Secure data storage with PostgreSQL

**Tech Stack**

* **Frontend:** React
* **Backend:** Express.js with TypeScript
* **Database:** PostgreSQL

**Prerequisites**

* Node.js (v14 or higher)
* npm or yarn
* PostgreSQL
* Git

**Getting Started**

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd the-wallet
   
2. **Install dependencies**
```bash
# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../
npm install
```

3. **Environment setup**
```bash
# Create .env file in api directory
cp .env.example .env

# Add required environment variables
POSTGRES_URL=your_database_url
PORT=3000
```

4. **Start development servers**
```bash
# Start backend (from api directory)
npm run dev

# Start frontend (from root directory)
npm run dev
```

### Project Structure

#### Backend
```
the-wallet/
├── api/                     # TypeScript Express backend
│   ├── src/
│   │   ├── types.ts        # Type definitions
│   │   ├── db.ts          # Database connection
│   │   └── index.ts       # Express API routes
│   ├── package.json
│   └── tsconfig.json
├── src/                    # React frontend
└── package.json
```
#### Front end
```
── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── containers/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── package.json
├── index.html
├── eslint.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
├── README.md
└── vite.config.ts 
```
## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- Parameters:
  - `account_id`: number
  - `category_id`: number
  - `amount`: number
  - `type`: 'income' | 'expense'
  - `description`: string

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

## Database Connection

Connect to your PostgreSQL database using psql:
```bash
psql "postgres://username:password@host:5432/database"
```

### Available Scripts

In the project directory:

```bash
# Run development server
npm run dev

# Build for production
npm run build

```
### Deployement link

[The Wallet](https://wallet-task-force.vercel.app/)

## License

MIT License - feel free to use this project for your own purposes.

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request