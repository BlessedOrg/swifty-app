"use client";
import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { uploadBrowserFilesToS3 } from "../../services/uploadImagesToS3";

export default function CustomDropzone(props: {
  [x: string]: any;
  getImage: (image: File) => void;
  type: "portrait";
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  currentImage?: string | null;
  background?: string;
  isLoading?: boolean;
}) {
  const { setIsLoading, ...rest } = props;

  const initImage = !!props?.currentImage ? props.currentImage : null;
  const [previewImage, setPreviewImage] = useState<any>(null);

  useEffect(() => {
    if (!!initImage && !previewImage) {
      setPreviewImage(initImage);
    }
    if (!!previewImage && !initImage) {
      setPreviewImage(null);
    }
    if (initImage !== previewImage) {
      setPreviewImage(initImage);
    }
  }, [initImage]);
  const onDrop = async (e) => {
    setIsLoading(true);
    const file = e[0];
    props.getImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsLoading(false);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: props.isLoading,
  });
  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("gray.300", "whiteAlpha.100");

  const sizesPerType = {
    portrait: { w: "100%", h: "450px" },
  };

  const sizeProps = sizesPerType[props.type] || {};

  return (
    <Flex flexDirection={"column"} w={"100%"}>
      <Flex
        align="center"
        justify="center"
        bg={props?.background ? props.background : bg}
        border="1px dashed"
        borderColor={borderColor}
        borderRadius="16px"
        maxW="100%"
        cursor={props.isLoading ? "no-drop" : "pointer"}
        {...getRootProps({ className: "dropzone" })}
        {...rest}
        pos={"relative"}
        overflow={"hidden"}
        minW={"200px"}
        {...sizeProps}
      >
        {!!previewImage && (
          <Image
            src={previewImage}
            width={400}
            height={200}
            alt=""
            onLoad={() => {
              setIsLoading(false);
            }}
            style={{
              objectFit: "cover",
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {!previewImage && (
          <Image
            src={"/images/logo_dark.svg"}
            width={400}
            height={200}
            alt=""
            onLoad={() => {
              setIsLoading(false);
            }}
            style={{
              objectFit: "cover",
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {props.isLoading && (
          <Flex
            w={"100%"}
            h={"100%"}
            pos={"absolute"}
            top={0}
            left={0}
            justifyContent={"center"}
            alignItems={"center"}
            bg={"rgba(0,0,0,0.9)"}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
              size="xl"
            />
          </Flex>
        )}
        <Flex
          pos={"absolute"}
          right={"0.5rem"}
          bottom={"0.5rem"}
          zIndex={1}
          bg={"#000"}
          border={"3px solid"}
          borderColor={"#fff"}
          p={2}
          rounded={"100%"}
        >
          <ImagePlus color={"#fff"} size={18} />
        </Flex>
        <input {...getInputProps()} />
      </Flex>
    </Flex>
  );
}
