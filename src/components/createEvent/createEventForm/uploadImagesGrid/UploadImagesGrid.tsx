import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const UploadImagesGrid = ({ onFilesChange }) => {
  const [files, setFiles] = useState<{ id: number; file: File | null }[]>([
    { id: 0, file: null },
    { id: 1, file: null },
    { id: 2, file: null },
    { id: 3, file: null },
  ]);

  const handleGetImage = (file: File | null, id: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.id === id ? { ...prevFile, file } : prevFile,
      ),
    );
  };
  useEffect(() => {
    if (files?.some((item) => item.file instanceof File)) {
      onFilesChange(
        files.filter((item) => item.file instanceof File).map((i) => i.file),
      );
    }
  }, [files]);
  return (
    <Grid gridTemplateColumns={"repeat(4, 1fr)"} h={"90px"} gap={2}>
      {files.map((fileObj) => (
        <CustomDropzone
          key={fileObj.id}
          getImage={(file: File | null) => handleGetImage(file, fileObj.id)}
          type={"responsive"}
          setIsLoading={() => {}}
          isLoading={false}
        />
      ))}
    </Grid>
  );
};
