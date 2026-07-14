type TaskDto = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: number
  label: string | null
  projectId: string | null
  sectionId: string | null
  order: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

type ProjectDto = {
  id: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}

type SectionDto = {
  id: string
  projectId: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}

type TaskFilter =
  | 'inbox'
  | 'today'
  | 'next'
  | 'completed'
  | 'overdue'
  | 'all'

type TaskCounts = {
  inbox: number
  today: number
  next: number
  overdue: number
}

type NotificationDto = {
  id: string
  title: string
  content: string
  color: string
  read: boolean
}

const STORAGE_KEY = 'todo-demo-data-v2'

type DemoData = {
  tasks: TaskDto[]
  projects: ProjectDto[]
  sections: SectionDto[]
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
  const projectId = createId('project')
  const sectionOrg = createId('section')
  const sectionVal = createId('section')
  const sectionCyber = createId('section')
  const overdue = new Date(
    Date.UTC(2025, 8, 27, 12, 0, 0)
  ).toISOString()

  return {
    projects: [
      {
        id: projectId,
        name: 'Hoy',
        description: null,
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
    sections: [
      {
        id: sectionOrg,
        projectId,
        name: 'Organizacion',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: sectionVal,
        projectId,
        name: '*Validación Bachiller (Pruebas ICFES / Saber 11)',
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: sectionCyber,
        projectId,
        name: 'Ciberseguridad',
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
    ],
    tasks: [
      {
        id: createId('task'),
        title: 'Revisar la bandeja de entrada',
        description: 'Marca tareas como hechas cuando termines.',
        completed: false,
        dueDate: null,
        priority: 0,
        label: null,
        projectId: null,
        sectionId: null,
        order: 0,
        completedAt: null,
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
        projectId: null,
        sectionId: null,
        order: 1,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Lavar la loza',
        description: null,
        completed: false,
        dueDate: overdue,
        priority: 0,
        label: null,
        projectId,
        sectionId: sectionOrg,
        order: 2,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Organizar la pieza',
        description: null,
        completed: false,
        dueDate: overdue,
        priority: 0,
        label: null,
        projectId,
        sectionId: sectionOrg,
        order: 3,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Sección 1: Ingles',
        description: '(25 min) (Materia Opcional)',
        completed: false,
        dueDate: overdue,
        priority: 2,
        label: null,
        projectId,
        sectionId: sectionVal,
        order: 4,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Sección 1: Comandos Linux',
        description: '(25min) (Principiante)',
        completed: false,
        dueDate: overdue,
        priority: 3,
        label: null,
        projectId,
        sectionId: sectionCyber,
        order: 5,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Sección 2: Comandos Linux avanzados',
        description: '(25min) (Principiante)',
        completed: false,
        dueDate: overdue,
        priority: 0,
        label: null,
        projectId,
        sectionId: sectionCyber,
        order: 6,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: createId('task'),
        title: 'Sección 3: Bash Script / Python Scripting...',
        description: '(25min) (Principiante)',
        completed: false,
        dueDate: overdue,
        priority: 0,
        label: null,
        projectId,
        sectionId: sectionCyber,
        order: 7,
        completedAt: null,
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

function normalizeTask(raw: Partial<TaskDto> & { id: string }): TaskDto {
  const now = new Date().toISOString()
  return {
    id: raw.id,
    title: raw.title ?? '',
    description: raw.description ?? null,
    completed: raw.completed ?? false,
    dueDate: raw.dueDate ?? null,
    priority: raw.priority ?? 0,
    label: raw.label ?? null,
    projectId: raw.projectId ?? null,
    sectionId: raw.sectionId ?? null,
    order:
      typeof raw.order === 'number'
        ? raw.order
        : Date.parse(raw.createdAt ?? now) || 0,
    completedAt: raw.completedAt ?? null,
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
  }
}

function readData(): DemoData {
  if (typeof window === 'undefined') {
    return { tasks: [], projects: [], sections: [], notifications: [] }
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = seedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoData>
    return {
      tasks: Array.isArray(parsed.tasks)
        ? parsed.tasks.map((t) => normalizeTask(t))
        : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
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
    case 'all':
      return true
    case 'today': {
      if (task.completed || !due) return false
      const { start, end } = utcDayRange()
      return due >= start && due < end
    }
    case 'next':
      if (task.completed || !due) return false
      return due >= dayStart && due < weekEnd
    case 'overdue':
      if (task.completed || !due) return false
      return due < dayStart
    case 'inbox':
    default:
      return !task.completed && task.projectId == null
  }
}

function sortTasks(tasks: TaskDto[], byProjectOrder = false) {
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (byProjectOrder) {
      if (a.order !== b.order) return a.order - b.order
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    const aDue = a.dueDate
      ? new Date(a.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    const bDue = b.dueDate
      ? new Date(b.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    if (aDue !== bDue) return aDue - bDue
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function listDemoTasks(params: {
  filter?: TaskFilter
  q?: string
  label?: string
  projectId?: string
}): TaskDto[] {
  const q = params.q?.trim()
  const label = params.label?.trim()
  const projectId = params.projectId?.trim()
  const data = readData()

  let tasks = [...data.tasks]

  if (projectId) {
    tasks = tasks.filter((task) => task.projectId === projectId)
    if (params.filter) {
      tasks = tasks.filter((task) => matchesFilter(task, params.filter!))
    } else {
      tasks = tasks.filter((task) => !task.completed)
    }
  } else {
    const filter = params.filter ?? 'inbox'
    tasks = tasks.filter((task) => matchesFilter(task, filter))
  }

  if (label) tasks = tasks.filter((task) => task.label === label)
  if (q) tasks = tasks.filter((task) => matchesSearch(task, q))

  sortTasks(tasks, Boolean(projectId))
  return tasks
}

export function countDemoTasks(): TaskCounts {
  const data = readData()
  return {
    inbox: data.tasks.filter((t) => matchesFilter(t, 'inbox')).length,
    today: data.tasks.filter((t) => matchesFilter(t, 'today')).length,
    next: data.tasks.filter((t) => matchesFilter(t, 'next')).length,
    overdue: data.tasks.filter((t) => matchesFilter(t, 'overdue')).length,
  }
}

export function createDemoTask(input: {
  title: string
  description?: string | null
  dueDate?: string | null
  label?: string | null
  priority?: number
  projectId?: string | null
  sectionId?: string | null
  order?: number
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
    projectId: input.projectId ?? null,
    sectionId: input.sectionId ?? null,
    order: input.order ?? Date.now(),
    completedAt: null,
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
    projectId: string | null
    sectionId: string | null
    order: number
  }>
): TaskDto | null {
  const data = readData()
  const index = data.tasks.findIndex((task) => task.id === id)
  if (index === -1) return null

  const current = data.tasks[index]
  const now = new Date().toISOString()
  let completedAt = current.completedAt
  if (patch.completed === true && !current.completed) {
    completedAt = now
  } else if (patch.completed === false) {
    completedAt = null
  }

  const updated: TaskDto = {
    ...current,
    ...patch,
    completedAt,
    updatedAt: now,
  }
  data.tasks[index] = updated
  writeData(data)
  return updated
}

export function reorderDemoTasks(
  updates: Array<{ id: string; order: number; sectionId?: string | null }>
): number {
  const data = readData()
  const now = new Date().toISOString()
  const byId = new Map(updates.map((u) => [u.id, u]))
  let count = 0
  data.tasks = data.tasks.map((task) => {
    const update = byId.get(task.id)
    if (!update) return task
    count += 1
    return {
      ...task,
      order: update.order,
      ...(update.sectionId !== undefined ? { sectionId: update.sectionId } : {}),
      updatedAt: now,
    }
  })
  writeData(data)
  return count
}

export function rescheduleDemoTasks(
  ids: string[],
  dueDate: string
): number {
  const data = readData()
  const idSet = new Set(ids)
  let count = 0
  const now = new Date().toISOString()
  data.tasks = data.tasks.map((task) => {
    if (!idSet.has(task.id)) return task
    count += 1
    return { ...task, dueDate, updatedAt: now }
  })
  writeData(data)
  return count
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

export function listDemoProjects(): ProjectDto[] {
  const projects = [...readData().projects]
  projects.sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es')
  )
  return projects
}

export function getDemoProject(id: string): ProjectDto | null {
  return readData().projects.find((p) => p.id === id) ?? null
}

export function createDemoProject(input: {
  name: string
  description?: string | null
}): ProjectDto {
  const data = readData()
  const now = new Date().toISOString()
  const project: ProjectDto = {
    id: createId('project'),
    name: input.name,
    description: input.description ?? null,
    order: Date.now(),
    createdAt: now,
    updatedAt: now,
  }
  data.projects.push(project)
  writeData(data)
  return project
}

export function patchDemoProject(
  id: string,
  patch: Partial<{ name: string; description: string | null; order: number }>
): ProjectDto | null {
  const data = readData()
  const index = data.projects.findIndex((p) => p.id === id)
  if (index === -1) return null
  const updated = {
    ...data.projects[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  data.projects[index] = updated
  writeData(data)
  return updated
}

export function deleteDemoProject(id: string): boolean {
  const data = readData()
  const exists = data.projects.some((p) => p.id === id)
  if (!exists) return false
  data.projects = data.projects.filter((p) => p.id !== id)
  data.sections = data.sections.filter((s) => s.projectId !== id)
  data.tasks = data.tasks.map((t) =>
    t.projectId === id
      ? { ...t, projectId: null, sectionId: null, updatedAt: new Date().toISOString() }
      : t
  )
  writeData(data)
  return true
}

export function listDemoSections(projectId: string): SectionDto[] {
  const sections = readData().sections.filter((s) => s.projectId === projectId)
  sections.sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es')
  )
  return sections
}

export function createDemoSection(input: {
  projectId: string
  name: string
}): SectionDto {
  const data = readData()
  const now = new Date().toISOString()
  const section: SectionDto = {
    id: createId('section'),
    projectId: input.projectId,
    name: input.name,
    order: Date.now(),
    createdAt: now,
    updatedAt: now,
  }
  data.sections.push(section)
  writeData(data)
  return section
}

export function patchDemoSection(
  id: string,
  patch: Partial<{ name: string; order: number }>
): SectionDto | null {
  const data = readData()
  const index = data.sections.findIndex((s) => s.id === id)
  if (index === -1) return null
  const updated = {
    ...data.sections[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  data.sections[index] = updated
  writeData(data)
  return updated
}

export function reorderDemoSections(
  updates: Array<{ id: string; order: number }>
): number {
  const data = readData()
  const now = new Date().toISOString()
  const byId = new Map(updates.map((u) => [u.id, u]))
  let count = 0
  data.sections = data.sections.map((section) => {
    const update = byId.get(section.id)
    if (!update) return section
    count += 1
    return { ...section, order: update.order, updatedAt: now }
  })
  writeData(data)
  return count
}

export function deleteDemoSection(id: string): boolean {
  const data = readData()
  const exists = data.sections.some((s) => s.id === id)
  if (!exists) return false
  data.sections = data.sections.filter((s) => s.id !== id)
  data.tasks = data.tasks.map((t) =>
    t.sectionId === id
      ? { ...t, sectionId: null, updatedAt: new Date().toISOString() }
      : t
  )
  writeData(data)
  return true
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
