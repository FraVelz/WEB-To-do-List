import Link from "next/link";

import Header from "../components/layout/Header";

export default function Home() {
  return (
    <>
      <Header></Header>

      <main className="flex w-full flex-1 flex-col items-center justify-center gap-3">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
          Organiza tu vida y tu trabajo, finalmente.
        </h1>
        <p className="max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Simplifica tu día a día con el gestor de tareas más intuitivo del
          mundo. Crea listas de tareas, establece recordatorios y alcanza tus
          metas paso a paso. Mantén todo bajo control en un solo lugar y libera
          espacio en tu mente.
        </p>

        <Link
          href="/add-task"
          className="bg-interactive-primary hover:bg-interactive-primary-hover text-text-primary mt-8 rounded-lg px-8 py-3 font-semibold transition-colors"
        >
          Empieza gratis
        </Link>
      </main>
    </>
  );
}
