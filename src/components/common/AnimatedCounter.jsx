import React, { useEffect, useRef, useState } from 'react'

function AnimatedCounter({ value, duration = 800, formatFn }) {
  const [displayValue, setDisplayValue] = useState(value)
  const startRef = useRef(null)
  const prevValueRef = useRef(value)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = prevValueRef.current
    const to = value

    if (from === to) return

    const startTime = performance.now()

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const current = from + (to - from) * eased

      setDisplayValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(to)
        prevValueRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [value, duration])

  const display = formatFn ? formatFn(displayValue) : Math.round(displayValue).toLocaleString()

  return <span>{display}</span>
}

export default AnimatedCounter
