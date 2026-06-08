import apiClient from "./client"

export async function getGroupBalances(groupId: string) {
  const response = await apiClient.get(
    `/groups/${groupId}/balances`,
  )

  return response.data
}

export async function getGroupSettlements(groupId: string) {
  const response = await apiClient.get(
    `/groups/${groupId}/settlements`,
  )

  return response.data
}
