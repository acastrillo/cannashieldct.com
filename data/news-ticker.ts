// Top cannabis-industry cybersecurity headlines for the news ticker.
// Updated weekly via .github/workflows/update-ticker.yml — edit this file to change what scrolls.
// Format: short label — brief impact ·  (trailing space+dot keeps spacing between dupes)
export const tickerHeadlines: string[] =
  [
    'STIIIZY — 420,000 records leaked',
    'MariMed — $650K wired to attackers',
    'Trulieve — customer data on dark web',
    'MJ Freeway — 14-state outage',
    'Aurora Cannabis — breach disclosed to regulators',
    'Ontario Cannabis Store — customer data leaked',
  ]

// Rendered as a single space-separated marquee string with · separators
export const tickerString = tickerHeadlines.join('  ·  ') + '  ·'
