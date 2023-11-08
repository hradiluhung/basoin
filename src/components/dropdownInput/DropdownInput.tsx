import React from "react";

type Props = {
  listItem: string[];
  label: string;
  placeholder: string;
  name: string;
  id: string;
  value: string;
  required: boolean;
  onChange: (e: any) => void;
};

export default function DropdownInput({
  listItem,
  label,
  placeholder,
  name,
  id,
  value,
  onChange,
  required,
}: Props) {
  return (
    <>
      <label htmlFor={id} className="block mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        id={id}
        className={`w-full px-4 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500 ${
          value === "" && "text-gray-400"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        <option disabled value="">
          -- {placeholder} --
        </option>
        {listItem.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </>
  );
}
