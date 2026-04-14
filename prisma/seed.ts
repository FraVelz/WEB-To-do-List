import 'dotenv/config'

import { prisma } from '../src/lib/prisma'

async function main() {
  const notificationCount = await prisma.notification.count()
  if (notificationCount === 0) {
    await prisma.notification.create({
      data: {
        title: '¡Hola! Bienvenido.',
        content:
          'Empieza a organizar tus tareas desde la bandeja de entrada. Usa el botón «Agregar tarea» en el menú lateral.',
        color: 'red',
        read: false,
      },
    })
  }

  const taskCount = await prisma.task.count()
  if (taskCount === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Revisar la bandeja de entrada',
          description: 'Marca tareas como hechas cuando termines.',
          priority: 0,
        },
        {
          title: 'Probar el buscador de tareas',
          description: 'Abre «Buscar» en el menú lateral.',
          priority: 1,
          label: 'Tutorial',
        },
      ],
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
