import { QueryEncoder, URLSearchParams } from '@angular/http';

export class MyQueryEncoder extends QueryEncoder {
    public encodeKey(k: string): string {
      return encodeURIComponent(k);
    }
    public encodeValue(v: string): string {
      return encodeURIComponent(v);
    }
  }