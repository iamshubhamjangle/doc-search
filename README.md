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

## Setting up AWS SES (Simple Email Service)

- This service is used when user clicks on forgot password, following are the steps to enable AWS SES with you AWS account
- Create a new IAM user with SES Full Access Policy. Create it's access key, secret
- Create a SES identity with your email address
- `npm i @aws-sdk/client-ses aws-crt`
- Add environment variables as mentioned in getting started

## Form Error Handling References

- API side: https://github.com/iamshubhamjangle/todo-list-next-app/blob/master/app/(server)/(actions)/todo.ts
- Client side: https://github.com/iamshubhamjangle/next-auth-app-shadcn-prisma/blob/master/app/(client)/settings/settings.tsx

## Route Protection

### Client Side

This can be done using middleware.js (Preffered)

```js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile"],
};
```

Or else we can use `useSession()` as shown below

```js
const { data: session }: any = useSession({ required: true });
// { required: true } redirects user back to signin page onUnauthenticated
```

### Server Side

This can be done using middleware.js (Preffered)

```js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/settings"],
};
```

Or else we can use `serverAuth()` as shown below

```jsx
import { serverAuth } from "@/app/_lib/serverAuth";

const Protected = async () => {
  const session = await serverAuth();

  if (!session) {
    const headersList = headers();
    const currentPathName = headersList.get("x-invoke-path") || "";
    currentPathName
      ? redirect("/login?callbackUrl=" + currentPathName)
      : redirect("/login");
  }

  return <>Hello World!</>;
};

export default Protected;
```

## Server Actions

Server actions are enabled with this project, though we are not using them.

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

To know how to use server actions, check out this todo list project:

- `createTodoSamePage()` Function Definition here https://github.com/iamshubhamjangle/todo-list-next-app/blob/master/app/(server)/(actions)/todo.ts
- `createTodoSamePage()` Function Consumed here https://github.com/iamshubhamjangle/todo-list-next-app/blob/da9470c2e34badaa602f1e0092159964470df642/app/(client)/_components/createTodoForm.tsx
- Learn more here https://nextjs.org/docs/app/api-reference/functions/server-actions
