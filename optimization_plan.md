# Optimization Implementation Plan

This document tracks the progress of the optimization and restructuring of the E-commerce project.

## Phase 0: Clean Code Restructuring
- [x] Create `banner.service.ts` and migrate logic from `banner.controller.ts`
- [x] Create `coupon.service.ts` and migrate logic from `coupon.controller.ts`
- [x] Create `category.service.ts` and migrate logic from `category.controller.ts`
- [x] Create `brand.service.ts` and migrate logic from `brand.controller.ts`
- [x] Modularize large frontend components (Navbar, ProfilePage, ProductDetailPage, CheckoutPage)
- [x] Create `CartDrawerItem`, `CartDrawerFooter` sub-components
- [x] Create `AddressCard`, `WishlistCard`, `OrderItem` profile sub-components
- [x] Consistent `formatCurrency` utility across all price display components
- [ ] Extract validations into `server/src/validations` using Zod (partially done)

## Phase 1: Full Project Audit
- [x] Scan for unused files, folders, and components
- [x] Remove unused imports and variables (console.error calls)
- [x] Remove duplicate default exports (OrdersTab, WishlistTab, AddressesTab, ProductCard)
- [ ] Verify all routes are still functional end-to-end

## Phase 2: Dependency Cleanup
- [ ] Audit `package.json` in both client and server
- [ ] Remove unused dependencies (`csurf`, `express-validator` on server if unused)
- [ ] Ensure devDependencies are correctly categorized

## Phase 3: API Optimization
- [ ] Implement pagination in all list endpoints
- [ ] Use selective field fetching in Prisma queries
- [ ] Combine redundant API calls
- [ ] Standardize API response format

## Phase 4: Frontend Performance
- [x] Implement `React.lazy` and `Suspense` for code splitting (all 21 pages/layouts)
- [x] Remove console.error/log in production frontend (`HomePage`, `ShopPage`, `ProfilePage`, `CheckoutPage`, `ProductDetailPage`, `OrderSuccessPage`, `Navbar`)
- [ ] Optimize images with lazy loading (`loading="lazy"` on `<img>` tags)
- [ ] Implement memoization (`useMemo`, `useCallback`, `React.memo`) where needed

## Phase 5: SEO Optimization
- [ ] Add dynamic meta tags and titles
- [ ] Implement canonical URLs
- [ ] Add `robots.txt` and optimize sitemap
- [ ] Check and fix heading hierarchy

## Phase 6: Security & Production Hardening
- [x] Rate limiting on all `/api` routes (already implemented via `express-rate-limit`)
- [x] `helmet` and `cors` already in place
- [x] `compression` middleware already in place
- [ ] Remove stale `csurf` dependency (deprecated — not used)
- [ ] Ensure secure environment variable handling

## Phase 7: Build Optimization
- [x] Vite code splitting via `React.lazy` / dynamic imports
- [ ] Minimize asset sizes

## Phase 8: Debug & Stability
- [x] Fix duplicate default exports across profile & cart components
- [x] Fix lint error in `ProductDetailPage.tsx` (void return type mismatch)
- [x] Fix Prisma field mismatches in `banner.service.ts`, `coupon.service.ts`, `brand.service.ts`, `category.service.ts`
- [x] Remove debug logger from `server/src/app.ts`
- [ ] Audit for memory leaks or infinite loops
- [ ] Clean up remaining console warnings
