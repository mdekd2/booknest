const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const defaultImage = "/images/books/placeholder.svg";

const categories = [
  { name: "Fiction", slug: "fiction" },
  { name: "Non-fiction", slug: "non-fiction" },
  { name: "Science", slug: "science" },
  { name: "Business", slug: "business" },
];

const books = [
  {
    title: "The Silent River",
    slug: "the-silent-river",
    author: "Ava Bennett",
    description:
      "A lyrical mystery about a town that learns its river remembers everything.",
    priceCents: 1899,
    currency: "USD",
    stock: 14,
    imageUrl: defaultImage,
    categorySlug: "fiction",
  },
  {
    title: "Blueprints of Tomorrow",
    slug: "blueprints-of-tomorrow",
    author: "Miles Carter",
    description:
      "A practical guide to building resilient teams and sustainable products.",
    priceCents: 2599,
    currency: "USD",
    stock: 12,
    imageUrl: defaultImage,
    categorySlug: "business",
  },
  {
    title: "Starlight Equations",
    slug: "starlight-equations",
    author: "Rina Patel",
    description:
      "Explore cosmology through approachable math and vivid storytelling.",
    priceCents: 2399,
    currency: "USD",
    stock: 9,
    imageUrl: defaultImage,
    categorySlug: "science",
  },
  {
    title: "The Artisan Ledger",
    slug: "the-artisan-ledger",
    author: "Jonas Mire",
    description:
      "A sweeping family saga told through the journals of four generations.",
    priceCents: 2099,
    currency: "USD",
    stock: 10,
    imageUrl: defaultImage,
    categorySlug: "fiction",
  },
  {
    title: "Mindful Momentum",
    slug: "mindful-momentum",
    author: "Keisha Ortiz",
    description:
      "Gentle productivity practices for ambitious, overwhelmed humans.",
    priceCents: 1799,
    currency: "USD",
    stock: 18,
    imageUrl: defaultImage,
    categorySlug: "non-fiction",
  },
  {
    title: "Data Without Drama",
    slug: "data-without-drama",
    author: "Elliot Kim",
    description:
      "Learn analytics fundamentals with clear visuals and real case studies.",
    priceCents: 2699,
    currency: "USD",
    stock: 15,
    imageUrl: defaultImage,
    categorySlug: "business",
  },
  {
    title: "The Glass Orchard",
    slug: "the-glass-orchard",
    author: "Maeve Lin",
    description:
      "A haunting tale of memory, loss, and a garden that grows glass.",
    priceCents: 1999,
    currency: "USD",
    stock: 11,
    imageUrl: defaultImage,
    categorySlug: "fiction",
  },
  {
    title: "Signal and Noise",
    slug: "signal-and-noise",
    author: "Brandon Steele",
    description:
      "A grounded introduction to scientific thinking in everyday decisions.",
    priceCents: 2199,
    currency: "USD",
    stock: 13,
    imageUrl: defaultImage,
    categorySlug: "science",
  },
  {
    title: "The Honest Economy",
    slug: "the-honest-economy",
    author: "Lila Moreno",
    description:
      "Reimagining markets with transparency, equity, and long-term value.",
    priceCents: 2299,
    currency: "USD",
    stock: 16,
    imageUrl: defaultImage,
    categorySlug: "business",
  },
  {
    title: "Letters to the Wild",
    slug: "letters-to-the-wild",
    author: "Noah Hart",
    description:
      "Essays on solitude, nature, and the courage to start over.",
    priceCents: 1899,
    currency: "USD",
    stock: 20,
    imageUrl: defaultImage,
    categorySlug: "non-fiction",
  },
  {
    title: "Atlas of Small Wonders",
    slug: "atlas-of-small-wonders",
    author: "Priya Sen",
    description:
      "A pocket-sized guide to the everyday marvels hiding in plain sight.",
    priceCents: 1699,
    currency: "USD",
    stock: 22,
    imageUrl: defaultImage,
    categorySlug: "non-fiction",
  },
  {
    title: "Quantum Garden",
    slug: "quantum-garden",
    author: "Elias Novak",
    description:
      "A playful tour of quantum physics with analogies you will remember.",
    priceCents: 2499,
    currency: "USD",
    stock: 8,
    imageUrl: defaultImage,
    categorySlug: "science",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "admin@booknest.test" },
    update: {},
    create: {
      name: "BookNest Admin",
      email: "admin@booknest.test",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@booknest.test" },
    update: {},
    create: {
      name: "BookNest User",
      email: "user@booknest.test",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  for (const book of books) {
    const category = await prisma.category.findUnique({
      where: { slug: book.categorySlug },
    });
    if (!category) {
      continue;
    }

    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: {
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        priceCents: book.priceCents,
        currency: book.currency,
        stock: book.stock,
        imageUrl: book.imageUrl,
        categoryId: category.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
