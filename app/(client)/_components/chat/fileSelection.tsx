"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(client)/_components/ui/select";

import useFileStore from "@/app/(client)/_store/fileStore";

interface FileSelectionProps {
  files: any[];
}

const FileSelection: React.FC<FileSelectionProps> = ({ files }) => {
  const setFileIds = useFileStore((state) => state.setFileIds);

  const handleFileChange = (value: string) => {
    setFileIds([value]);
  };

  return (
    <Select onValueChange={handleFileChange}>
      <SelectTrigger className="w-[300px] border-2 border-primary">
        <SelectValue
          placeholder={
            files.length == 0 ? "Please upload some files" : "Select your file"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {files.length > 0 ? (
          files.map((file) => (
            <SelectItem key={file.id} value={file.id}>
              <span className="block w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
                {file.originalName}
              </span>
            </SelectItem>
          ))
        ) : (
          <SelectItem key={"-1"} value={""} disabled>
            <span className="block w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
              No files found
            </span>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default FileSelection;
