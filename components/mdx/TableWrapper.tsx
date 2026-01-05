"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface TableWrapperProps {
  children: ReactNode;
}

export function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "my-6 overflow-x-auto rounded-lg border border-slate-700",
          "-mx-4 px-4 sm:mx-0 sm:px-0"
        )
      )}
    >
      <div className="min-w-full inline-block align-middle">
        <div
          className={twMerge(
            clsx(
              "[&>table]:m-0 [&>table]:w-full [&>table]:border-collapse",
              // Header styles
              "[&_thead]:bg-slate-800/80",
              "[&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-gray-300",
              "[&_th]:border-b [&_th]:border-slate-600",
              // Body styles
              "[&_tbody_tr]:border-b [&_tbody_tr]:border-slate-700/50",
              "[&_tbody_tr:last-child]:border-0",
              "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-slate-800/30",
              "[&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-gray-300",
              // Number alignment
              "[&_td:has(.number)]:text-right [&_td:has(.number)]:font-mono"
            )
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default TableWrapper;
