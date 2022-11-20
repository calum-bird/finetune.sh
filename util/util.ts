export interface Variant {
  name: string;
  params: number;
}
export interface Model {
  name: string;
  description: string;
  variants: Variant[];
}

export const models: Model[] = [
  {
    name: "GPT-2",
    description: "Okay, I see you!",
    variants: [
      { name: "Medium", params: 355 },
      { name: "Large", params: 774 },
      { name: "Extra Large", params: 1500 },
    ],
  },
  {
    name: "GPT-J",
    description: "Whoa this is a big boy!",
    variants: [{ name: "6B", params: 6000 }],
  },
  {
    name: "Bloom",
    description: "Holy shit!",
    variants: [{ name: "175B", params: 175000 }],
  },
];
