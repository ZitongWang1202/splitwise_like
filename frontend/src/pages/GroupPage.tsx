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

import { queryKeys } from "../api/queryKeys"

import type { Balance, BalancesResponse } from "../types/balance"
import type { Settlement, SettlementResponse } from "../types/settlement"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"
import PageContainer from "../components/PageContainer"
import PageTitle from "../components/PageTitle"
import Section from "../components/Section"
import FormStack from "../components/FormStack"
import CheckboxField from "../components/CheckboxField"
import EmptyState from "../components/EmptyState"
import ItemList from "../components/ItemList"
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

  const [selectedParticipants, setSelectedParticipants] =
    useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [inviteEmail, setInviteEmail] = useState("")

  const [inviteError, setInviteError] = useState("")

  const {
    data: balances = [],
    isLoading: balancesLoading,
    isError: balancesError,
  } = useQuery({
    queryKey: queryKeys.balances.byGroup(groupId!),
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
    queryKey: queryKeys.settlements.byGroup(groupId!),
    queryFn: async () => {
      const data = await getGroupSettlements(groupId!)
      return parseSettlements(data)
    },
    enabled: !!groupId,
  })

  const {
    data: members = [],
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: queryKeys.groupMembers.byGroup(groupId!),
    queryFn: async () =>
      getGroupMembers(groupId!),
    enabled: !!groupId,
  })

  const queryClient = useQueryClient()

  const createExpenseMutation = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.balances.byGroup(groupId!),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.settlements.byGroup(groupId!),
      })
    },
  })

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) =>
      addGroupMember(groupId!, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupMembers.byGroup(groupId!),
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

      if (selectedParticipants.length === 0) {
        setError("Select at least one participant")
        return
      }

      const share =
        expenseAmount /
        selectedParticipants.length

      const participants =
        selectedParticipants.map(
          (userId) => ({
            user_id: userId,
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

  if (membersLoading || balancesLoading || settlementsLoading) {
    return (
      <PageContainer>
        <p>Loading members, balances, and settlements...</p>
      </PageContainer>
    )
  }

  if (membersError || balancesError || settlementsError) {
    return (
      <PageContainer>
        <p className="text-red-600">
          Failed to load members, balances, or settlements.
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>

      <PageTitle>Group Details</PageTitle>

      <Section title="Members">
        <ItemList>
          {members.map((member) => (
            <div key={member.id}>
              {member.email}
            </div>
          ))}
        </ItemList>

        <Section title="Invite Member" nested>
          <FormStack>
            <ErrorMessage message={inviteError} />

            <Input
              placeholder="Email"
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
                  ? "Inviting..."
                  : "Invite"
              }
            </Button>
          </FormStack>
        </Section>
      </Section>

      <Section title="Add Expense">
        <FormStack>
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
        </FormStack>

        <Section title="Expense Participants" nested>
          {members.length === 0 && (
            <EmptyState>No members to select.</EmptyState>
          )}

          <FormStack>
            {members.map((member) => (
              <CheckboxField
                key={member.id}
                label={member.email}
                checked={selectedParticipants.includes(
                  member.id,
                )}
                onChange={() =>
                  setSelectedParticipants((prev) =>
                    prev.includes(member.id)
                      ? prev.filter((id) => id !== member.id)
                      : [...prev, member.id],
                  )
                }
              />
            ))}
          </FormStack>
        </Section>

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
      </Section>

      <Section title="Balances">
        {balances.length === 0 && (
          <EmptyState>No balances yet.</EmptyState>
        )}

        <FormStack>
          {balances.map((balance) => (
            <Card key={balance.user_id}>
              {balance.email}: {balance.balance}
            </Card>
          ))}
        </FormStack>
      </Section>

      <Section title="Settlements">
        {settlements.length === 0 && (
          <EmptyState>No settlements yet.</EmptyState>
        )}

        <FormStack>
          {settlements.map((settlement, index) => (
            <Card key={index}>
              {settlement.from_user}
              {" → "}
              {settlement.to_user}
              {": "}
              {settlement.amount}
            </Card>
          ))}
        </FormStack>
      </Section>

    </PageContainer>
  )
}
