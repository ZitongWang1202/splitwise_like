import apiClient from "./client"

export type ExpenseParticipantInput = {
  user_id: string
  owed_amount: number
}

export type CreateExpenseRequest = {
  group_id: string
  description: string
  amount: number
  participants: ExpenseParticipantInput[]
}

export async function createExpense(
  payload: CreateExpenseRequest,
) {
  const response = await apiClient.post(
    "/expenses",
    payload,
  )

  return response.data
}
