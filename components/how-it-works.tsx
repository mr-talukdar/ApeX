export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-foreground mb-12">
          How It Works
        </h2>
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Join a riding group
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Start by becoming a member of a riding group that uses Apex
                System.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Earn your level through participation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Develop your skills and demonstrate reliability through
                consistent participation.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Unlock appropriate rides
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Access rides that match your skill level and experience within
                the group.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
