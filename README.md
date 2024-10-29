## Dashboards

[Pinecode Vector DB](https://app.pinecone.io/)
[Postgres DB](https://console.neon.tech)
[OpenAI Console](https://platform.openai.com/usage)

## Getting Started

1. Install the dependencies

```
npm i
```

2. Create `.env` file using `.env.example` file as reference

3. Run `npx prisma migrate dev` to sync database and application

4. Run the development server:

```
npm run dev
```

5. Run Prisma Studio to view DB entries in browser

```
npm run db
```

Open http://localhost:3000 with your browser to see the result.

## Database migrations

```bash
# After Modifing the Prisma schema, to push changes to DB run
npx prisma migrate dev --name "migration-name"

# Add --create-only flag to only create sql migration file and not apply it.
```

## Todo:

- Add upload size limit defaults to 1MB.
- Add number of file uploads defaults to 1.
- Add number of queries executed defaults to 1.
- If query is done after limit exceeded, respond with chat message about langchain and mention limit exceeded.
