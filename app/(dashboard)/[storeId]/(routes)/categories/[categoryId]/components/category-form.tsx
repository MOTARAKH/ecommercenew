"use client";

import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, FormLabel, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select ,SelectTrigger,SelectValue,SelectContent} from "@/components/ui/select";
import { Billboard,Category } from "@prisma/client";
import { SelectItem } from "@radix-ui/react-select";
interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[] ;
}

const formSchema = z.object({
  name: z.string().min(1, "name is required"),
  billboardId: z.string().min(1, "billboard ID is required"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
  const router = useRouter();
  const { storeId, billboardId } = useParams<{ storeId: string; billboardId?: string }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData ? "category updated." : "category created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? { name: "", billboardId: "" },
  });

  const onSubmit = async (data: CategoryFormValues) => {
  try {
    setLoading(true);
    if (initialData && billboardId) {
      await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
    } else {
      await axios.post(`/api/${storeId}/billboards`, data);
    }
    toast.success(toastMessage);
    router.refresh();
    router.push(`/${storeId}/billboards`);
  } catch (error: any) {
    toast.error(error?.response?.data ?? "Something went wrong");
  } finally {
    setLoading(false);
  }
};

const onDelete = async () => {
  try {
    setLoading(true);
    await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
    toast.success("Billboard deleted.");
    router.refresh();
    router.push(`/${storeId}/billboards`);
  } catch (error: any) {
    toast.error(error?.response?.data ?? "Make sure you removed all categories using this billboard first.");
  } finally {
    setLoading(false);
    setOpen(false);
  }
};
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Category Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a billboard"
                      />


                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {billboards.map((billboard)=>(
                        <SelectItem 
                        key={billboard.id}
                        value={billboard.id}
                        >
                          {billboard.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  );
};
