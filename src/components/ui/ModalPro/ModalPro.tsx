"use client";

import { useEffect, useRef } from "react";

import { useModalPro } from "@/context/context-ModalPro";
import Image from "next/image";

import ClosedIcon from "./icons/ClosedIcon.svg";
import ModalProImg from "./icons/img-box-premium.png";

export default function ModalPro() {
  const ModalProContext = useModalPro();
  const modalRef = useRef(null);

  // const previousFocus = useRef(null)

  // useEffect(() => {
  //   if (isOpen) {
  //     previousFocus.current = document.activeElement
  //     modalRef.current?.focus()
  //   } else {
  //     previousFocus.current?.focus()
  //   }
  // }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (!ModalProContext) return;

      if (e.key === "Escape") {
        ModalProContext.closeModalPro();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [ModalProContext]);

  if (!ModalProContext) return null;

  return ModalProContext.modalPro ? (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center bg-black/50 px-4 py-24"
      onClick={ModalProContext.closeModalPro}
    >
      <div
        className="z-10 flex h-full max-h-167.5 max-w-3xl"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Part 1: Test pro */}
        <div className="bg-surface-app rounded-tl-1xl flex h-full basis-3/5 flex-col gap-3 rounded-bl-3xl p-6">
          <h1 className="text-xl font-bold">Pro gratis</h1>
          <p>
            Millones de personas ya usan nuestras herramientas simples pero
            potentes para enfocarse y alcanzar sus metas.
          </p>

          <h2 className="mt-4 font-bold">Ciclo de facturación</h2>
          <div className="border-brand-500 rounded-md border px-2 py-3">
            <p className="font-bold">Anual</p>

            <p className="mt-1 font-bold">
              0 US$
              <span className="font-normal contrast-75">/mes</span>
              <span className="text-text-accent bg-accent-soft ml-5 rounded-md px-1 py-0.5 text-[12px] font-normal">
                Gratis
              </span>
            </p>
          </div>
        </div>

        {/* Part 2: More Information*/}
        <div className="bg-surface-sidebar relative flex h-full basis-2/5 flex-col items-center justify-center gap-3 rounded-tr-3xl p-6">
          <button>
            <Image
              src={ClosedIcon}
              className="absolute top-3 right-3 size-7 cursor-pointer rounded-md px-0.5 py-px transition duration-300 hover:bg-white/10"
              alt="Cerrar modal"
              onClick={ModalProContext.closeModalPro}
            />
          </button>

          <Image
            src={ModalProImg}
            className="select-none"
            draggable={false}
            width={250}
            height={250}
            alt=""
          />

          <h1 className="text-xl font-bold">Pro gratis</h1>

          <p>Funcionalidades, opciones y características, próximamente...</p>

          <p className="absolute bottom-3 text-center text-[14px] font-normal contrast-75">
            {" "}
            Esta web, es un proyecto de código abierto de practica, no un
            producto ni servicio oficial.
          </p>
        </div>
      </div>
    </div>
  ) : null;
}
