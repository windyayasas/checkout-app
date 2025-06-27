"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Landmark } from 'lucide-react';
import { useFamily } from '@/context/family-context';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  currency: z.string().min(2, {
    message: 'Please select a currency.',
  }),
});

export function SettingsForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { currency, setCurrency } = useFamily();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: currency,
    },
  });
  
  React.useEffect(() => {
    form.setValue('currency', currency);
  }, [currency, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrency(values.currency);
    toast({
      title: "Settings Saved",
      description: `Your currency has been updated to ${values.currency}.`,
    });
    router.push('/dashboard');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <div className="relative">
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                         <div className="flex items-center gap-2">
                           <Landmark className="h-5 w-5 text-muted-foreground" />
                           <SelectValue placeholder="Select your currency" />
                         </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - United States Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="LKR">LKR - Sri Lankan Rupee</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
