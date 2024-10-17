import { ThemeToggle } from "@/app/(client)/_components/ui/theme-toggle";

const Page = () => {
  return (
    <div className="container py-6 px-2 md:px-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid w-full items-center gap-5 my-4">
        <div className="flex items-center space-x-4">
          <p>Current Theme</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Page;
