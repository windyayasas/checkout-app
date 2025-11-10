import { create } from 'zustand';
import { Family, subscribeFamilies } from '@/repositories/families';
import { GroceryItem, subscribeItems } from '@/repositories/groceryItems';

interface AppState {
  families: Family[];
  activeFamilyId: string | null;
  items: GroceryItem[];
  setActiveFamily: (id: string) => void;
  init: (ownerId: string) => void;
  cleanup: () => void;
  familyUnsub?: () => void;
  itemsUnsub?: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  families: [],
  activeFamilyId: null,
  items: [],
  familyUnsub: undefined,
  itemsUnsub: undefined,
  setActiveFamily: (id: string) => {
    const prevItemsUnsub = get().itemsUnsub;
    if (prevItemsUnsub) prevItemsUnsub();

    const itemsUnsub = subscribeItems(id, (items: GroceryItem[]) => set({ items }));
    set({ activeFamilyId: id, itemsUnsub });
  },
  init: (ownerId: string) => {
    const prevFamilyUnsub = get().familyUnsub;
    if (prevFamilyUnsub) prevFamilyUnsub();

    const familyUnsub = subscribeFamilies(ownerId, (families: Family[]) => {
      set({ families });
      const { activeFamilyId } = get();
      if (!activeFamilyId && families.length) {
        get().setActiveFamily(families[0].id);
      }
    });
    set({ familyUnsub });
  },
  cleanup: () => {
    const { familyUnsub, itemsUnsub } = get();
    if (itemsUnsub) itemsUnsub();
    if (familyUnsub) familyUnsub();
    set({ familyUnsub: undefined, itemsUnsub: undefined, items: [], families: [], activeFamilyId: null });
  },
}));
