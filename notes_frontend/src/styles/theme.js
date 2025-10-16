export const colors = {
  primary: 0xff2563eb,     // #2563EB
  secondary: 0xfff59e0b,   // #F59E0B
  success: 0xfff59e0b,     // #F59E0B
  error: 0xffef4444,       // #EF4444
  background: 0xfff9fafb,  // #f9fafb
  surface: 0xffffffff,     // #ffffff
  text: 0xff111827,        // #111827
  muted: 0xff6b7280        // slate-500-ish for muted text
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

export const radii = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
}

export const shadows = {
  color: 0x22000000,
  blur: 12
}

// Minimal storage helpers with safety
export const storage = {
  get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key)
      }
    } catch {
      // Ignore storage read errors and return null
    }
    return null
  },
  set(key, val) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val)
      }
    } catch {
      // Ignore storage write errors
    }
  }
}

export const theme = {
  name: 'Ocean Professional',
  colors,
  spacing,
  radii,
  shadows
}
