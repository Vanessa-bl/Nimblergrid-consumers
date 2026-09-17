export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};
