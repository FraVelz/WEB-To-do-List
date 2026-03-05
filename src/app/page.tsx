import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Organiza tu vida y tu trabajo, finalmente.
      </h1>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        Simplifica tu día a día con el gestor de tareas más intuitivo del mundo. 
        Crea listas de tareas, establece recordatorios y alcanza tus metas paso a paso. 
        Mantén todo bajo control en un solo lugar y libera espacio en tu mente.
      </p>
      
      <Link href='/add-task' className="mt-8 bg-bg-button-primary hover:bg-bg-button-primary-hover text-text-main font-semibold py-3 px-8 rounded-lg transition-colors">
        Empieza gratis
      </Link>
    </main>
  );
}
