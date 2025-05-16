export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 md:py-8 border-t bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Trusted Future. All rights reserved.</p>
        <p className="mt-1">Your Partner in Financial Security and Growth.</p>
      </div>
    </footer>
  );
}
