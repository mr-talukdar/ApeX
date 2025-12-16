export default function CTA() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Ready to get started?
        </h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity font-medium">
            Login
          </button>
          <button className="px-6 py-3 border border-border text-foreground rounded hover:bg-secondary transition-colors font-medium">
            Join your group
          </button>
        </div>
      </div>
    </section>
  );
}
