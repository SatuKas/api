# Prisma Cheatsheet 📚

## What is Prisma?

Prisma is a **Next-generation ORM** (Object-Relational Mapping) for Node.js and TypeScript. Prisma makes it easy to:

- **Manage databases** with type-safe queries
- **Generate Prisma Client** automatically based on schema
- **Database migrations** that are safe and structured
- **Database introspection** to see existing database structure
- **Visual database browser** with Prisma Studio

### Prisma Advantages:

- ✅ **Type Safety** - Auto-completion and error checking at compile time
- ✅ **Developer Experience** - Intuitive query builder
- ✅ **Database Agnostic** - Support PostgreSQL, MySQL, SQLite, MongoDB, etc
- ✅ **Migration System** - Version control for database schema
- ✅ **Performance** - Query optimization and connection pooling

---

## Setup & Configuration

### 1. Install Prisma

```bash
# Install Prisma CLI
npm install -D prisma

# Install Prisma Client
npm install @prisma/client
```

### 2. Initialize Prisma

```bash
# Initialize Prisma in new project
npx prisma init

# Or if schema already exists
npx prisma generate
```

### 3. Environment Variables

Make sure you have `DATABASE_URL` in `.env`:

```env
# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# MySQL
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# SQLite
DATABASE_URL="file:./dev.db"
```

---

## Schema Change Workflow

### 🔄 Complete Schema Change Process

#### Step 1: Plan Your Changes

```bash
# 1. Check current migration status
npx prisma migrate status

# 2. Validate current schema
npx prisma validate
```

#### Step 2: Make Schema Changes

Edit `prisma/schema.prisma` file:

```prisma
// Example: Adding a new field
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  username  String   @unique
  // NEW FIELD
  phone     String?  // Optional field
  // ... other fields
}
```

#### Step 3: Create Migration

```bash
# Create migration with descriptive name
npx prisma migrate dev --name add_phone_to_user

# This will:
# 1. Create migration file in prisma/migrations/
# 2. Apply changes to database
# 3. Generate new Prisma Client
```

#### Step 4: Verify Changes

```bash
# Check migration was created successfully
npx prisma migrate status

# Open Prisma Studio to verify data
npx prisma studio

# Test your changes in code
npx prisma generate
```

#### Step 5: Deploy to Production

```bash
# Deploy migrations to production
npx prisma migrate deploy

# Verify production deployment
npx prisma migrate status
```

### 🚨 Handling Migration Conflicts

#### When Team Members Have Different Migrations:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Check migration status
npx prisma migrate status

# 3. If conflicts exist, reset and reapply
npx prisma migrate reset

# 4. Apply all migrations from scratch
npx prisma migrate dev
```

#### When Migration Fails:

```bash
# 1. Check what went wrong
npx prisma migrate status

# 2. If migration is partially applied, mark as resolved
npx prisma migrate resolve --applied 20240101120000_migration_name

# 3. Or reset and start over
npx prisma migrate reset
```

### 🔄 Rollback Strategy

#### Rollback in Development:

```bash
# Reset to previous state
npx prisma migrate reset

# Or manually edit migration files and reset
```

#### Rollback in Production:

```bash
# 1. Create rollback migration
npx prisma migrate dev --name rollback_changes

# 2. Deploy rollback
npx prisma migrate deploy
```

---

## Essential Prisma Commands

### 🗄️ Database Management

#### `npx prisma db push`

```bash
# Push schema changes to database without migration
npx prisma db push
```

**When to use:** Development, prototyping, or schema changes not ready for production.

#### `npx prisma migrate dev`

```bash
# Create migration and apply to database
npx prisma migrate dev --name add_user_table

# Reset database and apply all migrations
npx prisma migrate reset
```

**When to use:** Production-ready changes, team collaboration, or permanent schema changes.

#### `npx prisma migrate deploy`

```bash
# Apply migrations in production
npx prisma migrate deploy
```

**When to use:** Deploy to production environment.

#### `npx prisma migrate status`

```bash
# Check migration status
npx prisma migrate status
```

### 🔧 Schema & Client

#### `npx prisma generate`

```bash
# Generate Prisma Client based on schema
npx prisma generate
```

**When to use:** After schema changes, before build, or after pulling from git.

#### `npx prisma validate`

```bash
# Validate schema syntax
npx prisma validate
```

#### `npx prisma format`

```bash
# Format schema file
npx prisma format
```

### 🔍 Database Introspection

#### `npx prisma db pull`

```bash
# Introspect database and generate schema
npx prisma db pull
```

**When to use:** When database already exists and you want to generate schema from it.

#### `npx prisma db seed`

```bash
# Run seed script
npx prisma db seed
```

### 🎨 Prisma Studio

#### `npx prisma studio`

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio
```

**When to use:** Development, debugging, or manual data management.

---

## Schema Structure (SatuKas Project)

### Main Models:

#### 1. **User** - User Management

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  username  String   @unique
  devices   Device[]
  books     Book[]
  // ... other fields
}
```

#### 2. **Book** - Financial Book Management

```prisma
model Book {
  id          String   @id @default(uuid())
  name        String
  description String?
  ownerId     String   @map("owner_id")
  owner       User     @relation(fields: [ownerId], references: [id])
  members     BookMember[]
  accounts    Account[]
  journals    Journal[]
  // ... other fields
}
```

#### 3. **Account** - Chart of Accounts

```prisma
model Account {
  id          String   @id @default(uuid())
  bookId      String   @map("book_id")
  name        String
  code        String
  category    AccountCategory @default(ASSET)
  type        AccountType @default(CRAS)
  // ... other fields
}
```

#### 4. **Journal** - Double Entry Bookkeeping

```prisma
model Journal {
  id          String   @id @default(uuid())
  bookId      String   @map("book_id")
  date        DateTime
  description String?
  entries     JournalEntry[]
  totalAmount Decimal @map("total_amount")
  // ... other fields
}
```

---

## Query Examples

### Basic CRUD Operations

#### Create

```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    username: 'johndoe',
    password: 'hashedpassword',
  },
});

// Create book
const book = await prisma.book.create({
  data: {
    name: 'Personal Finance',
    description: 'My personal finance book',
    ownerId: user.id,
  },
});
```

#### Read

```typescript
// Find unique user
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});

// Find many with relations
const books = await prisma.book.findMany({
  where: { ownerId: user.id },
  include: {
    members: true,
    accounts: true,
  },
});

// Complex query with filters
const accounts = await prisma.account.findMany({
  where: {
    bookId: bookId,
    category: 'ASSET',
    isGroup: false,
  },
  orderBy: { code: 'asc' },
});
```

#### Update

```typescript
// Update user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' },
});

// Update many
await prisma.account.updateMany({
  where: { bookId: bookId },
  data: { currency: 'USD' },
});
```

#### Delete

```typescript
// Delete user
await prisma.user.delete({
  where: { id: userId },
});

// Delete many
await prisma.device.deleteMany({
  where: { isRevoked: true },
});
```

### Advanced Queries

#### Transactions

```typescript
// Multiple operations in one transaction
const result = await prisma.$transaction(async (tx) => {
  const journal = await tx.journal.create({
    data: {
      bookId: bookId,
      date: new Date(),
      description: 'Transaction',
      totalAmount: 1000,
    },
  });

  const entries = await tx.journalEntry.createMany({
    data: [
      {
        journalId: journal.id,
        accountId: debitAccountId,
        debit: 1000,
        position: 1,
      },
      {
        journalId: journal.id,
        accountId: creditAccountId,
        credit: 1000,
        position: 2,
      },
    ],
  });

  return { journal, entries };
});
```

#### Aggregations

```typescript
// Sum total amount
const total = await prisma.journal.aggregate({
  where: { bookId: bookId },
  _sum: { totalAmount: true },
});

// Count records
const count = await prisma.user.count({
  where: { isVerified: true },
});
```

#### Raw Queries

```typescript
// Raw SQL query
const result = await prisma.$queryRaw`
  SELECT a.name, SUM(je.debit) as total_debit
  FROM account a
  JOIN journal_entry je ON a.id = je.account_id
  WHERE a.book_id = ${bookId}
  GROUP BY a.id, a.name
`;
```

---

## Best Practices

### 1. **Schema Design**

- Use `@map()` for consistent naming conventions
- Add `@@index()` for fields that are frequently queried
- Use `@unique()` for fields that must be unique
- Choose appropriate data types (String vs Int vs Decimal)

### 2. **Performance**

- Use `select` for only needed fields
- Implement pagination with `skip` and `take`
- Use `include` carefully (avoid N+1 problem)
- Consider using `findFirst` instead of `findMany` if you only need one record

### 3. **Error Handling**

```typescript
try {
  const user = await prisma.user.create({
    data: userData,
  });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    throw new Error('Email already exists');
  }
  throw error;
}
```

### 4. **Type Safety**

```typescript
// Import types
import { User, Book, Prisma } from '@prisma/client';

// Use Prisma types
type UserWithBooks = Prisma.UserGetPayload<{
  include: { books: true };
}>;
```

### 5. **Migration Best Practices**

- Always backup database before major migrations
- Test migrations on staging environment first
- Use descriptive migration names
- Keep migrations small and focused
- Never edit migration files after they've been applied to production

---

## Troubleshooting

### Common Issues:

#### 1. **"Prisma Client not generated"**

```bash
npx prisma generate
```

#### 2. **"Database connection failed"**

- Check `DATABASE_URL` in `.env`
- Ensure database server is running
- Verify credentials

#### 3. **"Migration failed"**

```bash
# Reset and reapply
npx prisma migrate reset
npx prisma migrate dev
```

#### 4. **"Schema out of sync"**

```bash
# Pull schema from database
npx prisma db pull
npx prisma generate
```

#### 5. **"Migration conflicts"**

```bash
# Reset and start fresh
npx prisma migrate reset
npx prisma migrate dev
```

---

## Useful Resources

- 📖 [Prisma Documentation](https://www.prisma.io/docs/)
- 🎯 [Prisma Examples](https://github.com/prisma/prisma-examples)
- 💡 [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- 🛠️ [Prisma Studio](https://www.prisma.io/studio)
- 🐛 [Prisma GitHub Issues](https://github.com/prisma/prisma/issues)

---

## Quick Reference

| Command                     | Description                   |
| --------------------------- | ----------------------------- |
| `npx prisma init`           | Initialize Prisma             |
| `npx prisma generate`       | Generate client               |
| `npx prisma db push`        | Push schema changes           |
| `npx prisma migrate dev`    | Create & apply migration      |
| `npx prisma migrate deploy` | Apply migrations (production) |
| `npx prisma db pull`        | Introspect database           |
| `npx prisma studio`         | Open Prisma Studio            |
| `npx prisma validate`       | Validate schema               |
| `npx prisma format`         | Format schema file            |

---

_Last updated: $(date)_
_Project: SatuKas API_
