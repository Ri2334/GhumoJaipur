import React, { useRef, useState } from 'react'

// OTPInput: Renders N single-character inputs for OTP entry
export default function OTPInput({ length = 6, onChange }) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputs = useRef([])

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(-1)
    const next = [...values]
    next[idx] = val
    setValues(next)
    onChange && onChange(next.join(''))
    if (val && idx < length - 1) inputs.current[idx + 1].focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputs.current[idx - 1].focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={v}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center rounded-lg border text-xl"
          inputMode="numeric"
        />
      ))}
    </div>
  )
}
