import { useAdminRegions } from "medusa-react";
import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { NextSelect } from "../../../../../../../admin-ui/ui/src/components/molecules/select/next-select";
import { Option } from "../../../../../../../admin-ui/ui/src/types/shared";
import FormValidator from "../../../../../../../admin-ui/ui/src/utils/form-validator";
import { NestedForm } from "../../../../../../../admin-ui/ui/src/utils/nested-form";

type RegionOption = Option & {
  currency_code: string;
};

export type StoreCreditRegionFormType = {
  region_id: RegionOption;
};

type StoreCreditRegionFormProps = {
  form: NestedForm<StoreCreditRegionFormType>;
};

const StoreCreditRegionForm = ({ form }: StoreCreditRegionFormProps) => {
  const {
    control,
    path,
    formState: { errors },
    setValue,
  } = form;

  const { regions } = useAdminRegions({
    limit: 100,
  });

  const regionOptions: RegionOption[] = useMemo(() => {
    return (
      regions?.map((r) => ({
        label: r.name,
        value: r.id,
        currency_code: r.currency_code,
      })) || []
    );
  }, [regions]);

  const subscriber = useWatch({
    control,
    name: path("region_id"),
  });

  useEffect(() => {
    if (!subscriber) {
      setValue(path("region_id"), regionOptions[0], {
        shouldDirty: true,
      });
    }
  }, [subscriber, regionOptions, setValue, path]);

  return (
    <Controller
      name={path("region_id")}
      rules={{
        required: FormValidator.required("Region"),
      }}
      control={control}
      render={({ field }) => {
        return (
          <NextSelect
            label="Region"
            required
            {...field}
            errors={errors}
            options={regionOptions}
          />
        );
      }}
    />
  );
};

export default StoreCreditRegionForm;
