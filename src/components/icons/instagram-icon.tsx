/**
 * InstagramIcon
 *
 * A stroke-based SVG icon that correctly renders the Instagram camera mark:
 *   • Rounded rectangle camera body  (not a circle — the original bug)
 *   • Lens circle
 *   • Flash dot (near-zero line with round linecap = perfect circle dot)
 *
 * Matches the Lucide/Feather icon style already used in this project.
 * Size and color are controlled entirely via `className` (inherits `currentColor`).
 *
 * @example
 * // Standalone icon link — needs aria-label
 * <a href="https://instagram.com/…" aria-label="Instagram">
 *   <InstagramIcon className="h-6 w-6" aria-hidden />
 * </a>
 *
 * // Decorative icon next to visible text — hide from screen readers
 * <span>
 *   <InstagramIcon className="h-5 w-5 text-pink-500" aria-hidden />
 *   Follow us
 * </span>
 */

interface InstagramIconProps {
  /** Tailwind size + color classes. Defaults to `"h-5 w-5"`. */
  className?: string;
  /**
   * Accessible label for screen readers.
   * Required when the icon is the *only* content labelling an action
   * (e.g. an icon-only button or link). Omit when visible text already
   * describes the action — use `aria-hidden` in that case instead.
   */
  "aria-label"?: string;
  /**
   * Set `true` (or `"true"`) when the icon is purely decorative —
   * i.e. adjacent visible text already describes the element.
   * Hides the icon from the accessibility tree.
   */
  "aria-hidden"?: boolean | "true" | "false";
}

export function InstagramIcon({
  className = "h-5 w-5",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: InstagramIconProps) {
  const isDecorative = ariaHidden === true || ariaHidden === "true";

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      // Accessibility: role + label only when the icon carries meaning
      role={isDecorative ? undefined : "img"}
      aria-label={isDecorative ? undefined : (ariaLabel ?? "Instagram")}
      aria-hidden={isDecorative ? true : undefined}
    >
      {/*
       * Camera body — rounded rectangle with rx=5 matches Instagram's
       * characteristic squircle outline. The original used a circle path
       * here, which is the wrong shape entirely.
       */}
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />

      {/* Lens — centred circle */}
      <circle cx="12" cy="12" r="4" />

      {/*
       * Flash dot — a near-zero-length horizontal line (Δx = 0.01) with
       * strokeLinecap="round" renders as a perfect circle of diameter
       * equal to strokeWidth. Simpler and crisper than a <circle r="1">.
       */}
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}