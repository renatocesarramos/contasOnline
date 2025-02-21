import React, { useState } from 'react';
import { Transaction } from '../types/transaction';
import { format, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onTogglePaid: (id: string) => void;
}

interface TransactionsByMonth {
  [key: string]: Transaction[];
}

export function TransactionList({ transactions, onTogglePaid }: TransactionListProps) {
  const [showPaid, setShowPaid] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([format(new Date(), 'yyyy-MM')]);

  // Group transactions by month
  const groupedTransactions = transactions.reduce<TransactionsByMonth>((groups, transaction) => {
    const monthKey = format(transaction.date, 'yyyy-MM');
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(transaction);
    return groups;
  }, {});

  // Sort months in descending order
  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev =>
      prev.includes(monthKey)
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey]
    );
  };

  const filteredTransactions = (monthTransactions: Transaction[]) => {
    return monthTransactions.filter(t => showPaid || !t.paid);
  };

  const calculateMonthTotal = (monthTransactions: Transaction[]) => {
    return monthTransactions.reduce((total, t) => {
      const amount = t.type === 'income' ? t.amount : -t.amount;
      return total + amount;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Últimas Transações
        </h2>
        <button
          onClick={() => setShowPaid(!showPaid)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showPaid
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {showPaid ? 'Ocultar Pagas' : 'Mostrar Pagas'}
        </button>
      </div>

      <div className="space-y-4">
        {sortedMonths.map(monthKey => {
          const monthTransactions = groupedTransactions[monthKey];
          const isExpanded = expandedMonths.includes(monthKey);
          const filtered = filteredTransactions(monthTransactions);
          const monthTotal = calculateMonthTotal(monthTransactions);
          const monthName = format(new Date(monthKey), 'MMMM yyyy', { locale: ptBR });

          if (filtered.length === 0 && !showPaid) return null;

          return (
            <div key={monthKey} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleMonth(monthKey)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-medium capitalize text-gray-900 dark:text-white">
                    {monthName}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    monthTotal >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    Saldo: R$ {monthTotal.toFixed(2)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {isExpanded && filtered.length > 0 && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`px-6 py-4 flex items-center justify-between transition-colors ${
                        transaction.paid ? 'border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {transaction.type === 'income' ? (
                          <ArrowUpCircle className="w-10 h-10 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="w-10 h-10 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-medium dark:text-white">{transaction.description}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(transaction.date, 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <button
                          onClick={() => onTogglePaid(transaction.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            transaction.paid
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                          aria-label={transaction.paid ? 'Marcar como não pago' : 'Marcar como pago'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}