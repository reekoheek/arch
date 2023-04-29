import { Archetype } from '../Archetype';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { ReadableStream } from 'stream/web';
import decompress from 'decompress';
import { ArchetError } from '../../../ArchetError';

const BASE_URL = 'https://github.com';
const RE_MATCH_URL = /^https:\/\/github.com\/[^\\/]+\/[^\\/]+$/;
const RE_SUPPORTED_TOKEN = /^[^\\/]+\/[^\\/]+$/;

export class Github implements Archetype {
  readonly kind = Github.name.toLowerCase();
  private src: string;

  static support(src: string) {
    src = src.trim();

    if (src.match(RE_MATCH_URL)) {
      return true;
    }

    if (src.match(RE_SUPPORTED_TOKEN)) {
      return true;
    }

    return false;
  }

  constructor(src: string) {
    this.src = normalize(src);
  }

  uniqueId() {
    return this.src.slice(BASE_URL.length + 1);
  }

  async fetchTo(dest: string): Promise<void> {
    const { name, removeCallback } = tmp.dirSync({ unsafeCleanup: true });
    try {
      const zipFile = path.resolve(name, 'main.zip');
      const url = `${this.src}/archive/refs/heads/main.zip`;
      await download(url, zipFile);

      await decompress(zipFile, dest, {
        map: (file) => {
          file.path = file.path.split('/').slice(1).join('/');
          return file;
        },
      });
    } finally {
      removeCallback();
    }
  }
}

async function download(src: string, dest: string) {
  const resp = await fetch(src, { redirect: 'follow' });
  if (resp.status !== 200) {
    throw new ArchetError('download error: ' + resp.status);
  }

  await pipeline(Readable.fromWeb(resp.body as ReadableStream), fs.createWriteStream(dest));
}

function normalize(src: string) {
  src = src.trim();

  if (src.match(RE_MATCH_URL)) {
    return src;
  }

  return `${BASE_URL}/${src}`;
}
