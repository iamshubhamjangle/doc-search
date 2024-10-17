import { MultiFileDropzoneUsage } from "@/app/(client)/_components/files/fileDropZone";
import FilesTable from "@/app/(client)/_components/files/filesTable";
import Header from "@/app/(client)/_components/home/header";

const Page = () => {
  return (
    <div className="max-h-[100vh] p-4 lg:p-6 ">
      <Header title="Files" description="Upload files for knowledge base" />
      <MultiFileDropzoneUsage />
      <FilesTable />
    </div>
  );
};

export default Page;
