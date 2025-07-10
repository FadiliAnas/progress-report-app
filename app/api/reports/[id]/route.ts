import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (replace with MongoDB in production)
const reports: any[] = [
  {
    _id: "1",
    title: "Website Redesign Project",
    description: "Complete overhaul of company website with modern design and improved UX",
    progress: 75,
    status: "in-progress",
    assignee: "John Doe",
    dueDate: "2024-02-15",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    progress: 45,
    status: "in-progress",
    assignee: "Jane Smith",
    dueDate: "2024-03-01",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "Database Migration",
    description: "Migrate legacy database to cloud infrastructure",
    progress: 100,
    status: "completed",
    assignee: "Mike Johnson",
    dueDate: "2024-01-30",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-30T00:00:00.000Z",
  },
]

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const reportIndex = reports.findIndex((report) => report._id === id)
    if (reportIndex === -1) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    reports[reportIndex] = {
      ...reports[reportIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(reports[reportIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const reportIndex = reports.findIndex((report) => report._id === id)
    if (reportIndex === -1) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    reports.splice(reportIndex, 1)
    return NextResponse.json({ message: "Report deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 })
  }
}
