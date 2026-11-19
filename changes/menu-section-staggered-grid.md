# Pearl Oasis — Menu Section Redesign
## Staggered Grid of Menu Cards Implementation Note

### Overview
The **Menu** section (`src/components/MenuSection.jsx`) of Pearl Oasis was redesigned from a simple text list/compact banner into an elegant, editorial **staggered grid of menu cards**. The new composition balances visual prominence with culinary refinement, showcasing large photography, authentic dish descriptions, responsive layouts, smooth hover lifts, and category filtering while retaining the existing "View Full Menu" modal and tray ordering capability.

---

### Key Requirements Implemented

1. **Staggered Grid Layout**:
   - **Desktop (>=1024px)**: 4 cards per row (`lg:grid-cols-4`). Alternating vertical positions (`(index % 4) % 2 === 1 ? 'lg:translate-y-8' : 'lg:translate-y-0'`) create a balanced, organic staggered rhythm.
   - **Tablet (640px–1023px)**: 2 cards per row (`sm:grid-cols-2`), aligned cleanly without awkward jumps.
   - **Mobile (<640px)**: 1 card per row (`grid-cols-1`) ensuring full-width clarity and ease of scrolling.
   - **Overflow Protection**: The container has generous padding (`pb-16 lg:pb-24`) to give the downward-shifted cards ample breathing room without triggering horizontal or vertical clipping.

2. **Refined Menu Cards**:
   - **Prominent Food Photography**: High-resolution dish photos displayed in a `16/11` aspect ratio with subtle gradient overlays blending into the card body.
   - **Dish Details**: Cormorant Garamond serif headings, existing dish descriptions, portion indicators, and spice notes.
   - **Price Display**: Seamless integration for prices if available on dishes.
   - **Floating Badges**: Category and portion tags positioned for fast scanning.

3. **Smooth Micro-Interactions**:
   - **Hover Lift**: Cards gently lift on hover (`motion-safe:hover:-translate-y-2`) accompanied by an enhanced gold ambient shadow (`hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(201,164,92,0.18)]`).
   - **Image Zoom**: Food photography expands subtly (`motion-safe:group-hover:scale-108`) with 700ms ease-out transitions.
   - **Accessibility & Motion Preference**: All hover transformations are constrained with `motion-safe:` and respect `@media (prefers-reduced-motion: reduce)`.
   - **Touch Screen Friendly**: All content, tags, and action buttons are permanently visible on touch viewports without requiring hover.

4. **Streamlined Showcase (In-Page Tabs & Search Removed)**:
   - Category filter tabs and search bar were removed from the in-page section container to create a clean, uncluttered showcase.
   - The section presents only the premier first row of 4 signature dishes in the staggered layout.
   - Category filtering and search remain fully functional within the **View Full Menu** interactive modal.

5. **Preserved Functionality**:
   - **View Full Menu Button**: Centered champagne gold CTA at the base of the staggered grid that opens the comprehensive full dining catalogue modal with all categories and search.
   - **Order Tray Integration**: Quick "Add" button on each card updates the global order tray drawer with real-time feedback.
