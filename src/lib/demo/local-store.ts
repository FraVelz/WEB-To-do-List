type TaskDto = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: number
  label: string | null
  createdAt: string
  updatedAt: string
}

type TaskFilter = 'inbox' | 'today' | 'next' | 'completed'

type NotificationDto = {
  id: string
  title: string
  content: string
  color: string
  read: boolean
}

const STORAGE_KEY = 'todo-demo-data'

type DemoData = {
  tasks: TaskDto[]
  notifications: NotificationDto[]
}

function utcDayRange(ref: Date = new Date()) {
  const start = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  )
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function seedData(): DemoData {
  const now = new Date().toISOString()
  return {
    tasks: [
      {
        id: createId('task'),
        title: 'Revisar la bandeja de entrada',
        description: 'Marca tareas como hechas cuando termines.',
        completed: false,
        dueDate: null,
        priority: 0,
        label: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Probar el buscador de tareas',
        description: 'Abre «Buscar» en el menú lateral.',
        completed: false,
        dueDate: null,
        priority: 1,
        label: 'Tutorial',
        createdAt: now,
        updatedAt: now,
      },
    ],
    notifications: [
      {
        id: createId('notif'),
        title: '¡Hola! Bienvenido.',
        content:
          'Empieza a organizar tus tareas desde la bandeja de entrada. Usa el botón «Agregar tarea» en el menú lateral.',
        color: 'red',
        read: false,
      },
    ],
  }
}

function readData(): DemoData {
  if (typeof window === 'undefined') {
    return { tasks: [], notifications: [] }
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = seedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    const parsed = JSON.parse(raw) as DemoData
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [],
    }
  } catch {
    const initial = seedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

function writeData(data: DemoData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function matchesSearch(task: TaskDto, q: string) {
  const needle = q.toLowerCase()
  return (
    task.title.toLowerCase().includes(needle) ||
    (task.description?.toLowerCase().includes(needle) ?? false)
  )
}

function matchesFilter(task: TaskDto, filter: TaskFilter) {
  const { start: dayStart } = utcDayRange()
  const weekEnd = new Date(dayStart.getTime() + 7 * 86400000)
  const due = task.dueDate ? new Date(task.dueDate) : null

  switch (filter) {
    case 'completed':
      return task.completed
    case 'today': {
      if (task.completed || !due) return false
      const { start, end } = utcDayRange()
      return due >= start && due < end
    }
    case 'next':
      if (task.completed || !due) return false
      return due >= dayStart && due < weekEnd
    case 'inbox':
    default:
      return !task.completed
  }
}

export function listDemoTasks(params: {
  filter?: TaskFilter
  q?: string
  label?: string
}): TaskDto[] {
  const filter = params.filter ?? 'inbox'
  const q = params.q?.trim()
  const label = params.label?.trim()
  const data = readData()

  let tasks = [...data.tasks]
  if (label) tasks = tasks.filter((task) => task.label === label)
  if (q) tasks = tasks.filter((task) => matchesSearch(task, q))
  tasks = tasks.filter((task) => matchesFilter(task, filter))

  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const aDue = a.dueDate
      ? new Date(a.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    const bDue = b.dueDate
      ? new Date(b.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    if (aDue !== bDue) return aDue - bDue
    return new Date(b.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return tasks
}

export function createDemoTask(input: {
  title: string
  description?: string | null
  dueDate?: string | null
  label?: string | null
  priority?: number
}): TaskDto {
  const data = readData()
  const now = new Date().toISOString()
  const task: TaskDto = {
    id: createId('task'),
    title: input.title,
    description: input.description ?? null,
    completed: false,
    dueDate: input.dueDate ?? null,
    priority: input.priority ?? 0,
    label: input.label ?? null,
    createdAt: now,
    updatedAt: now,
  }

  data.tasks.unshift(task)
  writeData(data)
  return task
}

export function patchDemoTask(
  id: string,
  patch: Partial<{
    title: string
    description: string | null
    completed: boolean
    dueDate: string | null
    priority: number
    label: string | null
  }>
): TaskDto | null {
  const data = readData()
  const index = data.tasks.findIndex((task) => task.id === id)
  if (index === -1) return null

  const current = data.tasks[index]
  const updated: TaskDto = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  data.tasks[index] = updated
  writeData(data)
  return updated
}

export function deleteDemoTask(id: string): boolean {
  const data = readData()
  const next = data.tasks.filter((task) => task.id !== id)
  if (next.length === data.tasks.length) return false
  data.tasks = next
  writeData(data)
  return true
}

export function listDemoTaskLabels(): string[] {
  const labels = new Set<string>()
  for (const task of readData().tasks) {
    if (task.label) labels.add(task.label)
  }
  return [...labels].sort((a, b) => a.localeCompare(b, 'es'))
}

export function listDemoNotifications(unreadOnly = false): NotificationDto[] {
  let items = [...readData().notifications]
  if (unreadOnly) items = items.filter((item) => !item.read)
  items.sort((a, b) => b.id.localeCompare(a.id))
  return items
}

export function markDemoNotificationRead(id: string): boolean {
  const data = readData()
  const index = data.notifications.findIndex((item) => item.id === id)
  if (index === -1) return false
  data.notifications[index] = { ...data.notifications[index], read: true }
  writeData(data)
  return true
}

export function createDemoNotification(input: {
  title: string
  content: string
  color: string
}): NotificationDto {
  const data = readData()
  const notification: NotificationDto = {
    id: createId('notif'),
    title: input.title,
    content: input.content,
    color: input.color,
    read: false,
  }
  data.notifications.unshift(notification)
  writeData(data)
  return notification
}
