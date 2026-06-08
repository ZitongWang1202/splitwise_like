import apiClient from "./client"

export type CreateGroupRequest = {
  name: string
}

export async function getGroups() {
  const response = await apiClient.get("/groups")

  return response.data
}

export async function createGroup(
  payload: CreateGroupRequest,
) {
  const response = await apiClient.post(
    "/groups",
    payload,
  )

  return response.data
}
