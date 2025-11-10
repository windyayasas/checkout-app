"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFamily } from '@/context/family-context';
import { AddGroceryItemDialog, GroceryItemFormValues } from './add-grocery-item-dialog';
import { useAppStore } from '@/store/app-store';
import { addItem, deleteItem, updateItem } from '@/repositories/groceryItems';
import { useToast } from '@/hooks/use-toast';

// Items now come from Firestore via useAppStore (real-time subscription).

export function GroceryList() {
    const { selectedFamily, currency } = useFamily();
    const { toast } = useToast();
    const items = useAppStore(s => s.items);
    const setActiveFamily = useAppStore(s => s.setActiveFamily);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (selectedFamily) {
            setActiveFamily(selectedFamily.id);
        }
    }, [selectedFamily?.id, setActiveFamily]);

    const handleAddItem = async (newItem: GroceryItemFormValues) => {
        if (!selectedFamily) {
            toast({ title: 'Select a family first', description: 'Please choose a family before adding items.', variant: 'destructive' });
            throw new Error('No family selected');
        }
        try {
            await addItem({
                familyId: selectedFamily.id,
                name: newItem.name,
                quantity: newItem.quantity,
                unit: newItem.unit,
                brand: newItem.brand,
                price: newItem.price,
                checked: false,
            });
            toast({ title: 'Item added', description: `${newItem.name} added to the list.` });
        } catch (error) {
            throw error;
        }
    };
    
    const handleToggleItem = async (itemId: string) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        try {
            await updateItem(itemId, { checked: !item.checked });
        } catch (error) {
            toast({ title: 'Failed to update item', description: 'Could not toggle item status.', variant: 'destructive' });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            await deleteItem(itemId);
            toast({ title: 'Item removed' });
        } catch (error) {
            toast({ title: 'Failed to remove item', description: 'Please try again.', variant: 'destructive' });
        }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (isNaN(newQuantity) || newQuantity < 0) return;
        try {
            await updateItem(itemId, { quantity: newQuantity });
        } catch (error) {
            toast({ title: 'Failed to update quantity', description: 'Please try again.', variant: 'destructive' });
        }
    };


    return (
        <>
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">
                                {selectedFamily?.name}'s Grocery List
                            </CardTitle>
                            <CardDescription>Here's what we need from the store. Add items or check them off as you shop.</CardDescription>
                        </div>
                        <Button onClick={() => setAddDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <ul className="space-y-3">
                            {items.length > 0 ? items.map((item) => (
                                <li key={item.id} className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                    <Checkbox 
                                        id={`item-${item.id}`} 
                                        checked={Boolean(item.checked)}
                                        onCheckedChange={() => handleToggleItem(item.id)}
                                        className="h-5 w-5"
                                    />
                                    <div className="flex-1 grid gap-0.5">
                                        <span className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                            {item.name}
                                        </span>
                                        {item.brand && (
                                            <span className={`text-xs text-muted-foreground ${item.checked ? 'line-through' : ''}`}>
                                                {item.brand}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value))}
                                            className="h-9 w-20 text-center"
                                            disabled={Boolean(item.checked)}
                                            min="0"
                                            step="0.1"
                                        />
                                        <span className={`text-sm w-12 text-muted-foreground ${item.checked ? 'line-through' : ''}`}>{item.unit}</span>
                                    </div>
                                    {item.price && item.price > 0 && item.quantity > 0 ? (
                                        <div className={`font-medium text-right w-24 tabular-nums ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                            {(item.price * item.quantity).toFixed(2)} {currency}
                                        </div>
                                    ) : (
                                        <div className="w-24" />
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground"/>
                                    </Button>
                                </li>
                            )) : (
                                <div className="text-center text-muted-foreground py-8">
                                    Your grocery list is empty. Add an item to get started!
                                </div>
                            )}
                        </ul>
                    </div>
                </CardContent>
            </Card>
            <AddGroceryItemDialog 
                open={isAddDialogOpen}
                onOpenChange={setAddDialogOpen}
                onAddItem={handleAddItem}
            />
        </>
    );
}
