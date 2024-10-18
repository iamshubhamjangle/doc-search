import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(client)/_components/ui/select";
import { serverAuth } from "@/app/_lib/serverAuth";
import prisma from "@/app/_lib/db";

const FileSelection = async () => {
  const session = await serverAuth();

  const files = await prisma.file.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      id: true,
      originalName: true,
    },
  });

  return (
    <Select>
      <SelectTrigger className="w-[300px] border-2 border-primary">
        <SelectValue placeholder="Select your file" />
      </SelectTrigger>
      <SelectContent>
        {files.map((file) => (
          <SelectItem key={file.id} value={file.id}>
            {file.originalName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FileSelection;
