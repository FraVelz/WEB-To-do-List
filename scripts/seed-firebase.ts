import 'dotenv/config'

import { getAuth } from 'firebase-admin/auth'

import { getAdminDb } from '../src/lib/firebase/admin'
import { createNotification } from '../src/lib/firebase/repositories/notifications'
import { createTask } from '../src/lib/firebase/repositories/tasks'

async function resolveDemoUserId(): Promise<string> {
  const email = process.env.NEXT_PUBLIC_FIREBASE_DEMO_EMAIL?.trim()
  if (!email) {
    throw new Error('Falta NEXT_PUBLIC_FIREBASE_DEMO_EMAIL en .env')
  }

  const user = await getAuth().getUserByEmail(email)
  return user.uid
}

async function main() {
  const userId = await resolveDemoUserId()
  const db = getAdminDb()

  const notifications = await db
    .collection('notifications')
    .where('userId', '==', userId)
    .limit(1)
    .get()

  if (notifications.empty) {
    await createNotification(userId, {
      title: '¡Hola! Bienvenido.',
      content:
        'Empieza a organizar tus tareas desde la bandeja de entrada. Usa el botón «Agregar tarea» en el menú lateral.',
      color: 'red',
    })
    console.log('Notificación de bienvenida creada.')
  }

  const tasks = await db
    .collection('tasks')
    .where('userId', '==', userId)
    .limit(1)
    .get()

  if (tasks.empty) {
    await createTask(userId, {
      title: 'Revisar la bandeja de entrada',
      description: 'Marca tareas como hechas cuando termines.',
      priority: 0,
    })
    await createTask(userId, {
      title: 'Probar el buscador de tareas',
      description: 'Abre «Buscar» en el menú lateral.',
      priority: 1,
      label: 'Tutorial',
    })
    console.log('Tareas de ejemplo creadas.')
  }

  console.log('Seed completado para usuario demo:', userId)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
