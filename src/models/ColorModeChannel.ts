export interface ColorModeChannel {
  emit(event: string, id: string): void
  addListener(event: string, listener: (newId: string) => void): void
  removeListener(event: string, listener: (newId: string) => void): void
}
