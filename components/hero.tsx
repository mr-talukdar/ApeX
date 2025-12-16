export default function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-4xl font-semibold text-foreground mb-4 text-balance">
          ApeX System
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
          A structured system for safe, fair, level-based group rides
        </p>
        <a
          href="#how-it-works"
          className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity font-medium"
        >
          Learn how it works
        </a>
      </div>
    </section>
  );
}
