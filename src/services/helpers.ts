export class LocalStorageJson {
  name: string

  constructor(name: string) {
    this.name = name
  }

  create(data: Record<string, string>): boolean {
    if (typeof localStorage === 'undefined') return false
    try {
      localStorage.setItem(this.name, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  read(): string {
    if (typeof localStorage === 'undefined') return ''
    return localStorage.getItem(this.name) ?? ''
  }

  /** Reservado para futura sincronización; hoy no persiste cambios adicionales. */
  write(): string {
    return ''
  }
}
