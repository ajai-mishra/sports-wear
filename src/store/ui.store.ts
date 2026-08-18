import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  isCartDrawerOpen: boolean;
  isFilterDrawerOpen: boolean;
  setMobileNavOpen: (isOpen: boolean) => void;
  setCartDrawerOpen: (isOpen: boolean) => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isCartDrawerOpen: false,
  isFilterDrawerOpen: false,
  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
  setCartDrawerOpen: (isOpen) => set({ isCartDrawerOpen: isOpen }),
  setFilterDrawerOpen: (isOpen) => set({ isFilterDrawerOpen: isOpen }),
}));
