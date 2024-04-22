import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const UploadImagesGrid = ({
  onFilesChange,
  defaultValues,
  currentState,
}) => {
  const [files, setFiles] = useState<{ id: number; file: File | null }[]>([
    { id: 0, file: defaultValues?.[0] || null },
    { id: 1, file: defaultValues?.[1] || null },
    { id: 2, file: defaultValues?.[2] || null },
    { id: 3, file: defaultValues?.[3] || null },
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
      onFilesChange(files.map((i, idx) => ({ index: idx, source: i.file })));
    }
  }, [files]);

  useEffect(() => {
    if (!currentState?.length && !!defaultValues?.length) {
      onFilesChange(files.map((i, idx) => ({ index: idx, source: i.file })));
    }
  }, [currentState]);

  return (
    <Grid gridTemplateColumns={"repeat(4, 1fr)"} h={"90px"} gap={2}>
      {files.map((fileObj) => (
        <CustomDropzone
          key={fileObj.id}
          getImage={(file: File | null) => handleGetImage(file, fileObj.id)}
          type={"responsive"}
          setIsLoading={() => {}}
          isLoading={false}
          currentImage={
            (typeof fileObj.file === "string" && fileObj.file) || null
          }
        />
      ))}
    </Grid>
  );
};
