# Hero Explore Scroll Indicator Position Adjustment

## Summary of Changes
1. **Moved Explore Scroll Indicator**:
   - Adjusted the absolute bottom positioning from `bottom-3 sm:bottom-5` down to `bottom-1.5 sm:bottom-2.5` (`z-30`).
   - Increased `.hero__inner` bottom padding to `calc(var(--gap) + 28px)` to ensure clear visual separation between the action buttons ("Enter Restaurant" / "Reserve a Table") and the "Explore" bounce indicator across all viewports.
