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

export function articleHeadingFromHash(hash: string, headingIds: readonly string[], aliases?: ReadonlyMap<string, string>): string | undefined {
  const fragment = hash.replace(/^#/, '')
  if (!fragment) return undefined
  const resolve = (id: string) => headingIds.includes(id) ? id : aliases?.get(id)
  try {
    const decoded = decodeURIComponent(fragment)
    const id = resolve(decoded)
    if (id) return id
  } catch {
    // A literal percent sign in a historical heading is a valid DOM id.
  }
  return resolve(fragment)
}

export interface ArticleAnchorProtection {
  hash: string
  scrollY: number
}

/** Keep an explicit anchor's original clamped destination as late content expands. */
export function articleAnchorProtection(
  previous: ArticleAnchorProtection | undefined,
  hash: string,
  destination: number | undefined,
): ArticleAnchorProtection | undefined {
  if (destination === undefined) return undefined
  return {
    hash,
    scrollY: previous?.hash === hash ? Math.min(previous.scrollY, destination) : destination,
  }
}

/** Undefined leaves non-reading anchors alone; an empty hash returns to the article top. */
export function articleReadingHash(
  headings: readonly HeadingPosition[],
  scrollY: number,
  articleBottom: number,
  activeId: string | undefined,
  currentHash: string,
  protectedAnchorScrollY?: number,
): string | undefined {
  const first = headings[0]
  if (!first || !activeId || !headings.some(heading => heading.id === activeId)) return undefined
  // Comment anchors have their own scroll margin and can land above the normal
  // article reading boundary. Keep them until the reader scrolls back above it.
  if (protectedAnchorScrollY !== undefined && scrollY + ALIGNMENT_TOLERANCE >= protectedAnchorScrollY) return undefined
  // Once the reading line reaches comments, keep explicit comment links intact.
  if (scrollY + first.offset >= articleBottom) return undefined
  if (scrollY + ALIGNMENT_TOLERANCE < first.top - first.offset) {
    return articleHeadingFromHash(currentHash, headings.map(heading => heading.id)) ? '' : undefined
  }
  // Encode the canonical DOM id once; browsers display ordinary Chinese fragments.
  return '#' + encodeURIComponent(activeId)
}
