// Line icons for the social platforms, drawn to match the site's hairline HUD
// style (currentColor, 1.5 stroke) rather than pasted-in brand badges. X is
// its own glyph, so it is the one filled mark.
const paths = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.3v5.4l4.7-2.7z" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21" />,
  threads: (
    <path d="M16.6 11.2c-.4-2.6-2.2-3.8-4.4-3.8-2.5 0-4.1 1.7-4.1 4.6 0 3 1.8 4.8 4.4 4.8 2.2 0 3.6-1.2 3.6-2.9 0-2.1-2.3-2.8-4.4-2.4-1.5.3-2.3 1.2-2.1 2.2.2 1.1 1.4 1.6 2.6 1.4 2.4-.4 3.2-2.6 3-5.6-.3-3.8-2.7-6-6.3-6C4.9 3.5 3 7 3 12s2.4 8.5 8.4 8.5c3.4 0 5.6-1.3 6.9-3.4" />
  ),
  x: (
    <path
      d="M17.8 3.5h2.9l-6.4 7.3 7.5 9.7h-5.9l-4.6-6-5.3 6H3.1l6.8-7.8-7.2-9.2h6l4.2 5.5zm-1 15.3h1.6L7.4 5.1H5.7z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

/** `name`: instagram | youtube | facebook | threads | x */
export default function SocialIcon({ name, className = "h-4 w-4" }) {
  const p = paths[name];
  if (!p) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p}
    </svg>
  );
}
