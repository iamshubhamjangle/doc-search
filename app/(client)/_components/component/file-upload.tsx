"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/app/(client)/_components/ui/card";
import { Label } from "@/app/(client)/_components/ui/label";
import { Input } from "@/app/(client)/_components/ui/input";
import { Button } from "@/app/(client)/_components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

interface FileUploadResponse {
  success: boolean;
  name: string;
  pageCount: number;
  fileSize?: number;
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      const data: FileUploadResponse = await response.json();

      if (response.ok && data.success) {
        toast.success(
          `File processed successfully. Found ${data.pageCount} pages.`
        );
        console.log("Upload response:", data);
      } else {
        const errorText = await response.text();
        toast.error(`Upload failed: ${errorText}`);
        console.error("Upload failed:", errorText);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading the file. Please try again.");
    } finally {
      setIsLoading(false);
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
            id="file"
            type="file"
            placeholder="File"
            accept="application/pdf"
            onChange={handleFileChange}
          />
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
