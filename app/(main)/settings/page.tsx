export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="text-sm font-medium">Settings Page</div>
          <p className="text-sm text-muted-foreground mt-2">Configure your application settings here.</p>
        </div>
      </div>
    </div>
  )
}

