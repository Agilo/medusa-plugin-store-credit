import { Controller } from "react-hook-form";
import PriceFormInput from "../../../../../../../admin-ui/ui/src/components/forms/general/prices-form/price-form-input";
import FormValidator from "../../../../../../../admin-ui/ui/src/utils/form-validator";
import { NestedForm } from "../../../../../../../admin-ui/ui/src/utils/nested-form";
import { formatAmountWithSymbol } from "../../../../../../../admin-ui/ui/src/utils/prices";

export type StoreCreditBalanceFormType = {
  amount: number;
};

export type StoreCreditBalanceFormProps = {
  form: NestedForm<StoreCreditBalanceFormType>;
  currencyCode: string;
  originalAmount?: number;
};

const StoreCreditBalanceForm = ({
  form,
  currencyCode,
  originalAmount,
}: StoreCreditBalanceFormProps) => {
  const {
    control,
    path,
    formState: { errors },
  } = form;

  return (
    <Controller
      name={path("amount")}
      rules={{
        required: FormValidator.required("Balance"),
        min: {
          value: 0,
          message: "Balance must be greater than 0",
        },
        max: originalAmount
          ? {
              value: originalAmount,
              message: `The updated balance cannot exceed the original value of ${formatAmountWithSymbol(
                {
                  amount: originalAmount,
                  currency: currencyCode,
                }
              )}`,
            }
          : undefined,
      }}
      control={control}
      render={({ field: { value, onChange, name } }) => {
        return (
          <PriceFormInput
            label="Amount"
            currencyCode={currencyCode}
            onChange={onChange}
            amount={value}
            name={name}
            errors={errors}
            required
          />
        );
      }}
    />
  );
};

export default StoreCreditBalanceForm;
