import Link from 'next/link'
import Header from '@/components/layout/header/Header'

export default function Home() {
  return (
    <>
      <Header></Header>

      <main className="flex w-full flex-1 flex-col items-center justify-center gap-3">
        <h1 className="text-text-heading mb-6 text-4xl font-bold md:text-5xl">
          Organiza tu vida y tu trabajo, finalmente.
        </h1>
        <p className="text-text-secondary max-w-2xl text-center text-lg leading-relaxed">
          Simplifica tu día a día con el gestor de tareas más intuitivo del
          mundo. Crea listas de tareas, establece recordatorios y alcanza tus
          metas paso a paso. Mantén todo bajo control en un solo lugar y libera
          espacio en tu mente.
        </p>

        <Link
          href="/inbox"
          className="bg-interactive-primary hover:bg-interactive-primary-hover text-text-primary mt-8 rounded-lg px-8 py-3 font-semibold transition-colors"
        >
          Empieza gratis
        </Link>
      </main>
    </>
  )
}
