import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import {
  getGroupBalances,
  getGroupSettlements,
} from "../api/balances"

import {
  createExpense as createExpenseApi,
} from "../api/expenses"

import { getCurrentUser } from "../api/users"

import type { Balance, BalancesResponse } from "../types/balance"
import type { Settlement, SettlementResponse } from "../types/settlement"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"
import PageContainer from "../components/PageContainer"
import Card from "../components/Card"

function parseBalances(data: BalancesResponse): Balance[] {
  return Object.entries(data).map(([user_id, balance]) => ({
    user_id,
    email: user_id,
    balance: Number(balance),
  }))
}

function parseSettlements(data: SettlementResponse[]): Settlement[] {
  return data.map((settlement) => ({
    from_user: settlement.from_email,
    to_user: settlement.to_email,
    amount: Number(settlement.amount),
  }))
}

export default function GroupPage() {

  const { groupId } = useParams()

  const [balances, setBalances] =
    useState<Balance[]>([])

  const [settlements, setSettlements] =
    useState<Settlement[]>([])

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] =
    useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  async function fetchBalances() {

    const data = await getGroupBalances(groupId!)

    setBalances(parseBalances(data))
  }

  async function fetchSettlements() {

    const data = await getGroupSettlements(groupId!)

    setSettlements(parseSettlements(data))
  }

  async function createExpense() {

    if (!description.trim()) {
      setError("Description is required")
      return
    }
      
    const expenseAmount = Number(amount)
    
    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    try {

      setError("")
      setLoading(true)

      const user = await getCurrentUser()

      await createExpenseApi({
        group_id: groupId!,
        description,
        amount: expenseAmount,
        participants: [
          {
            user_id: user.id,
            owed_amount: expenseAmount,
          },
        ],
      })

      setDescription("")
      setAmount("")

      await fetchBalances()
      await fetchSettlements()

    } catch {

      setError("Failed to add expense")

    } finally {

      setLoading(false)

    }



  }

  useEffect(() => {

    fetchBalances()
    fetchSettlements()

  }, [])

  return (
    <PageContainer>

      <h1 className="text-3xl font-bold mb-6">
        Group Details
      </h1>

      <div className="mb-8 space-y-2">

        <ErrorMessage message={error} />

        <Input
          placeholder="Description"
          value={description}
          disabled={loading}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <Input
          placeholder="Amount"
          value={amount}
          disabled={loading}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <Button
          onClick={createExpense}
          disabled={loading}
        >
          {
            loading
              ? "Adding..."
              : "Add Expense"
          }
        </Button>

      </div>

      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Balances
        </h2>

        <div className="space-y-2">

          {balances.length === 0 && (
            <p>
              No balances yet.
            </p>
          )}

          {balances.map((balance) => (
            <Card key={balance.user_id}>
              {balance.email}: {balance.balance}
            </Card>
          ))}

        </div>

      </div>

      <div>

        <h2 className="text-2xl font-bold mb-4">
          Settlements
        </h2>

        <div className="space-y-2">

          {settlements.length === 0 && (
            <p>
              No settlements yet.
            </p>
          )}

          {settlements.map((settlement, index) => (
            <Card key={index}>
              {settlement.from_user}
              {" → "}
              {settlement.to_user}
              {": "}
              {settlement.amount}
            </Card>
          ))}

        </div>

      </div>

    </PageContainer>
  )
}
