export default function SafetyDisclaimer() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Safety Disclaimer
        </h2>
        <div className="bg-secondary p-6 rounded">
          <p className="text-foreground leading-relaxed">
            Apex System supports decision-making within riding groups. However,
            all riders remain ultimately responsible for their own safety,
            judgment, and adherence to traffic laws. No system can eliminate the
            inherent risks of motorcycle riding. Riders must evaluate their own
            capabilities, current condition, and the conditions of the ride
            before participating.
          </p>
        </div>
      </div>
    </section>
  );
}
