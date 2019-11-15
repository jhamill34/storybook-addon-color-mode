export type Listener<T> = (event: T) => void

export interface ColorModeChannel {
  emit<T>(event: string, args: T): void
  addListener<T>(event: string, listener: Listener<T>): void
  removeListener<T>(event: string, listener: Listener<T>): void
}
