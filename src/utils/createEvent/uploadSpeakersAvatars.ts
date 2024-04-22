import { uploadBrowserFilesToS3 } from "../../services/uploadImagesToS3";

interface SpeakerItem {
  avatarUrl: File | any;
  name: string;
  description: string;
}
export const uploadSpeakersAvatars = async (
  items: SpeakerItem[],
): Promise<SpeakerItem[]> => {
  const updatedItems: SpeakerItem[] = [];

  for (const item of items) {
    if (item.avatarUrl instanceof File) {
      const res = await uploadBrowserFilesToS3([item.avatarUrl]);
      const updatedItem: SpeakerItem = {
        description: item.description,
        name: item.name,
        avatarUrl: res?.[0].preview,
      };
      updatedItems.push(updatedItem);
    } else {
      updatedItems.push(item);
    }
  }

  return updatedItems;
};
