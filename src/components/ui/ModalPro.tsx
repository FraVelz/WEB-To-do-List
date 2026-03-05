"use client";

import { useModalPro } from "@/context/context-ModalPro";
import Image from "next/image";

export default function ModalPro() {
  const ModalProContext = useModalPro();

  if (!ModalProContext) return null;

if (ModalProContext.modalPro) {
  return (
      <div
      className="absolute top-0 left-0 w-screen h-screen px-4 py-24 bg-black/50 flex justify-center items-center"
      onClick={ModalProContext.closeModalPro}
      >
        <div className="flex z-10 max-w-3xl max-h-[670px] h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="basis-[60%] h-full bg-surface-app rounded-bl-3xl rounded-tl-1xl flex flex-col justify-center items-center gap-3 p-6">
            <h1>Prueba Pro gratis</h1>
            <p>Millones de personas ya usan nuestras herramientas simples pero potentes para enfocarse y alcanzar sus metas.</p>
          </div>

          <div className="basis-[40%] h-full bg-surface-sidebar flex flex-col justify-center items-center gap-3 p-6">
            <h1>Prueba Pro gratis</h1>
            <p>Millones de personas ya usan nuestras herramientas simples pero potentes para enfocarse y alcanzar sus metas.</p>
            <button className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1">
              <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
              <p className="text-sm text-text-heading">Formato</p>
              <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
              <p className="text-sm text-text-heading">Formato</p>
              <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
              <p className="text-sm text-text-heading">Formato</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
