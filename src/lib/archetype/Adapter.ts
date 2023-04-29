import { Archetype } from './Archetype';

export type SupportFn = (src: string) => boolean;

export interface Adapter {
  support: SupportFn;
  new(src: string): Archetype;
}
