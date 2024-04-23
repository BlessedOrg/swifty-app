import { uploadBrowserFilesToS3 } from "../../services/uploadImagesToS3";

export const formatAndUploadImagesGallery = async (
  imagesGallery,
  isEditForm,
) => {
  let uploadedImagesGallery: any[] = [];
  const imageGalleryData =
    imagesGallery || ([] as { index: number; source: File | string | null }[]);

  if (isEditForm) {
    for (const image of imageGalleryData) {
      if (image.source instanceof File) {
        const res = await uploadBrowserFilesToS3([image.source]);

        imageGalleryData[image.index].source = res?.[0].preview;
      }
    }
  } else {
    if (!!imagesGallery?.length) {
      const imagesToUpload = imagesGallery
        .filter((i) => i.source instanceof File)
        .map((f) => f.source);
      const res = await uploadBrowserFilesToS3(imagesToUpload);

      for (let i = 0; i < imagesToUpload.length; i++) {
        uploadedImagesGallery.push(res?.[i].preview);
      }
    }
  }

  const finalGalleryImages = isEditForm
    ? imageGalleryData.filter((item) => item.source).map((item) => item.source)
    : uploadedImagesGallery;
  return finalGalleryImages;
};
