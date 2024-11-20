"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/app/(client)/_components/ui/card";
import { Label } from "@/app/(client)/_components/ui/label";
import { Input } from "@/app/(client)/_components/ui/input";
import { Button } from "@/app/(client)/_components/ui/button";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FileUploadResponse {
  success: boolean;
  name: string;
  pageCount: number;
  fileSize?: number;
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      console.log("Selected file:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: FileUploadResponse = await response.json();
        if (data.success) {
          toast.success(
            `File processed successfully. Found ${data.pageCount} pages.`
          );
          router.refresh();
        }
      } else {
        const parsedResponse = await response.json();
        toast.error(`Upload failed! ${parsedResponse?.message}`);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error uploading the file. Please contact support.");
    } finally {
      setIsLoading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input field
      }
    }
  };

  return (
    <Card className="my-4">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            placeholder="File"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <p className="text-muted-foreground">
            Maximum file size is 1MB. Supported file type: PDF
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          loading={isLoading}
          size="lg"
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
