import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(client)/_components/ui/select";

const FileSelection = () => {
  return (
    <Select>
      <SelectTrigger className="w-[300px] border-2 border-primary">
        <SelectValue placeholder="Select your file" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="file1">File1</SelectItem>
        <SelectItem value="file2">File2</SelectItem>
        <SelectItem value="file3">File3</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FileSelection;
