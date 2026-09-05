import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import type { PaginationProps } from "./Pagination.types";

type PageToken =
  | { kind: "page"; page: number }
  | { kind: "gap"; after: number };

const baseButtonClasses =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

const idleButtonClasses =
  "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900";

const activeButtonClasses = "border-transparent bg-zinc-900 text-white";

const disabledButtonClasses =
  "pointer-events-none cursor-not-allowed border-zinc-200 bg-white text-zinc-300";

function buildPageTokens(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PageToken[] {
  const wanted = new Set<number>();
  for (let i = 1; i <= boundaryCount && i <= pageCount; i += 1) wanted.add(i);
  for (let i = Math.max(1, pageCount - boundaryCount + 1); i <= pageCount; i += 1) {
    wanted.add(i);
  }
  for (let i = Math.max(1, page - siblingCount); i <= Math.min(pageCount, page + siblingCount); i += 1) {
    wanted.add(i);
  }

  const sorted = [...wanted].sort((a, b) => a - b);
  const tokens: PageToken[] = [];
  let previous = 0;
  for (const pageNumber of sorted) {
    if (pageNumber - previous > 1) {
      tokens.push({ kind: "gap", after: previous });
    }
    tokens.push({ kind: "page", page: pageNumber });
    previous = pageNumber;
  }
  return tokens;
}

function resolveButtonClasses(
  isActive: boolean,
  isDisabled: boolean,
): string {
  if (isDisabled) return disabledButtonClasses;
  if (isActive) return activeButtonClasses;
  return idleButtonClasses;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  ariaLabel = "Paginación",
  previousLabel = "Página anterior",
  nextLabel = "Página siguiente",
  className,
}: Readonly<PaginationProps>) {
  if (pageCount <= 1) return null;

  const currentPage = Math.min(Math.max(1, page), pageCount);
  const isPreviousDisabled = disabled || currentPage <= 1;
  const isNextDisabled = disabled || currentPage >= pageCount;
  const tokens = buildPageTokens(
    currentPage,
    pageCount,
    Math.max(0, siblingCount),
    Math.max(0, boundaryCount),
  );

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          <button
            type="button"
            aria-label={previousLabel}
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(currentPage - 1)}
            className={`${baseButtonClasses} ${resolveButtonClasses(false, isPreviousDisabled)}`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </li>
        {tokens.map((token) =>
          token.kind === "gap" ? (
            <li
              key={`gap-${token.after}`}
              aria-hidden="true"
              className="flex h-10 w-6 items-center justify-center text-sm text-zinc-400"
            >
              …
            </li>
          ) : (
            <li key={token.page}>
              <button
                type="button"
                aria-current={token.page === currentPage ? "page" : undefined}
                disabled={disabled}
                onClick={() => onPageChange(token.page)}
                className={`${baseButtonClasses} ${resolveButtonClasses(
                  token.page === currentPage,
                  disabled,
                )}`}
              >
                {token.page}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={isNextDisabled}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${baseButtonClasses} ${resolveButtonClasses(false, isNextDisabled)}`}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
