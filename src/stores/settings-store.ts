// User preferences store (Zustand)
// Persists to localStorage: selected instrument, theme, audio settings

export interface SettingsState {
  instrumentId: string;
  theme: "light" | "dark" | "system";
  micSensitivity: number;
  metronomeEnabled: boolean;

  setInstrument: (id: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setMicSensitivity: (value: number) => void;
  toggleMetronome: () => void;
}

// TODO: export const useSettingsStore = create<SettingsState>()(persist((set) => ({ ... }), { name: "settings" }));
void ({} as SettingsState);
