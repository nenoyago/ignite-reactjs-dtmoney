import { Header } from '../../components/Header';
import { Summary } from '../../components/Summary';
import { useTransactionContext } from '../../contexts/TransactionsContext';
import { priceFormatter } from '../../utils/formatter';
import { SearchForm } from './components/SearchForm';
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles';

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
  createdAt: Date;
  createdAtFormatted: string;
}

export function Transactions() {
  const transactions = useTransactionContext(ctx => ctx.transactions);

  const formattedTransactions: Transaction[] = transactions.map(transaction => {
    return {
      ...transaction,
      createdAtFormatted: Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(transaction.createdAt)),
    };
  });

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />
        <TransactionsTable>
          <tbody>
            {formattedTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td width="40%">{transaction.description}</td>
                <td>
                  <PriceHighlight variant={transaction.type}>
                    {transaction.type === 'outcome' && '- '}
                    {priceFormatter.format(transaction.price)}
                  </PriceHighlight>
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.createdAtFormatted}</td>
              </tr>
            ))}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  );
}
