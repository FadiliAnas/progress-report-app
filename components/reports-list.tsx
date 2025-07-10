"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EditReportDialog from "@/components/edit-report-dialog"

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

interface ReportsListProps {
  reports: ProgressReport[]
  onUpdate: (id: string, updates: Partial<ProgressReport>) => void
  onDelete: (id: string) => void
}

export default function ReportsList({ reports, onUpdate, onDelete }: ReportsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleEdit = (report: ProgressReport) => {
    setSelectedReport(report)
    setEditDialogOpen(true)
  }

  const handleDelete = (report: ProgressReport) => {
    setSelectedReport(report)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedReport) {
      onDelete(selectedReport._id)
      setDeleteDialogOpen(false)
      setSelectedReport(null)
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Progress Reports</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first progress report.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Reports</h2>
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(report)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(report)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(report.status)}>{report.status.replace("-", " ")}</Badge>
                    <span className="text-sm font-medium">{report.progress}%</span>
                  </div>

                  <Progress value={report.progress} className="w-full" />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {report.assignee}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(report.dueDate)}
                      </div>
                    </div>
                    <div>Updated: {formatDate(report.updatedAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      {selectedReport && (
        <EditReportDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          report={selectedReport}
          onSubmit={(updates) => {
            onUpdate(selectedReport._id, updates)
            setEditDialogOpen(false)
            setSelectedReport(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the progress report "{selectedReport?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
