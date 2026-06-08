import { useEffect, useState } from "react"

import {
  getGroups,
  createGroup as createGroupApi,
} from "../api/groups"

import type { Group } from "../types/group"

import { Link } from "react-router-dom"

export default function DashboardPage() {

  const [groups, setGroups] = useState<Group[]>([])

  const [newGroupName, setNewGroupName] =
    useState("")

  async function fetchGroups() {

    const data = await getGroups()

    setGroups(data)
  }

  async function createGroup() {

    await createGroupApi({
      name: newGroupName,
    })

    setNewGroupName("")

    fetchGroups()
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

        <input
          className="border p-2 mr-2"
          placeholder="Group name"
          value={newGroupName}
          onChange={(e) =>
            setNewGroupName(e.target.value)
          }
        />

        <button
          className="border px-4 py-2"
          onClick={createGroup}
        >
          Create Group
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
