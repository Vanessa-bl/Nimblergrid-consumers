import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const VIEWPORT_GAP = 12;

export function usePopover() {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      if (window.innerWidth < 768) {
        setShift(0);
        return;
      }
      const wrapper = wrapperRef.current;
      const panel = panelRef.current;
      if (!wrapper || !panel) return;
      const wrapperLeft = wrapper.getBoundingClientRect().left;
      const panelWidth = panel.getBoundingClientRect().width;
      const maxLeft = Math.max(
        VIEWPORT_GAP,
        window.innerWidth - VIEWPORT_GAP - panelWidth,
      );
      const desiredLeft = Math.min(
        Math.max(wrapperLeft, VIEWPORT_GAP),
        maxLeft,
      );
      setShift(desiredLeft - wrapperLeft);
    };
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  const toggle = () => setOpen((current) => !current);
  const close = () => setOpen(false);

  const panelStyle: CSSProperties | undefined =
    shift === 0 ? undefined : { transform: `translateX(${shift}px)` };

  return { open, toggle, close, setOpen, wrapperRef, triggerRef, panelRef, panelStyle };
}
