import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg font-bold">Página no encontrada</p>
      <Link href="/" className="text-interactive-primary hover:text-interactive-primary-hover">Volver al inicio</Link>
    </div>
  );
}