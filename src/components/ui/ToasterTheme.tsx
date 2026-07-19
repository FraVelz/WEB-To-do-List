'use client'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import {
  Toaster as PheralbToaster,
  type ToasterProperties,
} from '@pheralb/toast'

import { useThemeStore } from '@/stores/theme-store'

export function Toaster(props: ToasterProperties) {
  const theme = useThemeStore((s) => s.theme)
  const hydrate = useThemeStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <PheralbToaster
      theme={theme}
      position="top-center"
      maxToasts={4}
      toastOptions={{
        icons: {
          success: <CircleCheckIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <TriangleAlertIcon className="size-4" />,
          error: <OctagonXIcon className="size-4" />,
          loading: <Loader2Icon className="size-4 animate-spin" />,
        },
      }}
      {...props}
    />
  )
}
