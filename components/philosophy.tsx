export default function Philosophy() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-foreground mb-12">
          Philosophy
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">
              Why ApeX was created
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Motorcycle riding groups need clear, fair systems to manage access
              to rides and ensure everyone can participate safely. Apex was
              built to fill this gap.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">
              The problems it solves in group riding
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Without clear frameworks, groups struggle with safety consistency,
              member progression, and fair access to rides. Apex provides
              structure that respects both freedom and responsibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
