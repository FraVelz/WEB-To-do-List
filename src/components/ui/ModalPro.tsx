"use client";

import { useEffect, useRef } from "react";
import { useModalPro } from "@/context/context-ModalPro";
import Image from "next/image";

export default function ModalPro() {
  const ModalProContext = useModalPro();
  const modalRef = useRef(null)
  const previousFocus = useRef(null)

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
      className="absolute top-0 left-0 w-screen h-screen px-4 py-24 bg-black/50 flex justify-center items-center"
      onClick={ModalProContext.closeModalPro}
      >
        <div className="flex z-10 max-w-3xl max-h-[670px] h-full"
          ref={modalRef}
          tabIndex={-1}
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

    ): null;
}


// import { useEffect, useRef } from "react"

// export default function ModalPro({ isOpen, onClose }) {
//   const modalRef = useRef(null)
//   const previousFocus = useRef(null)

//   useEffect(() => {
//     if (isOpen) {
//       previousFocus.current = document.activeElement
//       modalRef.current?.focus()
//     } else {
//       previousFocus.current?.focus()
//     }
//   }, [isOpen])

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "Escape") onClose()
//     }

//     document.addEventListener("keydown", handleKey)
//     return () => document.removeEventListener("keydown", handleKey)
//   }, [onClose])

//   if (!isOpen) return null

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       className="fixed inset-0 bg-black/50 flex justify-center items-center"
//       onClick={onClose}
//     >
//       <div
//         ref={modalRef}
//         tabIndex={-1}
//         className="bg-white p-6"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 id="modal-title">Modal</h2>
//         <button onClick={onClose}>Cerrar</button>
//       </div>
//     </div>
//   )
// }