import React from "react"
import InputField from "../inputField/InputField"
import DropdownInput from "../dropdownInput/DropdownInput"
import SecondaryActionButton from "../buttons/SecondaryActionButton"
import { Check, Loader, X } from "react-feather"
import PrimaryActionButton from "../buttons/PrimaryActionButton"
import TextArea from "../textArea/TextArea"
import TetriaryActionButton from "../buttons/TetriaryActionButton"

type Props = {
  inputList: {
    label: string
    placeholder: string
    value: any
    type: string
    isDropdown?: boolean
    dropdownList?: string[]
    isTextArea?: boolean
    onChange: (e: any) => void
    file?: any
    setFile?: any
    required: boolean
    additionalRequiredText?: string
  }[]
  title: string
  onCloseModal: () => void
  onSubmit: (e: any) => void
  isLoading: boolean
  size?: "small" | "large"
  submitText?: string
}

export default function ModalForm({
  inputList,
  onCloseModal,
  onSubmit,
  isLoading,
  title,
  size = "small",
  submitText = "Submit",
}: Props) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 py-4 bg-black bg-opacity-50 flex justify-center items-center sm:px-2">
      <div
        className={`max-h-full flex flex-col bg-card-color rounded-xl md:w-full sm:w-full ${
          size == "small" ? "w-128 " : "w-1/2 "
        }}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-b-border-color">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <TetriaryActionButton onClick={onCloseModal} ButtonIcon={X} />
        </div>

        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={onSubmit}
          className="flex h-full flex-col gap-4 p-8 overflow-y-auto"
        >
          {inputList.map((input, index) =>
            input.file ? (
              <>
                <span className="block mb-2">Gambar Cover</span>
                <div className="w-full px-2 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500">
                  <img
                    src={URL.createObjectURL(input.file)}
                    alt="Cover Mata Kuliah"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    className="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded-md"
                    onClick={() => {
                      input.setFile(null)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <label key={index} htmlFor={input.label}>
                {input.isDropdown ? (
                  <DropdownInput
                    key={index}
                    listItem={input.dropdownList as string[]}
                    label={input.label}
                    placeholder={input.placeholder}
                    name={input.label}
                    id={input.label}
                    required={true}
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : input.isTextArea ? (
                  <TextArea
                    id={input.label}
                    label={input.label}
                    name={input.label}
                    onChange={input.onChange}
                    placeholder={input.placeholder}
                    required={input.required}
                    value={input.value}
                    type="text"
                    key={index}
                  />
                ) : (
                  <InputField
                    key={index}
                    placeholder={input.placeholder}
                    value={input.value}
                    type={input.type}
                    onChange={input.onChange}
                    id={input.label}
                    label={input.label}
                    name={input.label}
                    required={input.required}
                    additionalRequiredText={input.additionalRequiredText}
                  />
                )}
              </label>
            )
          )}
          <div className="flex justify-end mt-4 gap-2 ">
            <SecondaryActionButton onClick={onCloseModal} text="Batal" />
            <PrimaryActionButton
              text={submitText}
              isSubmit={true}
              isLoading={isLoading}
              ButtonIcon={isLoading ? Loader : Check}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
