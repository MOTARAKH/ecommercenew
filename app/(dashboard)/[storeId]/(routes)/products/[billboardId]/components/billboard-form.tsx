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
import ImageUpload from "@/components/ui/image-upload"; 
type BillboardClient = { id: string; label: string; imageUrl: string };

interface BillboardFormProps {
  initialData: BillboardClient | null;
}

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { storeId, billboardId } = useParams<{ storeId: string; billboardId?: string }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? { label: "", imageUrl: "" },
  });

  const onSubmit = async (data: BillboardFormValues) => {
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    folder={`/stores/${storeId}/billboards`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard label" {...field} />
                </FormControl>
                <FormMessage />
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
