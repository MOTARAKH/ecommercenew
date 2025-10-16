"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  name: string
  value:string
  createdAt: string;
  
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
 {
    header: "Value",
    accessorKey: "value",
    // ✅ خلية مخصّصة: هكس + دائرة اللون
    cell: ({ row }) => {
      const color = row.original.value;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono">{color}</span>
          <span
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "date",
  },
  {
    id:"actions",
    cell:({row}) => <CellAction data={row.original} />
  }
 
]