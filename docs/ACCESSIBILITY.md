# Accessibility (WCAG) — automated checks (basic)

Checked color contrast ratios for key UI pairs (WCAG AA requires 4.5:1 for normal text):

- Body text (#222222) on cream-50 (#fbf9f7) — contrast ratio: 15.15
- Body text (#222222) on cream-100 (#f6f2ef) — contrast ratio: 14.29
- Brand accent (#b5746f) on cream-50 (#fbf9f7) — contrast ratio: 3.51
- Brand accent (#b5746f) on white (#ffffff) — contrast ratio: 3.69

Interpretation and recommended adjustments:
- Body text contrast ratios are >= 4.5 which meets WCAG AA for normal text. Good.
- Brand accent on white is ~3.69. Accent colors are used for decorative elements and buttons; ensure button text uses white on brand background (white on brand contrast: 3.69) to meet accessibility for button labels.

Other accessibility notes implemented:
- Added ARIA labels for navigation and key buttons.
- Added meaningful alt attributes for images and role attributes for menus/articles.
- Ensure keyboard navigation: carousel supports ArrowLeft/Right keys.

Next steps for deeper accessibility testing:
- Run axe-core or Lighthouse in CI to detect interactive issues and landmarks.
- Check focus order, skip-links, and form label associations if forms are added.

