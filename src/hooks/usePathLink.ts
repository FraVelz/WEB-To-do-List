"use client";

import { usePathname } from "next/navigation";

export function usePathLink({ href }: { href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return isActive;
}
