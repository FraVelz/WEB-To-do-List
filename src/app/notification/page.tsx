"use client";

import Header from "@/components/layout/header/Header";

import Image from "next/image";

import { clsx } from "clsx";
import { useState } from "react";

export default function Notification() {
  const [activeTodas, setActiveTodas] = useState(true);

  return (
    <>
      <Header></Header>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold">Notificaciones</h1>

          <div className="bg-interactive-hover-soft mt-7 flex w-fit gap-3 rounded-full px-1 py-1">
            <button
              className={clsx(
                `text-text-primary rounded-full px-2 py-1 text-[14px]`,
                {
                  "bg-black/50": activeTodas,
                },
              )}
              onClick={() => {
                setActiveTodas(true);
              }}
            >
              Todas
            </button>

            <button
              className={clsx(
                `text-text-primary rounded-full px-2 py-1 text-[14px]`,
                {
                  "bg-black/50": !activeTodas,
                },
              )}
              onClick={() => {
                setActiveTodas(false);
              }}
            >
              Sin leer
            </button>
          </div>

          {activeTodas ? (
            <div>
              <hr className="text-accent-soft my-4" />

              <div className="hover:bg-accent-soft flex w-full cursor-pointer gap-3 rounded-lg px-3 py-2">
                <div>
                  <div className="bg-accent-400 size-8 rounded-full p-2"></div>
                </div>

                <div>
                  <p className="font-bold">¡Hola! Bienvenido.</p>

                  <p className="mt-3 text-[14px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime corrupti, unde laudantium aspernatur eveniet aliquid
                    perspiciatis sunt delectus, similique, earum ipsa debitis
                    nobis voluptas expedita vel natus quo quod dolorem!
                  </p>
                </div>
              </div>

              <hr className="text-accent-soft my-4" />
            </div>
          ) : (
            <div>
              <Image
                src="/images/image-box-clear.png"
                alt="No notifications"
                width={250}
                height={250}
                className="mx-auto mt-14 select-none"
                draggable={false}
              />

              <p className="text-text-secondary text-center">
                ¡Buen trabajo! Estás al día.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
