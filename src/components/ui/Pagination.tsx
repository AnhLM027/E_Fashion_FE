import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      // Always show first page
      pages.push(renderPageButton(0));

      if (currentPage > 3) {
        pages.push(<MoreHorizontal key="ellipsis-start" className="w-4 h-4 text-zinc-400" />);
      }

      // Show pages around current page
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(renderPageButton(i));
      }

      if (currentPage < totalPages - 4) {
        pages.push(<MoreHorizontal key="ellipsis-end" className="w-4 h-4 text-zinc-400" />);
      }

      // Always show last page
      pages.push(renderPageButton(totalPages - 1));
    }

    return pages;
  };

  const renderPageButton = (page: number) => {
    const isActive = currentPage === page;
    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200 scale-105"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        )}
      >
        {page + 1}
      </button>
    );
  };

  return (
    <nav
      className={cn("flex items-center justify-center gap-2 py-8", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};
