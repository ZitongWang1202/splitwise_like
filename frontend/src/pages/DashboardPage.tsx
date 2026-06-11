import { useState } from "react"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import {
  getGroups,
  createGroup as createGroupApi,
} from "../api/groups"

import { queryKeys } from "../api/queryKeys"

import type { Group } from "../types/group"

import { Link } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"
import PageContainer from "../components/PageContainer"
import PageTitle from "../components/PageTitle"
import Section from "../components/Section"
import FormStack from "../components/FormStack"
import EmptyState from "../components/EmptyState"
import Card from "../components/Card"

export default function DashboardPage() {

  const [newGroupName, setNewGroupName] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery<Group[]>({
    queryKey: queryKeys.groups.all,
    queryFn: getGroups,
  })

  const queryClient = useQueryClient()

  const createGroupMutation = useMutation({
    mutationFn: createGroupApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
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
    return (
      <PageContainer>
        <p>Loading groups...</p>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <p className="text-red-600">
          Failed to load groups.
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>

      <PageTitle>Dashboard</PageTitle>

      <Section title="Create Group">
        <FormStack>
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
        </FormStack>
      </Section>

      <Section title="Your Groups">
        {groups.length === 0 && (
          <EmptyState>No groups yet.</EmptyState>
        )}

        <FormStack>
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
        </FormStack>
      </Section>

    </PageContainer>
  )
}
