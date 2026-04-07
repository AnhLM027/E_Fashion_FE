import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "./Skeleton/skeleton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
  className?: string;
  tableClassName?: string;
  emptyMessage?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  onRowClick,
  hoverable = true,
  className,
  tableClassName,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-3xl border border-zinc-100 bg-white shadow-sm", className)}>
      <table className={cn("w-full text-sm text-left border-collapse", tableClassName)}>
        <thead className="bg-zinc-50/80 backdrop-blur-sm border-b border-zinc-100 text-zinc-500 font-medium uppercase tracking-widest text-[10px]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-6 py-6 font-semibold",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {loading ? (
            // Loading Skeletons
            [...Array(5)].map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                {columns.map((col) => (
                  <td key={`skeleton-cell-${col.key}`} className="px-6 py-6">
                    <Skeleton className="h-4 w-full bg-zinc-50 opacity-40" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center text-zinc-400 font-light italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors duration-200 border-b border-zinc-50 last:border-0",
                  hoverable && onRowClick && "cursor-pointer hover:bg-zinc-50/50",
                  hoverable && !onRowClick && "hover:bg-zinc-50/30"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${item.id}-${col.key}`}
                    className={cn(
                      "px-6 py-6 text-zinc-600",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
