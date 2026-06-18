import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import en from '../i18n/en'
import sw from '../i18n/sw'

const translations = { en, sw }

export function useLanguage() {
  const { language } = useAppContext()

  const t = useCallback(
    (key, params = {}) => {
      const dict = translations[language] || translations.en
      let str = dict[key] || translations.en[key] || key

      // Replace {param} placeholders
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      })

      return str
    },
    [language]
  )

  return { t, language }
}

export default useLanguage
