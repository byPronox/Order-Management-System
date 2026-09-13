"use client"

import { useEffect, useState } from "react"
import { workspaceSettingsApi, type WorkspaceSettingsData } from "@/lib/api/workspace-settings"
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id"

const TABS = ["Workspace", "Orders", "Notifications"] as const
type Tab = (typeof TABS)[number]

const TIMEZONES = ["America/New_York", "America/Los_Angeles", "Europe/London"]
const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — Pound Sterling" },
]

export function SettingsWorkspace() {
  const workspaceId = useWorkspaceId()
  const [settings, setSettings] = useState<WorkspaceSettingsData | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("Workspace")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) return
    workspaceSettingsApi
      .get(workspaceId)
      .then(setSettings)
      .catch(() => setError("Could not load settings for this workspace."))
  }, [workspaceId])

  function updateField<K extends keyof WorkspaceSettingsData>(key: K, value: WorkspaceSettingsData[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-400">
          Orderly OMS / <span className="text-neutral-900">Administration</span>
        </p>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-[-.04em]">Settings</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Manage your workspace, operational rules, notifications, and connected services.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white opacity-60"
            title="Not persisted yet — see Technical Decisions in README"
          >
            Save changes
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-1 rounded-full bg-neutral-100 p-1 lg:w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                activeTab === tab ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

        {!settings && !error && (
          <p className="mt-6 text-sm text-neutral-400">Loading settings...</p>
        )}

        {settings && activeTab === "Workspace" && (
          <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">General settings</p>
            <h2 className="mt-1 font-display text-2xl tracking-[-.02em]">Workspace identity</h2>
            <p className="mt-2 text-sm text-neutral-500">The details your team uses to identify this operation.</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Workspace name</label>
                <input
                  type="text"
                  value={settings.workspaceName}
                  onChange={(e) => updateField("workspaceName", e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/25"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Default timezone</label>
                <select
                  value={settings.defaultTimezone}
                  onChange={(e) => updateField("defaultTimezone", e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/25"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Default currency</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => updateField("defaultCurrency", e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/25"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {settings && activeTab === "Orders" && (
          <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Operations</p>
            <h2 className="mt-1 font-display text-2xl tracking-[-.02em]">Order defaults</h2>
            <p className="mt-2 text-sm text-neutral-500">Set the defaults applied to new orders and fulfillment workflows.</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Default order status</label>
                <select
                  value={settings.defaultOrderStatus}
                  onChange={(e) => updateField("defaultOrderStatus", e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm capitalize outline-none focus:border-black/25"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-8 space-y-5 border-t border-black/6 pt-6">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Require order review</p>
                  <p className="text-xs text-neutral-500">Hold new orders until an admin approves them.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireOrderReview}
                  onChange={(e) => updateField("requireOrderReview", e.target.checked)}
                  className="size-5 accent-black"
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Allow partial fulfillment</p>
                  <p className="text-xs text-neutral-500">Let teams ship available items separately.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPartialFulfillment}
                  onChange={(e) => updateField("allowPartialFulfillment", e.target.checked)}
                  className="size-5 accent-black"
                />
              </label>
            </div>
          </div>
        )}

        {settings && activeTab === "Notifications" && (
          <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Communication</p>
            <h2 className="mt-1 font-display text-2xl tracking-[-.02em]">Notification preferences</h2>
            <p className="mt-2 text-sm text-neutral-500">Choose which events should reach your team.</p>

            <div className="mt-8 space-y-5">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Notify customers on status changes</p>
                  <p className="text-xs text-neutral-500">Send an email when an order status changes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyCustomersOnStatus}
                  onChange={(e) => updateField("notifyCustomersOnStatus", e.target.checked)}
                  className="size-5 accent-black"
                />
              </label>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-neutral-400">
          Changes are currently read-only and not yet persisted to the backend. See "Technical Decisions" in the README.
        </p>
      </div>
    </div>
  )
}