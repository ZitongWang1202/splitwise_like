import apiClient from "./client"

export type AddGroupMemberRequest = {
  email: string
}

export async function getGroupMembers(
  groupId: string,
) {
  const response = await apiClient.get(
    `/groups/${groupId}/members`,
  )

  return response.data
}

export async function addGroupMember(
  groupId: string,
  payload: AddGroupMemberRequest,
) {
  const response = await apiClient.post(
    `/groups/${groupId}/members`,
    payload,
  )

  return response.data
}