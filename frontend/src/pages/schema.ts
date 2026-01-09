// src/types/index.ts

export type UserRole = "user" | "owner" | "deliveryBoy";

export interface User {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
    role: UserRole;
    socketId?: string;
    isOnline: boolean;
    location: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };
}

export interface Item {
    _id: string;
    name: string;
    image: string;
    shop: string | Shop;
    category: "Snacks" | "Main Course" | "Desserts" | "Pizza" | "Burgers" | "Sandwiches" | "South Indian" | "North Indian" | "Chinese" | "Fast Food" | "Others";
    price: number;
    foodType: "veg" | "non veg";
    rating: {
        average: number;
        count: number;
    };
}

export interface Shop {
    _id: string;
    name: string;
    image: string;
    owner: string | User;
    city: string;
    state: string;
    address: string;
    items: string[] | Item[];
}

export interface DeliveryAssignment {
    _id: string;
    order: string;
    shop: string;
    shopOrderId: string;
    brodcastedTo: string[];
    assignedTo: string | null;
    status: "brodcasted" | "assigned" | "completed";
    acceptedAt?: Date;
}

export interface CartItem extends Item {
    quantity: number;
}