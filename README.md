## Dashboards

[Pinecode Vector DB](https://app.pinecone.io/)
[Postgres DB](https://console.neon.tech)
[OpenAI Console](https://platform.openai.com/usage)

## Getting Started

Step 1. Install the dependencies

```
npm i
```

Step 2. Rename the `.env.example` file to `.env` and set all the values. Make sure the provided database name in .env exist.

Step 3: Apply the database schema & migrations

```
npx prisma migrate dev
```

Step 4: Run the development server

```bash
npm run dev
# Open http://localhost:3000 with your browser to see the result
```

Step 5: Run Prisma Studio to View DB in browser (Optional Step)

```bash
npm run db
# Open http://localhost:5555 with your browser to see the result
```

## After Create/Modifing the Prisma schema

During Development you may need to modify the prisma schema as per your project requirements. i.e. Add/Remove tables, columns, etc operation on database.
Once the prisma.schema file is update you should execute the following to apply the changes in your database.

```bash
npx prisma migrate dev --name "migration-name" # This will create the migration .sql and apply it on database.
npx prisma migrate dev --name "migration-name" --create-only # If you just want to create the migartion .sql file
```

## Todo:

- If there error during file processing, file status must be updated to "error"
- Convert all NextResponse to return NextResponse.json();
