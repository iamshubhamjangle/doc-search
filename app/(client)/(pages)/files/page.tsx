import FilesTable from "@/app/(client)/_components/files/filesTable";
import Header from "@/app/(client)/_components/home/header";
import { FileUpload } from "@/app/(client)/_components/files/file-upload";
import MainContentWrapper from "@/app/(client)/_components/home/MainContentWrapper";

const Page = () => {
  return (
    <MainContentWrapper>
      <Header title="Files" description="Upload files for knowledge base" />
      <FileUpload />
      <FilesTable />
    </MainContentWrapper>
  );
};

export default Page;
