import { PageHeader } from '@/components/page-header'
import { TransactionActions, TransactionsView } from '@/components/transaction/transactions-view'

export default function TransacoesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <PageHeader
        title="Transações"
        description="Extrato completo de todas as suas movimentações"
      >
        <TransactionActions />
      </PageHeader>
      <TransactionsView />
    </div>
  )
}
