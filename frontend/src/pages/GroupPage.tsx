import { useState } from "react"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useParams } from "react-router-dom"

import {
  getGroupBalances,
  getGroupSettlements,
} from "../api/balances"

import {
  createExpense as createExpenseApi,
} from "../api/expenses"

// import { getCurrentUser } from "../api/users"
import {
  addGroupMember,
  getGroupMembers,
} from "../api/groupMembers"

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

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] =
    useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [inviteEmail, setInviteEmail] = useState("")

  const [inviteError, setInviteError] = useState("")

  const {
    data: balances = [],
    isLoading: balancesLoading,
    isError: balancesError,
  } = useQuery({
    queryKey: ["balances", groupId],
    queryFn: async () => {
      const data = await getGroupBalances(groupId!)
      return parseBalances(data)
    },
    enabled: !!groupId,     // Do not execute the query until groupId exists
  })

  const {
    data: settlements = [],
    isLoading: settlementsLoading,
    isError: settlementsError,
  } = useQuery({
    queryKey: ["settlements", groupId],
    queryFn: async () => {
      const data = await getGroupSettlements(groupId!)
      return parseSettlements(data)
    },
    enabled: !!groupId,
  })

  const {
    data: members = [],
  } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () =>
      getGroupMembers(groupId!),
    enabled: !!groupId,
  })

  const queryClient = useQueryClient()

  const createExpenseMutation = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] })
      queryClient.invalidateQueries({ queryKey: ["settlements", groupId] })
    },
  })

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) =>
      addGroupMember(groupId!, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", groupId],
      })
      setInviteEmail("")
      setInviteError("")
    },
  })

  async function createExpense() {

    try {

      setError("")
      setLoading(true)

      if (!description.trim()) {
        setError("Description is required")
        return
      }

      const expenseAmount = Number(amount)

      if (
        !Number.isFinite(expenseAmount)
        || expenseAmount <= 0
      ) {
        setError("Amount must be greater than 0")
        return
      }

      if (members.length === 0) {
        setError("Add members before creating an expense")
        return
      }

      const share = expenseAmount / members.length

      const participants = members.map(
        (member) => ({
          user_id: member.id,
          owed_amount: share,
        }),
      )

      await createExpenseMutation.mutateAsync({
        group_id: groupId!,
        description,
        amount: expenseAmount,
        participants,
      })

      setDescription("")
      setAmount("")

    } catch {

      setError("Failed to add expense")

    } finally {

      setLoading(false)

    }
  }

  async function inviteMember() {

    const email = inviteEmail.trim()

    if (!email) {
      setInviteError("Email is required")
      return
    }

    try {

      setInviteError("")
      await inviteMemberMutation.mutateAsync(email)

    } catch (err: unknown) {

      const detail =
        (err as { response?: { data?: { detail?: string } } })
          .response?.data?.detail

      setInviteError(
        typeof detail === "string"
          ? detail
          : "Failed to invite member",
      )

    }
  }

  if (balancesLoading || settlementsLoading) {
    return
    (
      <p>Loading balances and settlements...</p>
    )
  }

  if (balancesError || settlementsError) {
    return (
      <p className="text-red-600">
        Failed to load balances or settlements.
      </p>
    )
  }

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
          Members
        </h2>

        <div className="space-y-2 mb-4">

          {members.length === 0 && (
            <p>
              No members yet.
            </p>
          )}

          {members.map((member) => (
            <Card key={member.id}>
              {member.email}
            </Card>
          ))}

        </div>

        <div className="space-y-2">

          <ErrorMessage message={inviteError} />

          <Input
            placeholder="Invite member email"
            value={inviteEmail}
            disabled={inviteMemberMutation.isPending}
            onChange={(e) =>
              setInviteEmail(e.target.value)
            }
          />

          <Button
            onClick={inviteMember}
            disabled={
              inviteMemberMutation.isPending
              || !inviteEmail.trim()
            }
          >
            {
              inviteMemberMutation.isPending
                ? "Adding..."
                : "Add Member"
            }
          </Button>

        </div>

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

      <div className="mb-8">

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

      <div>

        <h2 className="text-2xl font-bold mb-4">
          Expense details
        </h2>

        <p>
          No expenses yet.
        </p>

      </div>

    </PageContainer>
  )
}
