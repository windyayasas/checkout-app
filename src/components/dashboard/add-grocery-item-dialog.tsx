"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Package, Hash, Building, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestGroceryDetails } from '@/ai/flows/suggest-grocery-details';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFamily } from '@/context/family-context';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Item name is required.',
  }),
  quantity: z.coerce.number().min(0.1, {
    message: 'Quantity must be greater than 0.',
  }),
  unit: z.string().min(1, {
    message: 'Please select a unit.',
  }),
  brand: z.string().optional(),
  price: z.coerce.number().min(0, "Price can't be negative.").optional(),
});

export type GroceryItemFormValues = z.infer<typeof formSchema>;

interface AddGroceryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: GroceryItemFormValues) => Promise<void> | void;
}

export function AddGroceryItemDialog({ open, onOpenChange, onAddItem }: AddGroceryItemDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const { toast } = useToast();
  const { currency } = useFamily();
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const form = useForm<GroceryItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unit: 'pcs',
      brand: '',
      price: 0,
    },
  });
  
  const itemName = form.watch('name');

  React.useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (itemName && itemName.length > 2) {
      debounceTimeout.current = setTimeout(async () => {
        setIsSuggesting(true);
        try {
          const suggestions = await suggestGroceryDetails({ name: itemName, currency });
          if (suggestions) {
            form.setValue('quantity', suggestions.quantity, { shouldValidate: true });
            form.setValue('unit', suggestions.unit, { shouldValidate: true });
            form.setValue('brand', suggestions.brand, { shouldValidate: true });
            form.setValue('price', suggestions.price, { shouldValidate: true });
          }
        } catch (error) {
          console.error("AI suggestion failed:", error);
          toast({
            title: "AI Suggestion Failed",
            description: "Could not fetch AI suggestions at the moment.",
            variant: "destructive"
          });
        } finally {
          setIsSuggesting(false);
        }
      }, 700);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemName, currency, form.setValue, toast]);


  async function onSubmit(values: GroceryItemFormValues) {
    setIsLoading(true);
    try {
      await onAddItem(values);
      console.log('Grocery item added successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add grocery item:', error);
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast({
        title: 'Unable to add item',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Grocery Item</DialogTitle>
          <DialogDescription>
            Enter the details for the new item on your list. AI will try to help you fill it out.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                   <div className="relative">
                    <Package className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., Milk" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand (Optional)</FormLabel>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., Ambewela" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pcs">pieces</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="ltr">liters</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="pack">pack</SelectItem>
                           <SelectItem value="dozen">dozen</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ({currency})</FormLabel>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currency}</span>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" {...field} className="pl-12" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading || isSuggesting}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Sparkles className={cn("mr-2 h-4 w-4", isSuggesting ? "animate-spin" : "text-accent")} />
                Add to List
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
