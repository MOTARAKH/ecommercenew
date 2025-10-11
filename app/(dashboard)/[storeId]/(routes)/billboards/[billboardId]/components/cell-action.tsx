"use client"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
interface CellActionProps {
    data:BillboardColumn;

}
export const CellAction:React.FC<CellActionProps> = ({
    data
}) =>{
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <span className="sr-only">Open Menu</span>
                    
                </Button>
                
            </DropdownMenuTrigger>
        </DropdownMenu>
    );
};