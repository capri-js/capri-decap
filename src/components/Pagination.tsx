import { memo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
};

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-12">
      {pages.map((page) => (
        <a
          key={page}
          href={page === 1 ? baseUrl : `${baseUrl}/page/${page}`}
          className={`
            inline-flex h-10 w-10 items-center justify-center rounded-lg
            transition-colors
            ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          {page}
        </a>
      ))}
    </div>
  );
});
