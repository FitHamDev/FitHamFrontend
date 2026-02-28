/**
 * ============================================================
 *  FIT HAM — Central Theme Configuration
 * ============================================================
 *  Change any value here and it applies everywhere instantly.
 *  No need to dig through individual components.
 * ============================================================
 */

const theme = {
  // ── Brand colors ───────────────────────────────────────────
  colors: {
    /** Primary club blue (used in headers, accents, deep backgrounds) */
    primary: '#004aad',
    /** Lighter blue for gradient bottoms / lighter surfaces */
    primaryLight: '#24c3fd',
    /** Accent yellow (titles, highlights, buttons) */
    accent: '#facc15',        // Tailwind yellow-400 equivalent
    /** Darker accent for borders on highlighted items */
    accentBorder: '#fde047',  // Tailwind yellow-300 equivalent
    /** White */
    white: '#ffffff',

    // ── Background / surface colors ──────────────────────────
    /** Match card background */
    matchCardBg: 'rgba(0, 40, 100, 0.55)',
    /** Match card border */
    matchCardBorder: 'rgba(255, 255, 255, 0.10)',
    /** Score box background */
    scoreBoxBg: 'rgba(0, 0, 0, 0.30)',
    /** Score box border */
    scoreBoxBorder: 'rgba(255, 255, 255, 0.10)',
    /** Time badge background */
    timeBadgeBg: 'rgba(0, 40, 100, 0.50)',
    /** Time badge border */
    timeBadgeBorder: 'rgba(250, 204, 21, 0.30)',

    // ── Rangschikking table ──────────────────────────────────
    /** Table header row background */
    tableHeaderBg: 'rgba(0, 40, 100, 0.65)',
    /** Table header text color */
    tableHeaderText: 'rgba(255, 255, 255, 0.90)',
    /** Normal row background */
    tableRowBg: 'rgba(255, 255, 255, 0.90)',
    /** Normal row text color */
    tableRowText: '#003580',
    /** Highlighted (Ham) row background */
    tableHighlightBg: '#facc15',
    /** Highlighted (Ham) row border */
    tableHighlightBorder: '#fde047',
    /** Highlighted (Ham) row text */
    tableHighlightText: '#002a66',
    /** Footer text (x van y teams) */
    tableFooterText: 'rgba(255, 255, 255, 0.70)',

    // ── Background pattern overlay opacity ───────────────────
    /** The "FIT HAM" repeating text pattern opacity (0-100%) */
    patternOpacity: '15%',
    /** Sponsor page pattern opacity */
    sponsorPatternOpacity: '15%',
  },

  // ── Gradient ───────────────────────────────────────────────
  gradient: {
    /** Top color of the full-screen background gradient */
    top: '#004aad',
    /** Bottom color of the full-screen background gradient */
    bottom: '#24c3fd',
  },

  // ── Layout — spacing & sizing ──────────────────────────────
  layout: {
    /** Max width of the main content container (Tailwind class) */
    maxContentWidth: 'max-w-7xl',
    /** Gap between match card and rangschikking table (Tailwind class) */
    matchRangGap: 'gap-3',
    /** Horizontal padding on the outer container (Tailwind class) */
    outerPaddingX: 'px-1',
    /** Match column width when rangschikking is present (Tailwind arbitrary) */
    matchColumnWidth: 'md:w-[46%]',
    /** Rangschikking column width (Tailwind arbitrary) */
    rangColumnWidth: 'md:w-[54%]',
    /** Padding top for content (below the title bar) */
    contentPaddingTop: 'pt-40',
    /** Title bar distance from top */
    titleTop: 'top-16',
    /** Max width used when only one pane (match OR ranking) is visible */
    singlePaneContentWidth: 'max-w-4xl',
    /** Yellow accent bar height on mobile */
    accentBarHeightMobile: 'h-10',
    /** Yellow accent bar height from md and up */
    accentBarHeightDesktop: 'md:h-16',

    // ── Sponsor image sizing ────────────────────────────────
    /** Sponsor image width */
    sponsorImageWidth: 'w-[90%]',
    /** Sponsor image height */
    sponsorImageHeight: 'h-[75%]',
    /** Minimum sponsor image width */
    sponsorImageMinWidth: 'min-w-[320px]',
    /** Minimum sponsor image height */
    sponsorImageMinHeight: 'min-h-[220px]',

    // ── Rangschikking table layout ───────────────────────────
    /** Vertical space between table rows (Tailwind class) */
    tableRowSpacing: 'space-y-2',
    /** Table row horizontal padding */
    tableRowPx: 'px-10',
    /** Table row vertical padding */
    tableRowPy: 'py-6',
    /** Minimum height per table row */
    tableRowMinH: 'min-h-[2rem]',
    /** Table row border radius */
    tableRowRadius: 'rounded-lg',

    // ── Dynamic team count (for screen-height calculation) ───
    /** Pixels reserved at top (title + gap) */
    reserveTop: 150,
    /** Pixels reserved at bottom */
    reserveBottom: 40,
    /** Pixels for the table header row */
    reserveHeader: 44,
    /** Pixels for the footer text */
    reserveFooter: 30,
    /** Approximate height of each table row in pixels */
    rowHeight: 96,
    /** Minimum number of teams to always show */
    minTeams: 4,
  },

  // ── Text sizes (Tailwind arbitrary values) ─────────────────
  text: {
    /** Series title (mobile / desktop) */
    titleMobile: 'text-[3.4rem]',
    titleDesktop: 'md:text-[6rem]',
    /** Team names in match card */
    teamNameMobile: 'text-[1.875rem]',
    teamNameDesktop: 'lg:text-[2.625rem]',
    /** Score display */
    scoreMobile: 'text-[3.375rem]',
    scoreDesktop: 'md:text-[3.75rem]',
    /** Date text */
    date: 'text-[1.5rem]',
    /** Time text */
    time: 'text-[1.875rem]',
    /** Rangschikking header */
    tableHeader: 'text-3xl',
    /** Rangschikking row — position / wins / points */
    tableRowNumber: 'text-3xl',
    /** Rangschikking row — team name */
    tableRowName: 'text-3xl',
    /** Rangschikking footer */
    tableFooter: 'text-xl',
  },
} as const;

export default theme;
