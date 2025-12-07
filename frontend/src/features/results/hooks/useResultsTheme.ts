import { useThemeStore } from "../stores/themeStore";
import { DARK_THEME_CLASSES, LIGHT_THEME_CLASSES } from "../theme";

export const useResultsTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  const classes = isDark ? DARK_THEME_CLASSES : LIGHT_THEME_CLASSES;

  return {
    isDark,
    theme,
    classes,
    toggleTheme,
  };
};
