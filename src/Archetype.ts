export interface Archetype {
  kind: string;

  uniqueId(): string;
  fetchTo(dest: string): Promise<void>;
}
