export interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  created_at: string
  updated_at?: string
}
