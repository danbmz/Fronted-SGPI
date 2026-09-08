import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { InventarioProductoItem } from "@/features/inventory/schemas";

interface Props {
  inventario: InventarioProductoItem[];
  value: { productoId: string; pigmentoId: string } | null;
  onSelect: (item: InventarioProductoItem) => void;
}

export default function ComboboxProductoColor({ inventario, value, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const seleccionado = inventario.find(
    (i) => i.productoId === value?.productoId && i.pigmentoId === value?.pigmentoId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {seleccionado
            ? `${seleccionado.productoNombre} — ${seleccionado.color}`
            : "Buscar producto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Escribe para buscar..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {inventario.map((item) => (
                <CommandItem
                  key={`${item.productoId}-${item.pigmentoId}`}
                  value={`${item.productoNombre} ${item.color}`}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      seleccionado?.productoId === item.productoId && seleccionado?.pigmentoId === item.pigmentoId
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  <span className="flex-1">{item.productoNombre} — {item.color} {item.categoriaColor.toLowerCase()}</span>
                  <span className={`text-xs ${item.cantidadActual === 0 ? "text-red-600" : "text-muted-foreground"}`}>
                    {item.cantidadActual} disp.
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}