import type { Camera } from "./camera.type";
import type { Picture } from "./picture.type";

export interface Product {
    id?: number;
    seller?: number | null; // Or you can define a full User type instead
    name?: string | null;
    description?: string | null;
    price?: string | null;
    brand?: string | null;
    color?: string | null;
    camera?: number | Camera | null;
    picture?: number | Picture | null;
    part_number?: string | null;
    ram?: string | null;
    sim_card?: string | null;
    battry?: string | null;
    battry_health?: string | null;
    battry_change: boolean;
    size?: string | null;
    charger: boolean;
    carton: boolean;
    type_product?: "new" | "as new" | "used" | null;
    technical_problem?: string | null;
    hit_product: boolean;
    register_date?: string | null; // ISO Date string
    registered: boolean;
    guarantor?: "guarantor" | "guarantor_registered" | "disregistered" | null;
    repaired: boolean;
    status_product?: "open" | "saled" | "canseled" | "reserved" | null;
    created_at: string;
    updated_at: string;
  }
  