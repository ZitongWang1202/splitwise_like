import { useEffect, useState } from "react"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import {
  getGroups,
  createGroup as createGroupApi,
} from "../api/groups"

import type { Group } from "../types/group"

import { Link } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"
import PageContainer from "../components/PageContainer"
import Card from "../components/Card"

export default function DashboardPage() {

  const [newGroupName, setNewGroupName] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  })

  const queryClient = useQueryClient()

  const createGroupMutation = useMutation({
    mutationFn: createGroupApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
    },
  })

  async function createGroup() {

    if (!newGroupName.trim()) {
      setError("Group name is required")
      return
    }

    try {

      setError("")
      setLoading(true)

      await createGroupMutation.mutateAsync({
        name: newGroupName,
      })

      setNewGroupName("")

    } catch {

      setError("Failed to create group")

    } finally {

      setLoading(false)

    }

  }

  if (isLoading) {
    return <p>Loading groups...</p>
  }
  
  if (isError) {
    return (
      <p className="text-red-600">
        Failed to load groups.
      </p>
    )
  }

  return (
    <PageContainer>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="mb-8 space-y-2">

        <ErrorMessage message={error} />

        <Input
          placeholder="Group name"
          value={newGroupName}
          disabled={loading}
          onChange={(e) =>
            setNewGroupName(e.target.value)
          }
        />

        <Button
          onClick={createGroup}
          disabled={loading}
        >
          {
            loading
              ? "Creating..."
              : "Create Group"
          }
        </Button>

      </div>

      <div>

        <h2 className="text-2xl font-bold mb-4">
          Your Groups
        </h2>

        <div className="space-y-2">

          {groups.length === 0 && (
            <p>
              No groups yet.
            </p>
          )}

          {groups.map((group) => (
            <Card key={group.id}>
              <Link
                to={`/groups/${group.id}`}
                className="no-underline text-inherit hover:opacity-70"
              >
                {group.name}
              </Link>
            </Card>
          ))}

        </div>

      </div>

    </PageContainer>
  )
}
