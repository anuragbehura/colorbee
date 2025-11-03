"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface DropdownMenuCheckboxesProps {
    filter: string
    setFilter: React.Dispatch<React.SetStateAction<string>>
}

export default function DropdownMenuCheckboxes({
    filter,
    setFilter,
}: DropdownMenuCheckboxesProps) {
    // const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    // const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    // const [showPanel, setShowPanel] = React.useState<Checked>(false)
    const handleFilterChange = (value: string) => {
        console.log("Current filter:", filter);
        console.log("Clicked value:", value);
        const newFilter = filter === value ? "" : value;
        console.log("New filter:", newFilter);
        setFilter(newFilter);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Sort by: {filter ? filter.charAt(0).toUpperCase() + filter.slice(1): "All"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={filter === "month"}
                    onCheckedChange={() => handleFilterChange("month")}
                >
                    Month
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter === "year"}
                    onCheckedChange={() => handleFilterChange("year")}
                    disabled
                >
                    Year
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter === "all"}
                    onCheckedChange={() => handleFilterChange("all")}
                >
                    All
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
