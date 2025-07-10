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

export async function GET() {
  try {
    return NextResponse.json(reports)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newReport = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reports.unshift(newReport)
    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
