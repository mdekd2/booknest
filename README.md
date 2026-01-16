# BookNest

BookNest is a full-stack online bookstore built with Next.js 14, Prisma, NextAuth, and Stripe Checkout.

## How to run (step-by-step)

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Approve Prisma build scripts (pnpm v10+ security feature)
   ```bash
   pnpm approve-builds
   ```
   Select `prisma` and `@prisma/engines` when prompted.
3. Create your environment file
   ```bash
   copy .env.example .env
   ```
4. Run Prisma migrations
   ```bash
   pnpm prisma migrate dev
   ```
5. Seed the database
   ```bash
   pnpm seed
   ```
6. Start the dev server
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Seeded credentials
- Admin: `admin@booknest.test` / `admin123`
- User: `user@booknest.test` / `user123`

## Checklist

**Implemented (MVP)**
- Storefront: home, book list with search/filter/sort, book details, cart
- Stripe Checkout flow with success page order creation
- Auth: sign up, log in, log out with role-aware session
- Orders history page for users
- Admin dashboard with CRUD for books and categories
- Prisma schema, migration SQL, and seed data (12+ books)
- Tailwind UI with loading states and error messaging

**Nice to have**
- Stripe webhook configured (route included, needs `STRIPE_WEBHOOK_SECRET`)
- Inventory alerts and admin analytics
- Shipping/tax calculation support

## Notes
- Cart is stored in browser localStorage for MVP.
- Images are served locally from `/public/images/books`.
