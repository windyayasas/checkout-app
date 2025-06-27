"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFamily } from '@/context/family-context';
import { AddGroceryItemDialog, GroceryItemFormValues } from './add-grocery-item-dialog';

interface Item {
    id: number;
    name: string;
    checked: boolean;
    quantity: number;
    unit: string;
    brand?: string;
    price?: number;
}

const initialItems: Item[] = [
    { id: 1, name: 'Milk', checked: false, quantity: 1, unit: 'ltr', brand: 'Highland', price: 2.50 },
    { id: 2, name: 'Bread', checked: true, quantity: 1, unit: 'pcs', price: 1.80 },
    { id: 3, name: 'Eggs', checked: false, quantity: 12, unit: 'pcs', brand: 'Happy Farms', price: 0.35 },
    { id: 4, name: 'Apples', checked: false, quantity: 2, unit: 'kg', price: 3.00 },
];

export function GroceryList() {
    const { selectedFamily, currency } = useFamily();
    const [items, setItems] = React.useState<Item[]>(initialItems);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

    const handleAddItem = (newItem: GroceryItemFormValues) => {
        const newItemObject: Item = {
            id: Date.now(),
            ...newItem,
            checked: false,
        };
        setItems(prev => [newItemObject, ...prev]);
    };
    
    const handleToggleItem = (itemId: number) => {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item));
    };

    const handleRemoveItem = (itemId: number) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (isNaN(newQuantity) || newQuantity < 0) return;
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
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
                                        checked={item.checked} 
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
                                            disabled={item.checked}
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
