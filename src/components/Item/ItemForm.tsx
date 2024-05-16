import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAppDispatch from "@/hooks/useAppDispatch";
import { zodResolver } from "@hookform/resolvers/zod";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { actions as toastActs } from "@/redux/toast";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getStaticProps } from "^/utils/getStaticProps";
import { FormMode, Options } from "^/@types/global";
import { IItemForm, ItemFormProps } from "^/@types/models/item";
import { addItemAPI, editItemAPI } from "^/services/item";
import { ItemFormSchema, initialItemForm } from "^/config/item/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { handleFocusSelectAll } from "^/utils/helpers";
import useGetItemCat from "@/hooks/itemCategory/useGetItemCat";
import useMount from "@/hooks/useMount";

const ItemForm: FC<ItemFormProps> = ({ mode, initialFormVals, doRefresh }) => {
  const t = useTranslations("");

  const router = useRouter();

  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const { itemCatOpts, fetch } = useGetItemCat();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: z.infer<typeof ItemFormSchema>) => {
    setLoading(true);
    const prm: IItemForm = {
      itemCategory: values.itemCategory,
      name: values.name,
      description: values.description,
      price: values.price,
      id: initialFormVals.id ?? "",
    };
    const res =
      mode === FormMode.ADD
        ? await addItemAPI(session, prm)
        : await editItemAPI(session, prm);
    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.NEW_ITEM_CAT_CREATE")
                  : t("API_MSG.SUCCESS.ITEM_CAT_UPDATE")}
              </span>
            </div>
          ),
          type: "success",
        })
      );
    } else {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.ERROR.UNEXPECTED_ERROR")}</span>
            </div>
          ),
          type: "error",
        })
      );
    }

    if (mode == FormMode.ADD) handleReset();
    else doRefresh;

    setLoading(false);
  };

  const handleReset = () => {
    itemForm.setValue(
      "description",
      mode == FormMode.ADD ? "" : initialFormVals.description
    );
    itemForm.setValue("name", mode == FormMode.ADD ? "" : initialFormVals.name);
    itemForm.setValue(
      "price",
      mode == FormMode.ADD ? 0 : initialFormVals.price
    );
    itemForm.setValue(
      "itemCategory",
      mode == FormMode.ADD ? "" : initialFormVals.itemCategory
    );
  };

  const itemForm = useForm<z.infer<typeof ItemFormSchema>>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: mode == FormMode.ADD ? initialItemForm : initialFormVals,
  });

  useMount(() => {
    fetch({
      limit: 50,
    });
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      itemForm.setValue("itemCategory", initialFormVals.itemCategory);
      itemForm.setValue("description", initialFormVals.description);
      itemForm.setValue("name", initialFormVals.name);
      itemForm.setValue("price", initialFormVals.price);
    }
  }, [
    id,
    initialFormVals.description,
    initialFormVals.id,
    initialFormVals.itemCategory,
    initialFormVals.name,
    initialFormVals.price,
    itemForm,
    mode,
  ]);

  return (
    <Form {...itemForm}>
      <form
        onReset={() => itemForm.reset}
        onSubmit={itemForm.handleSubmit(onFormSubmit)}
        className="space-y-8"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={itemForm.control}
          name="itemCategory"
          defaultValue={itemForm.getValues("itemCategory")}
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={mode == FormMode.VIEW}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          mode == FormMode.ADD
                            ? "Select Category"
                            : itemCatOpts.find(
                                (y) => y.value == initialFormVals.itemCategory
                              )?.text
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itemCatOpts.map((x: Options) => {
                      return (
                        <SelectItem key={x.value} value={x.value}>
                          {x.text}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          disabled={mode == FormMode.VIEW}
          control={itemForm.control}
          name="name"
          defaultValue={itemForm.getValues("name")}
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    onFocus={handleFocusSelectAll}
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          disabled={mode == FormMode.VIEW}
          control={itemForm.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    onFocus={handleFocusSelectAll}
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        {/* <FormField
          disabled={mode == FormMode.VIEW}
          control={itemForm.control}
          name="price"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    onFocus={handleFocusSelectAll}
                    type="number"
                    placeholder="Price"
                    {...field}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        /> */}

        {mode !== FormMode.VIEW && (
          <div className="flex flex-row justify-center gap-3">
            <Button
              className="bg-primary text-white hover:bg-primary-foreground"
              type="submit"
              disabled={loading}
            >
              {loading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
              {capitalizeStr("Submit")}
            </Button>
            <Button
              className="bg-gray-700 text-white hover:bg-gray-500"
              onClick={handleReset}
              type="reset"
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export { getStaticProps };

export default ItemForm;
