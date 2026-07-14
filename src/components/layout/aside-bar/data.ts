import CalendarToday from './icons/CalendarToday.svg'
import Complete from './icons/Complete.svg'
import Filters from './icons/Filters.svg'
import Inbox from './icons/Inbox.svg'
import Next from './icons/Next.svg'

type AsideItem = {
  text: string
  link: string
  icon: string
  width: number
  height: number
  fontSize?: string
}

export const asideItems: AsideItem[] = [
  {
    text: 'Bandeja de entrada',
    link: '/inbox',
    icon: Inbox,
    width: 20,
    height: 20,
  },
  {
    text: 'Hoy',
    link: '/today',
    icon: CalendarToday,
    width: 18,
    height: 18,
  },
  {
    text: 'Próximo',
    link: '/next',
    icon: Next,
    width: 20,
    height: 20,
  },
  {
    text: 'Filtros y Etiquetas',
    link: '/filters',
    icon: Filters,
    width: 20,
    height: 20,
  },
  {
    text: 'Reportes',
    link: '/reports',
    icon: Complete,
    width: 20,
    height: 20,
  },
  {
    text: 'Completado',
    link: '/completed',
    icon: Complete,
    width: 20,
    height: 20,
  },
]
