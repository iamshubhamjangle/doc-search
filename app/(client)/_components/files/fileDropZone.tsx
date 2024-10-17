"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/app/(client)/_components/ui/multiFileDropzone";
import { useEdgeStore } from "@/app/_lib/edgestore";
import { useState } from "react";
import toast from "react-hot-toast";

export function MultiFileDropzoneUsage() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const saveFileDetails = async (name: string, url: string, size: number) => {
    try {
      // TODO: await postData("/api/files", { name, url, size });
      toast.success("File upload completed.");
    } catch (error) {
      console.error("error", error);
      toast.error("Failed storing file details. Please contact us.");
    }
  };

  return (
    <div>
      <MultiFileDropzone
        className="h-48 my-4"
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                await saveFileDetails(
                  addedFileState.file.name,
                  res.url,
                  res.size
                );
              } catch (err) {
                console.error(err);
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />
    </div>
  );
}
