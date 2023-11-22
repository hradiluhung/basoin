
type Props = {
  label: string
  listItem: string[] | number[]
  value?: any
  placeholder: string
  setFilter: (value: any) => void
}

export default function DropDownFilter({
  label,
  listItem,
  placeholder,
  value,
  setFilter,
}: Props) {
  return (
    <label
      htmlFor={label}
      className="bg-input-color flex items-center border border-border-color rounded-xl overflow-hidden"
    >
      <select
        id={label}
        className="w-full px-4 py-2 rounded-md bg-input-color focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setFilter(e.target.value)
        }}
      >
        <option value="">{placeholder}</option>
        {listItem.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}
