"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Form, FormLabel, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import type { Color } from "@prisma/client";

interface ColorFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1, "name is required"),
  value: z.string().min(4).regex(/^#/,{
    message : 'String must be a valid hex code',
    
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const router = useRouter();
  // ⬅️ خُذ sizeId من الـ params بدل billboardId
  const { storeId, colorId } = useParams<{ storeId: string; colorId?: string }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initialData ? "Color updated." : "Color created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { name: initialData.name, value: initialData.value }
      : { name: "", value: "" },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData && colorId) {
        // ⬅️ مسار PATCH الصحيح
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
      } else {
        // ⬅️ مسار POST الصحيح
        await axios.post(`/api/${storeId}/colors`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      // ⬅️ ارجعي لصفحة اللائحة الصحيحة
      router.push(`/${storeId}/colors`);
    } catch (error: any) {
      toast.error(error?.response?.data ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!colorId) return;
    try {
      setLoading(true);
      // ⬅️ مسار DELETE الصحيح
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      toast.success("Color deleted.");
      router.refresh();
      router.push(`/${storeId}/colors`);
    } catch (error: any) {
      toast.error(
        error?.response?.data ?? "Make sure you removed all products using this color first."
      );
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
                  <Input disabled={loading} placeholder="Color Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="Color Value" {...field} />
                      <div className="border p-4 rounded-full" 
                      style={{ backgroundColor:field.value }}
                      />

                    
                  </div>
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
