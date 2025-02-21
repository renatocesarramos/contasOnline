import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, value, icon: Icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 dark:text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${
              trend.isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% em relação ao mês anterior
            </p>
          )}
        </div>
        <Icon className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-80" />
      </div>
    </div>
  );
}