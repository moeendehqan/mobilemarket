export interface FormDataType {
  description: string;
  description_appearance: string;
  technical_problem: string;
  price: string;
  customer_price: string;
  color: number | null | string;
  battry_health: string;
  battry_change: boolean;
  type_product?: "new" | "as new" | "used" | null;
  auction: boolean;
  guarantor: string;
  repaired: boolean;
  registered: boolean;
  part_num: string;
  charge_cicle: string;
  status_product: string;
  carton: string;
  grade: string;
  model_mobile: number | string | null;
  pictures: File[];
}

export type StepIndex = 0 | 1 | 2;
