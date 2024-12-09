const now = new Date();

export default function Footer() {
  return (
    <footer className="shrink-0">
      <div className="flex items-center justify-center mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-sm">© {now.getFullYear()} Giret</span>
      </div>
    </footer>
  );
}
