"use client";

import React from "react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/app/(client)/_components/ui/dropdown-menu";

interface FilesTableDropdownMenuItemsProps {
  fileId: string;
}

const FilesTableDropdownMenuItems: React.FC<
  FilesTableDropdownMenuItemsProps
> = ({ fileId }) => {
  const handleDelete = () => {
    // fileId
  };

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default FilesTableDropdownMenuItems;
