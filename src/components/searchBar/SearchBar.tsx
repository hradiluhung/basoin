import React from "react";
import { Search } from "react-feather";

type Props = {
  searchQuery: string;
  setSearchQuery: (keyword: string) => void;
  placeholder: string;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
}: Props) {
  return (
    <label
      htmlFor="search"
      className="bg-input-color flex items-center justify-between border border-border-color rounded-xl overflow-hidden"
    >
      <input
        id="search"
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent outline-none px-4 py-2 placeholder:text-soft-color placeholder:opacity-50"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      ></input>
      <div className="bg-mark-color px-4 py-2 brightness-50">
        <Search className="stroke-slate-100" />
      </div>
    </label>
  );
}
