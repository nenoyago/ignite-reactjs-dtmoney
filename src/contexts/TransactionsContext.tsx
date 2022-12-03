import { ReactNode, useCallback, useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { createContext, useContextSelector } from 'use-context-selector';

export interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
  createdAt: Date;
}

interface CreateTransaction {
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
}

interface TransactionContextData {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (transaction: CreateTransaction) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

const TransactionContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransations] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get<Transaction[]>('/transactions', {
      params: { _sort: 'createdAt', _order: 'desc', q: query },
    });
    setTransations(response.data);
  }, []);

  const createTransaction = useCallback(
    async (transaction: CreateTransaction) => {
      const response = await api.post<Transaction>('/transactions', {
        ...transaction,
        createdAt: new Date(),
      });
      setTransations(state => [response.data, ...state]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

type ContextSelector = <Slice>(
  selector: (state: TransactionContextData) => Slice
) => Slice;
export const useTransactionContext: ContextSelector = selector =>
  useContextSelector(TransactionContext, selector);
