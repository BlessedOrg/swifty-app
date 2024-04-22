import { ReactNode } from "react";

export {};
declare global {
  interface Speaker {
    id: string;
    avatarUrl: string;
    name: string;
    description: string;
  }

  interface EventLocation {
    id: string;
    street1stLine: string;
    street2ndLine: string;
    postalCode: string;
    city: string;
    countryCode: string | null;
    country: string;
    createdAt: string;
    updatedAt: string;
    locationDetails: string;
  }

  interface EventSettings {
    phaseDuration: number;
    ticketsAmount: number;
  }

  interface IEvent {
    id: string;
    title: string;
    subtitle: string;
    lotteryV1contractAddr: string | null;
    lotteryV2contractAddr: string | null;
    auctionV1contractAddr: string | null;
    auctionV2contractAddr: string | null;
    lotteryV1nftAddr: string | null;
    lotteryV2nftAddr: string | null;
    auctionV1nftAddr: string | null;
    auctionV2nftAddr: string | null;
    lotteryV1settings: EventSettings;
    lotteryV2settings: EventSettings;
    auctionV1settings: EventSettings;
    auctionV2settings: EventSettings;
    description: string;
    coverUrl: string;
    imagesGallery: string[];
    priceCents: number | null;
    priceIncrease: number;
    cooldownTimeSeconds: number;
    timezoneIdentifier: string;
    currency: string;
    type: "free" | "paid";
    category: "event" | "conference" | "concerts";
    sellerId: string;
    startsAt: string;
    finishAt: string;
    createdAt: string;
    updatedAt: string;
    hosts: { name: string }[];
    eventLocationId: string;
    eventLocation: EventLocation;
    speakers: Speaker[];
  }
}
