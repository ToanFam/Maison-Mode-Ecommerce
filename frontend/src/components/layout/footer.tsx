export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">Maison Mode</h2>
          <p className="mt-3 max-w-md text-sm text-secondary-foreground/75">
            Modern tailoring, elevated basics, and curated accessories for a focused wardrobe.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-normal">Studio</h3>
          <p className="mt-3 text-sm text-secondary-foreground/75">
            Designed for daily movement and long-term wear.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-normal">Support</h3>
          <p className="mt-3 text-sm text-secondary-foreground/75">
            Shipping, returns, and fit guidance are handled by our client team.
          </p>
        </div>
      </div>
    </footer>
  );
}
