"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Popover, PopoverTrigger ,PopoverContent } from "./ui/popover";
import {Store} from "@prisma/client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {ChevronsUpDown,Store as StoreIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { Command ,
         CommandInput,
         CommandList ,
         CommandEmpty,
         CommandGroup ,CommandSeparator , CommandItem} from "./ui/command";
import { Check } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>


interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];

}
export default function StoreSwitcher({
    className,
    items = []
    }: StoreSwitcherProps) {
        const storeModal =useStoreModal();
        const params = useParams();
        const router = useRouter();
        const formatteedItems = items.map((item) => ({
            label :item.name,
            value:item.id
        }));
        const currentStore = formatteedItems.find((item) => item.value === params.storeId);
        
        const [open,setOpen] = useState(false);

        const onStoreSelect = (store: {value: string, label:string}) =>
        {
            setOpen(false);
            router.push(`/${store.value}`);
        }
        return (
           <Popover open={open} onOpenChange={setOpen}> 
                <PopoverTrigger asChild>
                    <Button 
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px justify-between",className)}
                    >
                        <StoreIcon className="mr-2 h-4 w-4"/>
                            {currentStore?.label}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search store..."/>
                            <CommandEmpty>No store found.</CommandEmpty>
                            <CommandGroup heading="Stores">
                                {formatteedItems.map((store)=>(
                                    <CommandItem 
                                    key={store.value}
                                    onSelect={()=>onStoreSelect(store)}
                                    className="text-sm"
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4"/>
                                        {store.label}
                                        <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentStore?.value === store.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                        />

                                
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator/>
                        <CommandList>
                            <CommandGroup>
                                    <CommandItem
                                    onSelect={()=>{
                                        setOpen(false);
                                        storeModal.onOpen();

                                    }}
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5"/>
                                        Create Store
                                    </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
           </Popover>
        );
};



