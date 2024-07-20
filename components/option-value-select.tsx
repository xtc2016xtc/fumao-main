import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Component({
  onValueChange,
  options,
  defaultValue,
}: {
  value: any,
  defaultValue: any,
  onValueChange: (value: any) => void,
  options: { label: string, options: { label: string, value: string }[] }[]
}) {
  // 使用 defaultValue 作为 selectedOptions 的初始状态
  const [selectedOptions, setSelectedOptions] = useState<{ label: string, value: string }[]>(defaultValue || []);

  const handleOptionSelect = (option: { label: string; value: string }) => {
    let newSelectedOptions;
    if (selectedOptions.some((o) => o.value === option.value)) {
      newSelectedOptions = selectedOptions.filter((o) => o.value !== option.value);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(newSelectedOptions);
    // 在选项变化时调用 onValueChange
    if (onValueChange) {
      console.log(newSelectedOptions,'newSelectedOptions')
      onValueChange(newSelectedOptions);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedOptions.length > 0 ? (
            <div className="flex flex-nowrap overflow-hidden gap-2">
            {selectedOptions.map((option) => (
              <div key={option.value} className="bg-primary text-primary-foreground px-2 py-1 rounded-md truncate max-w-[100px]">
                {option.label}
              </div>
            ))}
          </div>
          ) : (
            "请选择"
          )}
          <ChevronsUpDownIcon/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] max-h-[60vh] overflow-y-auto p-0">
      <ScrollArea className="h-[calc(60vh-220px)] rounded-md border">
        <div className="grid gap-4 p-4">
          {options.map((group) => (
            <div key={group.label} className="grid gap-2">
              <div className="font-semibold">{group.label}</div>
              <div className="grid gap-2">
                {group.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-2 cursor-pointer rounded-md px-2 py-1  ${
                      selectedOptions.some((o) => o.value === option.value) ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <Checkbox checked={selectedOptions.some((o) => o.value === option.value)} className="shrink-0" />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ChevronsUpDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" aria-hidden="true"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
  )
}