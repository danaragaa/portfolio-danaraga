"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedProjectLinkProps = {
  href: string;
  className?: string;
  eventName: string;
  payload: Record<string, string>;
  children: ReactNode;
};

export default function TrackedProjectLink({
  href,
  className,
  eventName,
  payload,
  children,
}: TrackedProjectLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(eventName, payload)}>
      {children}
    </Link>
  );
}