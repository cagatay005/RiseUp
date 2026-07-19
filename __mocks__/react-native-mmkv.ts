/** Jest için bellek-içi MMKV — native modül test ortamında yüklenemez. */
export class MMKV {
  private map = new Map<string, string | number | boolean>();

  constructor(_config?: { id?: string }) {}

  set(key: string, value: string | number | boolean): void {
    this.map.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = this.map.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  delete(key: string): void {
    this.map.delete(key);
  }

  clearAll(): void {
    this.map.clear();
  }
}
