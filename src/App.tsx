import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, Plus } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ThemeSwitch } from './components/ThemeSwitch';
import { Transaction } from './types/transaction';

const initialTransactions = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Salário',
    category: 'Renda',
    date: new Date('2024-03-05'),
    paid: true,
  },
  {
    id: '2',
    type: 'expense',
    amount: 1500,
    description: 'Aluguel',
    category: 'Moradia',
    date: new Date('2024-03-10'),
    paid: false,
  },
  {
    id: '3',
    type: 'expense',
    amount: 400,
    description: 'Supermercado',
    category: 'Alimentação',
    date: new Date('2024-03-12'),
    paid: true,
  },
] as const;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([...initialTransactions]);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
  }, [isDarkTheme]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'paid'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
      paid: false,
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleTogglePaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, paid: !t.paid } : t
      )
    );
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.date.getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date.getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);


  const balance = totalIncome - totalExpenses;
  const savingsPercentage = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">FinWise</span>
            </div>
            <ThemeSwitch isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Financeiro</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Saldo Total"
            value={`R$ ${balance.toFixed(2)}`}
            icon={Wallet}
            trend={{ value: 12, isPositive: balance >= 0 }}
          />
          <DashboardCard
            title="Receitas do Mês"
            value={`R$ ${totalIncome.toFixed(2)}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Despesas do Mês"
            value={`R$ ${totalExpenses.toFixed(2)}`}
            icon={TrendingDown}
            trend={{ value: 5, isPositive: false }}
          />
          <DashboardCard
            title="Economia do Mês"
            value={`${savingsPercentage}%`}
            icon={PieChart}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Últimas Transações</h2>
          <TransactionList 
            transactions={transactions}
            onTogglePaid={handleTogglePaid}
          />
        </div>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

export default App;