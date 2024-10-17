Using https://console.neon.tech/app/projects/wandering-sky-87653498

## Getting Started

Install the dependencies

```
npm i
```

Edit the `.env` file

```
# To generate 32 bit secret > openssl rand -base64 32 | paste --delimiters '' --serial
NODE_ENV="development"

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/DB_NAME
DIRECT_URL=postgres://postgres:postgres@localhost:5432/DB_NAME
# DATABASE_URL=postgres://username:password@host.render.com/DB_NAME
# DIRECT_URL=postgres://username:password@host.render.com/DB_NAME
# SHADOW_DATABASE_URL=...

# Next Auth
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Reset Password >
JWT_RESET_PASSWORD_SECRET="..."

# Email Services
# Base URL is Used while sending email for forgot-password template
BASE_URL="http://localhost:3000"
# AWS SES keys
AWS_SES_USER_ACCESS_KEY="..."
AWS_SES_USER_ACCESS_SECRET="..."
AWS_SES_REGION="us-east-2"
AWS_SES_SENDER="yourverifiedemail@gmail.com"
```

## After Create/Modifing the Prisma schema

```
npx prisma migrate dev --name migration-name --create-only
// Edit any migrations if required (Major changes/Conflicts)
npx prisma migrate dev
// Restart the prisma studio
```

Run the development server:

```
npm run dev
```

Run Prisma Studio to view DB entries in browser

```
npm run db
```

Open http://localhost:3000 with your browser to see the result.

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
