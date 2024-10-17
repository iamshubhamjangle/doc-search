import { prisma } from "@/app/(server)/_lib/prisma";
import { auth } from "@/app/(server)/_lib/auth";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  console.log("req.auth", req.auth);

  try {
    const { name, url, size } = await req.json(); // Data from request body

    // Save file in the database
    const file = await prisma.file.create({
      data: {
        name,
        url,
        size,
        user: {
          connect: { id: req.auth.user?.id },
        },
      },
    });

    return Response.json({ message: "File uploaded successfully", file });
  } catch (error) {
    return Response.json(
      { error: "Failed to upload file", details: error },
      { status: 500 }
    );
  }
});
