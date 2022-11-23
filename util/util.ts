export interface Variant {
  name: string;
  params: number;
}
export interface Model {
  name: string;
  description: string;
  variants: Variant[];
}
