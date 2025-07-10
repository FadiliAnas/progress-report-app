"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, Users, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import CreateReportDialog from "@/components/create-report-dialog"
import ReportsList from "@/components/reports-list"

interface ProgressReport {
  _id: string
  title: string
  description: string
  progress: number
  status: "in-progress" | "completed" | "on-hold"
  assignee: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const [reports, setReports] = useState<ProgressReport[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReport = async (reportData: Omit<ProgressReport, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      if (response.ok) {
        const newReport = await response.json()
        setReports((prev) => [newReport, ...prev])
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating report:", error)
    }
  }

  const handleUpdateReport = async (id: string, updates: Partial<ProgressReport>) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedReport = await response.json()
        setReports((prev) => prev.map((report) => (report._id === id ? updatedReport : report)))
      }
    } catch (error) {
      console.error("Error updating report:", error)
    }
  }

  const handleDeleteReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReports((prev) => prev.filter((report) => report._id !== id))
      }
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  const completedReports = reports.filter((r) => r.status === "completed").length
  const inProgressReports = reports.filter((r) => r.status === "in-progress").length
  const averageProgress =
    reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.progress, 0) / reports.length) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Progress Reports Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track and manage project progress reports</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">Active progress reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReports}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressReports}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <Progress value={averageProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <ReportsList reports={reports} onUpdate={handleUpdateReport} onDelete={handleDeleteReport} />

        {/* Create Report Dialog */}
        <CreateReportDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateReport}
        />
      </div>
    </div>
  )
}
