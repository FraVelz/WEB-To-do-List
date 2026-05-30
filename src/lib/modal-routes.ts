export const MODAL_PATHS = {
  addTask: '/add-task',
  search: '/search',
  pro: '/pro',
} as const

export type ModalPath = (typeof MODAL_PATHS)[keyof typeof MODAL_PATHS]

export const MODAL_PATH_LIST: ModalPath[] = [
  MODAL_PATHS.addTask,
  MODAL_PATHS.search,
  MODAL_PATHS.pro,
]

export function isModalPath(pathname: string): boolean {
  return MODAL_PATH_LIST.some(
    (p) => pathname === p || pathname.endsWith(p),
  )
}
