import { useEffect, useState } from "react"

import {
  getGroups,
  createGroup as createGroupApi,
} from "../api/groups"

import type { Group } from "../types/group"

import { Link } from "react-router-dom"

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

        {
          error && (
            <p className="text-red-600 mb-2">
              {error}
            </p>
          )
        }

        <input
          className="border p-2 mr-2"
          placeholder="Group name"
          value={newGroupName}
          disabled={loading}
          onChange={(e) =>
            setNewGroupName(e.target.value)
          }
        />

        <button
          className="
            border
            px-4
            py-2
            disabled:opacity-50
          "
          onClick={createGroup}
          disabled={loading}
        >
          {
            loading
              ? "Creating..."
              : "Create Group"
          }
        </button>

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
