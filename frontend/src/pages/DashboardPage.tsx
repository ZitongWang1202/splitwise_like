import { useEffect, useState } from "react"

import {
  getGroups,
  createGroup as createGroupApi,
} from "../api/groups"

import type { Group } from "../types/group"

import { Link } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"

export default function DashboardPage() {

  const [groups, setGroups] = useState<Group[]>([])

  const [newGroupName, setNewGroupName] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  async function fetchGroups() {

    const data = await getGroups()

    setGroups(data)
  }

  async function createGroup() {

    if (!newGroupName.trim()) {
      setError("Group name is required")
      return
    }

    try {

      setError("")
      setLoading(true)

      await createGroupApi({
        name: newGroupName,
      })

      setNewGroupName("")

      await fetchGroups()

    } catch {

      setError("Failed to create group")

    } finally {

      setLoading(false)

    }



  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="mb-6">

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

      <div className="space-y-2">

        {groups.map((group) => (
          <div
            key={group.id}
            className="border p-4"
          >
            <Link to={`/groups/${group.id}`}>
              {group.name}
            </Link>
          </div>
        ))}

      </div>

    </div>
  )
}
