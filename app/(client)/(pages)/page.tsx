import { serverAuth } from "@/app/_lib/serverAuth";

export default async function Home() {
  const session = await serverAuth();

  return (
    <main className="flex flex-col gap-4">
      <pre className="overflow-auto">
        {JSON.stringify(session || "You are not logged in", null, 2)}
      </pre>
    </main>
  );
}
