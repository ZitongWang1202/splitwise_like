import apiClient from "./client"
import type { GroupMember } from "../types/member"

export type AddGroupMemberRequest = {
  email: string
}

export async function getGroupMembers(
  groupId: string,
): Promise<GroupMember[]> {
  const response = await apiClient.get<GroupMember[]>(
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