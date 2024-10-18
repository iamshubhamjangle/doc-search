import FilesTable from "@/app/(client)/_components/files/filesTable";
import Header from "@/app/(client)/_components/home/header";
import { FileUpload } from "@/app/(client)/_components/component/file-upload";

const Page = () => {
  return (
    <div className="max-h-[100vh] p-4 lg:p-6 ">
      <Header title="Files" description="Upload files for knowledge base" />
      <FileUpload />
      <FilesTable />
    </div>
  );
};

export default Page;
