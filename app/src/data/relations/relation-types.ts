export const RelationTypes = {
   OneToOne: "1:1",
   ManyToOne: "n:1",
   ManyToMany: "m:n",
   Polymorphic: "poly",
} as const;
export type RelationType = (typeof RelationTypes)[keyof typeof RelationTypes];

export const RelationCascades = [
   "cascade",
   "set null",
   "set default",
   "restrict",
   "no action",
] as const;
export type RelationCascade = (typeof RelationCascades)[number];
export const DEFAULT_RELATION_CASCADE: RelationCascade = "set null";
