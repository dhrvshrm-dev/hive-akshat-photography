// Centres content and keeps a consistent page width + side padding.
export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-content px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
