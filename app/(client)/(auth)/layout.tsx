import { Metadata } from "next";
import Link from "next/link";
import { LogoIcon } from "@/app/(client)/_components/Icons/logoIcon";

export const metadata: Metadata = {
  title: "Ripple/Auth",
  description: "A new world of Rippling!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-full w-full grid place-items-center">
        <div className="flex h-full w-full">
          <div className="hidden lg:flex flex-col justify-between w-1/2">
            <div className="flex flex-col h-full p-10 justify-between bg-zinc-900 bg-[url('/background.jpg')] bg-cover bg-center">
              <Link href="/">
                <div className="flex items-center">
                  <LogoIcon className="h-8 w-8 mr-2" />
                  <span className="text-white font-black">DocSearch</span>
                </div>
              </Link>
              <blockquote className="text-white font-semibold">
                &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quam, neque nesciunt molestias hic amet pariatur ab eius rerum
                eveniet placeat at rem commodi nemo.&rdquo;
              </blockquote>
            </div>
          </div>
          <div className="p-8 border flex w-full lg:w-1/2">
            <div className="mx-auto max-w-md flex flex-col justify-center space-y-6">
              {children}
              <p className="px-8 text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
