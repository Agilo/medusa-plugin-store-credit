import { useMedusa } from "medusa-react";
import qs from "query-string";
import { Controller } from "react-hook-form";
import Select from "../../../../../../../admin-ui/ui/src/components/molecules/select";
import { AdjacentContainer } from "../../../../../../../admin-ui/ui/src/components/molecules/select/next-select/components/containers";
import { Option } from "../../../../../../../admin-ui/ui/src/types/shared";
import FormValidator from "../../../../../../../admin-ui/ui/src/utils/form-validator";
import { NestedForm } from "../../../../../../../admin-ui/ui/src/utils/nested-form";

export type StoreCreditCustomerFormType = {
  customer: {
    id: string;
    email: string;
  } | null;
};

type StoreCreditCustomerFormProps = {
  form: NestedForm<StoreCreditCustomerFormType>;
};

const StoreCreditCustomerForm = ({ form }: StoreCreditCustomerFormProps) => {
  const { control, path } = form;

  const { client } = useMedusa();

  const debouncedFetch = async (filter: string): Promise<Option[]> => {
    const prepared = qs.stringify(
      {
        q: filter,
        has_account: true, // don't return guest customers
        offset: 0,
        limit: 10,
      },
      { skipNull: true, skipEmptyString: true }
    );

    return client.client
      .request("GET", `/admin/customers?${prepared}`)
      .then((data) => {
        return data.customers.map(({ id, first_name, last_name, email }) => ({
          label: `${first_name || ""} ${last_name || ""} (${email})`,
          value: id,
        }));
      })
      .catch(() => []);
  };

  return (
    <Controller
      rules={{ required: FormValidator.required("Customer") }}
      control={control}
      name={path("customer")}
      render={({ field: { value, onChange, name }, formState: { errors } }) => {
        return (
          <AdjacentContainer
            // ref={containerRef}
            // label={"Find existing customer"}
            // htmlFor={name}
            // helperText={helperText}
            required={true}
            name={name}
            errors={errors}
          >
            <Select
              required={true}
              // className="mt-4"
              label={"Find existing customer"}
              options={[]}
              enableSearch
              value={value ? { label: value.email, value: value.id } : null}
              onChange={(val) => {
                // onCustomerSelect(val);
                onChange(val ? { email: val.label, id: val.value } : null);
              }}
              filterOptions={debouncedFetch as any}
              clearSelected
            />
          </AdjacentContainer>
        );
      }}
    />
  );
};

export default StoreCreditCustomerForm;
