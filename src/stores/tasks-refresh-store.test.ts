import { describe, expect, it } from 'vitest'

import { useTasksRefreshStore } from './tasks-refresh-store'

describe('useTasksRefreshStore', () => {
  it('bump incrementa version', () => {
    const s = useTasksRefreshStore.getState()
    expect(s.version).toBe(0)
    s.bump()
    expect(useTasksRefreshStore.getState().version).toBe(1)
    useTasksRefreshStore.setState({ version: 0 })
  })
})
