/** One CSS pixel covers the rounding performed by native fragment scrolling. */
const ALIGNMENT_TOLERANCE = 1

export interface HeadingPosition {
  id: string
  /** Heading border-box position in document coordinates. */
  top: number
  /** The root scroll-padding-top plus this heading's scroll-margin-top. */
  offset: number
}

export function activeArticleHeading(
  headings: readonly HeadingPosition[],
  scrollY: number,
  maxScrollY: number,
  anchorId?: string,
): string | undefined {
  if (!headings.length) return undefined

  // Several short final sections can share the same clamped scroll destination.
  // The explicit fragment disambiguates them only while at that destination;
  // ordinary scrolling immediately goes back to following the visible section.
  const anchor = headings.find(heading => heading.id === anchorId)
  if (anchor) {
    const destination = Math.max(0, Math.min(maxScrollY, anchor.top - anchor.offset))
    if (Math.abs(scrollY - destination) <= ALIGNMENT_TOLERANCE) return anchor.id
  }

  let active = headings[0].id
  for (const heading of headings) {
    if (heading.top - heading.offset <= scrollY + ALIGNMENT_TOLERANCE) active = heading.id
  }
  return active
}

export function articleHeadingFromHash(hash: string, headingIds: readonly string[]): string | undefined {
  const fragment = hash.replace(/^#/, '')
  if (!fragment) return undefined
  try {
    const decoded = decodeURIComponent(fragment)
    if (headingIds.includes(decoded)) return decoded
  } catch {
    // A literal percent sign in a historical heading is a valid DOM id.
  }
  return headingIds.includes(fragment) ? fragment : undefined
}
