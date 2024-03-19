import { Controller } from "react-hook-form"
import { NestedForm } from "../../../../../../../admin-ui/ui/src/utils/nested-form"
import DatePicker from "../../../../../../../admin-ui/ui/src/components/atoms/date-picker/date-picker"
import TimePicker from "../../../../../../../admin-ui/ui/src/components/atoms/date-picker/time-picker"
import SwitchableItem from "../../../../../../../admin-ui/ui/src/components/molecules/switchable-item"

export type StoreCreditEndsAtFormType = {
  ends_at: Date | null
}

type StoreCreditEndsAtFormProps = {
  form: NestedForm<StoreCreditEndsAtFormType>
}

const StoreCreditEndsAtForm = ({ form }: StoreCreditEndsAtFormProps) => {
  const { control, path } = form

  return (
    <Controller
      name={path("ends_at")}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <SwitchableItem
            open={!!value}
            onSwitch={() => {
              if (value) {
                onChange(null)
              } else {
                onChange(
                  new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                )
              }
            }}
            title="Store Credit has an expiry date?"
            description="Schedule the Store Credit to deactivate in the future."
          >
            <div className="gap-x-xsmall flex items-center">
              <DatePicker
                date={value!}
                label="Expiry date"
                onSubmitDate={onChange}
              />
              <TimePicker
                label="Expiry time"
                date={value!}
                onSubmitDate={onChange}
              />
            </div>
          </SwitchableItem>
        )
      }}
    />
  )
}

export default StoreCreditEndsAtForm
