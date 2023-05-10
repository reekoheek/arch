export interface ArchetypeInfo {
  readonly kind: string;
  readonly id: string;
  readonly src: string;
  readonly fetchedAt: Date;
}

export interface Archetype {
  readonly kind: string;
  readonly id: string;
  readonly src: string;
  fetchTo(dest: string): Promise<void>;
}
