import { useAppContext } from '../context/AppContext'

export function useTheme() {
  const { theme, setTheme } = useAppContext()

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('auto')
    else setTheme('light')
  }

  return { theme, setTheme, isDark, toggleTheme }
}

export default useTheme
