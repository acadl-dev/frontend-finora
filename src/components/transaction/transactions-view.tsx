'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { categories, formatBRL, transactions, type Transaction } from '@/lib/data'
import { cn } from '@/lib/utils'

const typeConfig = {
  receita: { label: 'Receita', icon: ArrowUpRight, className: 'bg-success/15 text-success' },
  despesa: { label: 'Despesa', icon: ArrowDownLeft, className: 'bg-destructive/10 text-destructive' },
  transferencia: { label: 'Transferência', icon: ArrowLeftRight, className: 'bg-primary/10 text-primary' },
}

const statusConfig = {
  confirmada: 'bg-success/15 text-success',
  pendente: 'bg-warning/15 text-warning',
  agendada: 'bg-muted text-muted-foreground',
}

function fullDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function TransactionsView() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [accountFilter, setAccountFilter] = useState('todas')
  const [periodFilter, setPeriodFilter] = useState('todos')
  const [selected, setSelected] = useState<Transaction | null>(null)

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'todos' && tx.type !== typeFilter) return false
      if (categoryFilter !== 'todas' && tx.category !== categoryFilter) return false
      if (accountFilter !== 'todas' && tx.account !== accountFilter) return false
      if (periodFilter === 'julho' && !tx.date.startsWith('2026-07')) return false
      if (periodFilter === 'junho' && !tx.date.startsWith('2026-06')) return false
      return true
    })
  }, [search, typeFilter, categoryFilter, accountFilter, periodFilter])

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Buscar transações"
            />
          </div>
          <Select value={periodFilter} onValueChange={(value) => {setPeriodFilter(value ?? "todos");}}>
            <SelectTrigger className="w-36" aria-label="Filtrar por período">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo período</SelectItem>
              <SelectItem value="julho">Julho 2026</SelectItem>
              <SelectItem value="junho">Junho 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => {setTypeFilter(value ?? "todos");}}>
            <SelectTrigger className="w-36" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="transferencia">Transferências</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => {setCategoryFilter(value ?? "todas");}}>
            <SelectTrigger className="w-40" aria-label="Filtrar por categoria">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={accountFilter} onValueChange={(value) => {setAccountFilter(value ?? "todas");}}>
            <SelectTrigger className="w-36" aria-label="Filtrar por conta">
              <SelectValue placeholder="Conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas contas</SelectItem>
              {[...new Set(transactions.map((t) => t.account))].map((acc) => (
                <SelectItem key={acc} value={acc}>
                  {acc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden lg:table-cell">Conta</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhuma transação encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((tx) => {
                    const type = typeConfig[tx.type]
                    return (
                      <TableRow
                        key={tx.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(tx)}
                      >
                        <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                          {fullDate(tx.date)}
                        </TableCell>
                        <TableCell className="max-w-52 truncate font-medium">{tx.description}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{tx.category}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">{tx.account}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className={cn('gap-1', type.className)}>
                            <type.icon className="size-3" aria-hidden="true" />
                            {type.label}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-semibold tabular-nums',
                            tx.amount > 0 ? 'text-success' : 'text-foreground',
                          )}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {formatBRL(tx.amount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className={cn('capitalize', statusConfig[tx.status])}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-pretty">{selected.description}</SheetTitle>
                <SheetDescription>Detalhes da transação</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6">
                <p
                  className={cn(
                    'text-3xl font-semibold tabular-nums',
                    selected.amount > 0 ? 'text-success' : 'text-foreground',
                  )}
                >
                  {selected.amount > 0 ? '+' : ''}
                  {formatBRL(selected.amount)}
                </p>
                <Separator />
                <dl className="flex flex-col gap-3 text-sm">
                  {[
                    ['Data', fullDate(selected.date)],
                    ['Categoria', selected.category],
                    ['Conta', selected.account],
                    ['Tipo', typeConfig[selected.type].label],
                    ['Forma de pagamento', selected.paymentMethod],
                    ['Status', selected.status],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
                {selected.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export function TransactionActions() {
  return (
    <>
        <Link href="/transacoes/nova?tipo=receita">
            <Button variant="outline">
                <ArrowUpRight className="size-4 text-success" aria-hidden="true" />
                Nova Receita
            </Button>
        </Link>
        <Link href="/transacoes/nova?tipo=despesa">
            <Button variant="outline">
                <ArrowDownLeft className="size-4 text-destructive" aria-hidden="true" />
                Nova Despesa
            </Button>
        </Link>
        <Link href="/transacoes/nova">
            <Button>
                <Plus className="size-4" aria-hidden="true" />
                Nova Transferência
            </Button>
        </Link>
    </>
  )
}
