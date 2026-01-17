# BookNest

BookNest is a full-stack online bookstore built with Next.js 14, Firebase Auth, and Firestore.

## How to run (step-by-step)

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Create your environment file
   ```bash
   copy .env.example .env
   ```
3. Start the dev server
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Default admin
- Admin: `admin@admin.com` / `Admin123`

## Checklist

**Implemented (MVP)**
- Storefront: home, book list with search/filter/sort, book details, cart
- Manual payment flow (Bankily / Sedad / Masrivi)
- Auth: sign up, log in, log out via Firebase Auth
- Orders history page for users
- Admin dashboard with CRUD for books and categories
- Firestore collections for books, categories, orders, users
- Tailwind UI with loading states and error messaging

**Nice to have**
- Stripe webhook route included (optional)
- Inventory alerts and admin analytics
- Shipping/tax calculation support

## Notes
- Cart is stored in browser localStorage for MVP.
- Images are served locally from `/public/images/books`.
