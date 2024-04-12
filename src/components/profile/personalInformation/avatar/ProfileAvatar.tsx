import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Pencil } from "lucide-react";
import { useSnackbar } from "notistack";

const apiUrl = process.env.NEXT_PUBLIC_DATA_URL;
const uploadAvatarUrl = `${apiUrl}`;
export const ProfileAvatar = ({ mutate, register }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const avatarEditorRef = useRef<any>(null);
  const [chosenImage, setChosenImage] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const changeAvatarReq = async (formData: any) => {
    // const headers = {
    //   "Content-Type": "multipart/form-data",
    // };
  };

  const submitImageHandler = () => {
    const canvasImage = avatarEditorRef?.current?.getImageScaledToCanvas();
    canvasImage.toBlob((blob: any) => {
      const file = new File([blob], "fileName.jpg", {
        type: "image/jpeg",
      });
      const formData = new FormData();
      formData.append("name", "avatar");
      formData.append("filename", file.name);
      formData.append("avatar", file);
      changeAvatarReq(formData).finally(() => {
        setIsEditorOpen(false);
      });
    }, "image/jpeg");
  };
  return (
    <>
      <Box position={"absolute"} top={0} right={"25%"}>
        <Box pos={"relative"}>
          <Tooltip
            label={"Add/Edit your Avatar (250x250(px) for the best resolution)"}
            fontSize={"sm"}
          >
            <label
              style={{
                backgroundColor: "rgb(74, 20, 225)",
                width: "25px",
                height: "25px",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                border: "3px solid #fff",
                boxSizing: "content-box",
                cursor: "pointer",
              }}
            >
              <input
                id="avatar"
                accept="image/*"
                type="file"
                {...register("avatar")}
                style={{ width: "1px", height: "1px" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const fileData = e?.currentTarget?.files?.[0];
                  if (!!fileData) {
                    setChosenImage(fileData);
                    setIsEditorOpen(true);
                  } else return;
                }}
              />
              <Pencil color={"#fff"} size={16} style={{ zIndex: 10 }} />
            </label>
          </Tooltip>
        </Box>
      </Box>
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen((prev) => !prev)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom={"1px"} borderColor={"gray.300"}>
            Crop Image
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} justifyContent={"center"} py={"6"}>
            <AvatarEditor
              ref={avatarEditorRef}
              image={chosenImage}
              width={250}
              height={250}
              border={50}
              scale={1.2}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={"blue"}
              onClick={submitImageHandler}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
