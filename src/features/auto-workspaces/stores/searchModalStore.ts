import { create } from 'zustand';

type SearchModalState = {
  isSearchOpen: boolean;
  dismissedSuggestions: string[];

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  dismissSuggestion: (groupId: string) => void;
  clearDismissedSuggestions: () => void;
};

export const useSearchModalStore = create<SearchModalState>((set) => ({
  isSearchOpen: false,
  dismissedSuggestions: [],

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  dismissSuggestion: (groupId: string) =>
    set((state) => {
      if (state.dismissedSuggestions.includes(groupId)) return state;
      return { dismissedSuggestions: [...state.dismissedSuggestions, groupId] };
    }),

  clearDismissedSuggestions: () => set({ dismissedSuggestions: [] }),
}));

