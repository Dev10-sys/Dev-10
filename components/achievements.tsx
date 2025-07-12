import site from "@/data/site.json";
import { ExternalLink } from "lucide-react";

const Achievements = () => {
  const items = site.achievements || [];
  return (
    <div className="w-full max-w-none">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-3">
          Achievements
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Key milestones and recognitions in my journey
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {items.map((it, idx) => {
          const content = (
            <>
              <h3 className="text-lg font-semibold flex items-center justify-between gap-2">
                {it.label}
                {it.link && (
                  <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </h3>
              {it.value ? (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {it.value}
                </p>
              ) : null}
            </>
          );

          if (it.link) {
            return (
              <a
                key={idx}
                href={it.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border-2 border-primary/70 bg-card p-5 shadow-[0_0_20px_rgba(247,147,26,0.14)] hover:border-[#F7931A] hover:shadow-[0_0_30px_rgba(247,147,26,0.25)] transition-all cursor-pointer"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={idx}
              className="rounded-xl border-2 border-primary/70 bg-card p-5 shadow-[0_0_20px_rgba(247,147,26,0.14)]"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
export { Achievements };
