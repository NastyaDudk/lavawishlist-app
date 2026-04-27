export {};

declare global {
  interface Window {
    updateWishlistCount?: () => void;
  }
}

