import site from "@/data/site.json"

export function CareerTimeline() {
  const items = site.timeline || []
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50/40 via-yellow-50/30 to-orange-100/40 dark:from-orange-950/30 dark:via-yellow-950/20 dark:to-orange-900/30 relative overflow-hidden">
      {/* Bitcoin-themed background elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#F7931A] rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-[#F7931A] rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#F7931A] rounded-full blur-md"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-[#F7931A] rounded-full blur-2xl"></div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Career Timeline</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My professional journey in blockchain development and software engineering
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F7931A] via-[#FF8C00] to-[#F7931A]/40 transform md:-translate-x-1/2 rounded-full shadow-sm" />
          <div className="space-y-8">
            {items.map((item, idx) => (
              <TimelineItem key={idx} {...item} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type Item = {
  title: string
  organization: string
  start: string
  end: string
  summary: string
  highlights?: string[]
  links?: { label: string; url: string }[]
  index?: number
}

function TimelineItem(props: Item) {
  const { title, organization, start, end, summary, highlights = [], links = [], index = 0 } = props
  const yearLabel = start === end ? start : `${start} - ${end}`
  const isEven = index % 2 === 0
  
  return (
    <div className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline dot */}
      <div className="absolute left-8 md:left-1/2 w-5 h-5 bg-gradient-to-br from-[#F7931A] to-[#FF8C00] border-4 border-white dark:border-gray-900 rounded-full transform md:-translate-x-1/2 z-10 shadow-lg shadow-[#F7931A]/30" />
      
      {/* Content */}
      <article
        className={`ml-16 md:ml-0 ${isEven ? 'md:mr-8 md:pr-8' : 'md:ml-8 md:pl-8'} md:w-1/2 bg-gradient-to-br from-orange-50/80 via-yellow-50/60 to-orange-100/80 dark:from-orange-950/40 dark:via-yellow-950/30 dark:to-orange-900/40 backdrop-blur-sm rounded-xl border border-[#F7931A]/30 dark:border-[#F7931A]/40 p-6 shadow-lg hover:shadow-xl hover:shadow-[#F7931A]/20 transition-all duration-300 hover:border-[#F7931A]/50 hover:from-orange-100/90 hover:to-orange-50/90 dark:hover:from-orange-900/50 dark:hover:to-orange-950/50`}
        aria-label={`Timeline entry for ${yearLabel}`}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F7931A]/10 px-3 py-1 text-sm font-medium text-[#F7931A]">{yearLabel}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-base font-medium text-[#F7931A] mb-3">{organization}</p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{summary}</p>
        {highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {highlights.slice(0, 2).map((h, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                <span className="text-[#F7931A] mt-1.5 text-xs font-bold">●</span>
                {h}
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#F7931A] hover:text-[#F7931A]/80 underline transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
