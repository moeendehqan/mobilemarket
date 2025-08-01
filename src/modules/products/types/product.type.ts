import type { Picture } from "./picture.type";
import type { Color } from "./color.type";
import type { modelMobileType } from "./modelmobile.type";
import type { UserType } from "../../auth/types/user.type";

export interface Product {
  id?: number;
  seller?: UserType;
  description: string;
  description_appearance: string;
  technical_problem: string;
  price: number;
  color: Color | number;
  picture: Picture[];
  battry_health: number;
  battry_change: boolean;
  type_product: "new" | "as new" | "used" | null;
  auction: boolean;
  guarantor: number;
  repaired: boolean;
  part_num: string | null;
  status_product: 'open' | 'saled' | 'canseled' | 'reserved' | null;
  carton: "orginal" | "repakage" | null;
  model_mobile: modelMobileType | number;
  created_at: string;
  updated_at: string;


  }
  