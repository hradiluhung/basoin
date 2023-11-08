import React from "react"

type Props = {
  label: string
  placeholder: string
  name: string
  id: string
  type: string
  value?: string
  required: boolean
  onChange: (e: any) => void
  additionalRequiredText?: string
}

export default function InputField({
  label,
  placeholder,
  name,
  id,
  type,
  value,
  required,
  onChange,
  additionalRequiredText,
}: Props) {
  return (
    <>
      <label htmlFor={id} className="block mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {additionalRequiredText && (
          <span className="text-red-500 text-xs ms-1">
            ({additionalRequiredText})
          </span>
        )}
      </label>
      {type === "file" ? (
        <input
          className="w-full px-4 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500"
          type={type}
          name={name}
          id={id}
          accept="image/*"
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          className="w-full px-4 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </>
  )
}
