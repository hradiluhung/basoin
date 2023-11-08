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
}

export default function TextArea({
  label,
  placeholder,
  name,
  id,
  type,
  value,
  required,
  onChange,
}: Props) {
  return (
    <>
      <label htmlFor={id} className="block mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        id={id}
        className="w-full resize-none h-64 px-4 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  )
}
