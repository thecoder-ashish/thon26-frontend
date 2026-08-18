import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { TimePicker } from "@/components/admin/time/time-picker";
import { Button } from "@/components/ui/button";
import { Pencil, X, Plus, Loader2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import axios from "axios";
import { useAuth } from "@/components/auth/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Time } from "@internationalized/date";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getBackendUrl } from "@/lib/api";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const EventFormSchema = z.object({
  event_name: z.string().min(2, "Event name must be at least 2 characters."),
  description: z.string().optional(),
  day_number: z.number().min(1, "Day number must be at least 1.").int(),
  time: z
    .string()
    .refine(
      (time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time),
      {
        message: "Invalid time format.",
        path: [],
      }
    ),
  venue: z.string().optional(),
  society_name: z.string().max(50).optional(),
  pocs: z
    .array(
      z.object({
        name: z.string().max(40).optional(),
        phone: z.string().max(14).optional(),
      })
    )
    .max(3, "You can add up to 3 POCs only."),
  banner_url_1: z.string().optional(),
  banner_url_1_compressed: z.string().optional(),
  registration_link: z.string().optional(),
});

interface EventsEditFormProps {
  eventData: any;
  onEventUpdated?: () => void;
}

const parseTimeToTimeObject = (timeStr?: string) => {
  if (!timeStr) return new Time(10, 0);
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return new Time(isNaN(h) ? 10 : h, isNaN(m) ? 0 : m);
};

export function EventsEditForm({ eventData, onEventUpdated }: EventsEditFormProps) {
  const [open, setOpen] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const getPocsInitial = () => {
    const pocs = [];
    if (eventData.name_poc_1 || eventData.phone_poc_1) {
      pocs.push({
        name: eventData.name_poc_1 || "",
        phone: eventData.phone_poc_1 || "",
      });
    }
    if (eventData.name_poc_2 || eventData.phone_poc_2) {
      pocs.push({
        name: eventData.name_poc_2 || "",
        phone: eventData.phone_poc_2 || "",
      });
    }
    if (eventData.name_poc_3 || eventData.phone_poc_3) {
      pocs.push({
        name: eventData.name_poc_3 || "",
        phone: eventData.phone_poc_3 || "",
      });
    }
    return pocs.length > 0 ? pocs : [{ name: "", phone: "" }];
  };

  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      event_name: eventData.event_name || "",
      society_name: eventData.society_name || "",
      venue: eventData.venue || "",
      registration_link: eventData.registration_link || "",
      description: eventData.description || "",
      day_number: eventData.day_number || 1,
      time: eventData.time || "10:00:00",
      pocs: getPocsInitial(),
    },
  });

  useEffect(() => {
    if (open && eventData) {
      form.reset({
        event_name: eventData.event_name || "",
        society_name: eventData.society_name || "",
        venue: eventData.venue || "",
        registration_link: eventData.registration_link || "",
        description: eventData.description || "",
        day_number: eventData.day_number || 1,
        time: eventData.time || "10:00:00",
        pocs: getPocsInitial(),
      });
      setSelectedFile(null);
      setBannerUrl(null);
    }
  }, [open, eventData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pocs",
  });

  const uploadToBackend = async (
    file: File,
    setBanner: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const backendUrl = getBackendUrl();
      const response = await axios.post(`${backendUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const { original, compressed } = response.data;
        setBanner(original);
        return { original, compressed };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        variant: "destructive",
        description: "Failed to upload banner image.",
      });
    }

    setBanner(null);
    return { original: null, compressed: null };
  };

  async function onSubmit(data: z.infer<typeof EventFormSchema>) {
    setIsLoading(true);

    let bannerResponse: any = { original: null, compressed: null };
    if (selectedFile) {
      bannerResponse = await uploadToBackend(selectedFile, setBannerUrl);
    }

    const formDataWithImages: any = {
      ...data,
    };

    if (bannerResponse.original) {
      formDataWithImages.banner_url_1 = bannerResponse.original;
      formDataWithImages.banner_url_1_compressed = bannerResponse.compressed;
    }

    const token = user?.token;
    if (!token) {
      toast({
        title: "Unauthorized",
        variant: "destructive",
        description: "Admin is not authenticated. Please log in.",
      });
      setIsLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const backendUrl = getBackendUrl();
    try {
      const response = await axios.put(
        `${backendUrl}/editevent/${eventData.event_id}`,
        formDataWithImages,
        config
      );

      if (response.status === 200) {
        toast({
          title: "Event Updated!",
          description: "Changes saved successfully.",
        });
        setOpen(false);
        if (onEventUpdated) {
          onEventUpdated();
        }
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Update Failed",
        variant: "destructive",
        description: error.response?.data?.message || "Failed to update event.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const initialTimeObj = parseTimeToTimeObject(eventData.time);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 font-bold flex items-center gap-1 hover:bg-muted text-xs"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-raleway">
            Edit Event: {eventData.event_name}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            {/* Grid 1: Basic Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Event Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="society_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Society Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Society Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="day_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Day *</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value ? field.value.toString() : "1"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">Day 1</SelectItem>
                            <SelectItem value="2">Day 2</SelectItem>
                            <SelectItem value="3">Day 3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Time *</FormLabel>
                    <FormControl>
                      <TimePicker
                        key={`${eventData.event_id}-${eventData.time}-${open}`}
                        defaultValue={initialTimeObj}
                        onChange={(value) => {
                          const formattedTime = `${String(value.hour).padStart(
                            2,
                            "0"
                          )}:${String(value.minute).padStart(2, "0")}:00`;
                          field.onChange(formattedTime);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs">Registration URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Registration Link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Editor */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-bold text-xs">Description & Rules</FormLabel>
                  <FormControl>
                    <div className="rounded-lg border overflow-hidden bg-background">
                      <ReactQuill
                        value={field.value || ""}
                        onChange={(content) => {
                          field.onChange({
                            target: {
                              name: field.name,
                              value: content,
                            },
                          });
                        }}
                        className="min-h-[140px]"
                        modules={modules}
                        formats={formats}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* POC Contacts */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <FormLabel className="font-bold text-xs">Points of Contact</FormLabel>
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-bold"
                    onClick={() => append({ name: "", phone: "" })}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add POC
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2.5 border rounded-lg bg-muted/20"
                  >
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <FormField
                        control={form.control}
                        name={`pocs.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="POC Name" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pocs.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="POC Phone" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-700"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Banner Replacement */}
            <div className="space-y-2 pt-2 border-t">
              <FormLabel className="font-bold text-xs block">Replace Banner Poster (Optional)</FormLabel>
              <FileUpload onFileSelect={(file) => setSelectedFile(file)} />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="font-bold px-6">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EventsEditForm;
