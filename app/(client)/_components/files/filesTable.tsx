import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/app/(client)/_components/ui/badge";
import { Button } from "@/app/(client)/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/(client)/_components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/(client)/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(client)/_components/ui/table";
import { serverAuth } from "@/app/_lib/serverAuth";
import prisma from "@/app/_lib/db";
import { formatFileSize } from "@/app/_lib/utils";

const FilesTable = async () => {
  const session = await serverAuth();

  const files = await prisma.file.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      id: true,
      originalName: true,
      status: true,
      createdAt: true,
      processingError: true,
      fileSize: true,
    },
  });

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Your Files</CardTitle>
        <CardDescription>Manage your files.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Size</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              return (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    {file.originalName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatFileSize(file.fileSize)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {file.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {/* Showing <strong>1-10</strong> of <strong>32</strong> products */}
          Showing <strong>{files.length}</strong> of{" "}
          <strong>{files.length}</strong> files
        </div>
      </CardFooter>
    </Card>
  );
};

export default FilesTable;
