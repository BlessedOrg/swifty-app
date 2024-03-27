import { ReactNode } from "react";

export {};
declare global {
  interface IEvent {
    id: number;
    eventTitle: string;
    images: string[];
    location: string;
    address?: {
      postalCode: string;
      street: string;
      country: string;
      city: string;
    };
    host?: { name: string; url: string }[];
    description?: string | any;
    avatars?: string[];
    country: string;
    period: {
      from: string | Date;
      to: string | Date;
    };
    price: number | string;
    badge: string;
  }
}
