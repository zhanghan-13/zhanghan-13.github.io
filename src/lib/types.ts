/** The client receives article summaries only; article bodies remain in static HTML. */
export interface PostSummary {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  wordCount: number
}
