"use client";

import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(client)/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(client)/_components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(client)/_components/ui/popover";
import { Calendar } from "@/app/(client)/_components/ui/calendar";
import { Textarea } from "@/app/(client)/_components/ui/textarea";
import { Input } from "@/app/(client)/_components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/app/(client)/_components/ui/switch";
import { Label } from "@/app/(client)/_components/ui/label";

// REACT_FORM_STEP_1 Imports
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../../_components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/app/_lib/utils";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

// REACT_FORM_STEP_2 Define form schema
const UserProfileSchema = z.object({
  bio: z.string().min(1, { message: "We want you to set a cute little bio" }),
  gender: z.enum(["Male", "Female", "Other"]),
  birthDate: z.date().optional(),
  privateProfile: z.boolean().optional(),
  emailMarketing: z.boolean().optional(),
});

interface ProfileProps {
  initialData?: any;
}

const Profile: React.FC<ProfileProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // REACT_FORM_STEP_3 Define your form.
  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      bio: initialData?.bio || undefined,
      gender: initialData?.gender || undefined,
      birthDate: initialData?.birthDate || undefined,
      privateProfile: initialData?.privateProfile || undefined,
      emailMarketing: initialData?.emailMarketing || undefined,
    },
  });

  // REACT_FORM_STEP_4 Define a submit handler. This will be type-safe and validated.
  async function onSubmit(values: z.infer<typeof UserProfileSchema>) {
    setLoading(true);
    axios
      .post("/api/profile", values)
      .then(() => {
        toast.success("Saved successfully!");
        router.refresh();
      })
      .catch((e) => toast.error(e?.response?.data || "Something went wrong!"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="container py-6 px-2 md:px-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={loading}
          onClick={form.handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </div>
      <div className="grid w-full items-center gap-5 my-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={initialData?.user?.name || "************"}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={initialData?.user?.email || "************"}
            disabled
          />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privateProfile"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Private Account</FormLabel>
                  <FormDescription>
                    This will hide your account details and posts from people
                    who you don&apos;t follow
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailMarketing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Receive Account updates on email</FormLabel>
                  <FormDescription>
                    This will enable all the emails related to
                    order/payment/account send to your mailbox
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default Profile;
