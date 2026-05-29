import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import apiClient from "../api/client"

import type { Balance } from "../types/balance"
import type { Settlement } from "../types/settlement"

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

  async function fetchBalances() {

    const response = await apiClient.get(
      `/groups/${groupId}/balances`
    )

    setBalances(response.data)
  }

  async function fetchSettlements() {

    const response = await apiClient.get(
      `/groups/${groupId}/settlements`
    )

    setSettlements(response.data)
  }

  async function createExpense() {

    await apiClient.post(
      "/expenses",
      {
        group_id: groupId,
        description,
        amount: Number(amount),
      }
    )

    setDescription("")
    setAmount("")

    await fetchBalances()
    await fetchSettlements()
  }

  useEffect(() => {

    fetchBalances()
    fetchSettlements()

  }, [])

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Group Details
      </h1>

      <div className="mb-8 space-y-2">

        <input
          className="border p-2 block"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          className="border p-2 block"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <button
          className="border px-4 py-2"
          onClick={createExpense}
        >
          Add Expense
        </button>

      </div>

      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Balances
        </h2>

        <div className="space-y-2">

          {balances.map((balance) => (
            <div
              key={balance.user_id}
              className="border p-3"
            >
              {balance.email}: {balance.balance}
            </div>
          ))}

        </div>

      </div>

      <div>

        <h2 className="text-2xl font-bold mb-4">
          Settlements
        </h2>

        <div className="space-y-2">

          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="border p-3"
            >
              {settlement.from_user}
              {" → "}
              {settlement.to_user}
              {": "}
              {settlement.amount}
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}