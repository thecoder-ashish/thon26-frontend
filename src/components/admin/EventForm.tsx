import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { TimePicker } from "@/components/admin/time/time-picker";
import { Button } from "@/components/ui/button";
import { X, Plus, Loader2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import axios from "axios";
import { useAuth } from "@/components/auth/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  event_name: z.string().min(4, "Event name must be at least 4 characters."),
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
  society_name: z.string().max(50),
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

type ImageUrls = {
  original: string | null;
  compressed: string | null;
};

export function EventsInputForm() {
  const [banner1Url, setBanner1Url] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      event_name: "",
      society_name: "",
      venue: "",
      registration_link: "",
      description: "",
      day_number: 1,
      time: "10:00:00",
      pocs: [{ name: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pocs",
  });

  const { user } = useAuth();

  const uploadToBackend = async (
    file: File,
    setBannerUrl: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<ImageUrls> => {
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
        setBannerUrl(original);
        return { original, compressed };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to upload banner image.",
      });
    }

    setBannerUrl(null);
    return { original: null, compressed: null };
  };

  async function onSubmit(data: z.infer<typeof EventFormSchema>) {
    setIsLoading(true);

    let banner1Response: ImageUrls = { original: null, compressed: null };
    if (selectedFile) {
      banner1Response = await uploadToBackend(selectedFile, setBanner1Url);
    }

    if (selectedFile && !banner1Response.original) {
      toast({
        title: "Upload Failed",
        variant: "destructive",
        description: "Banner image failed to upload. Event creation halted.",
      });
      setIsLoading(false);
      return;
    }

    const formDataWithImages = {
      ...data,
      banner_url_1: banner1Response.original,
      banner_url_1_compressed: banner1Response.compressed,
    };

    const token = user?.token;
    if (!token) {
      toast({
        title: "Unauthorized",
        variant: "destructive",
        description: "Admin is not authenticated. Please log in to continue.",
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
    axios
      .post(`${backendUrl}/registerevent`, formDataWithImages, config)
      .then((response) => {
        if (response.status === 200) {
          toast({ title: "Event Added Successfully!" });
          form.reset();
          setSelectedFile(null);
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: response.data?.message || "Failed to create event.",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: error.message || "Failed to connect to server.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-card border rounded-2xl shadow-sm space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-raleway">
          Create New Event
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to add a new event to the NSUTTHON festival schedule.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Event Name */}
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Event Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Code Odyssey 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Society Name */}
            <FormField
              control={form.control}
              name="society_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Society Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. IEEE NSUT, DebSoc..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Day Number */}
            <FormField
              control={form.control}
              name="day_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Festival Day *</FormLabel>
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

            {/* Event Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Event Time *</FormLabel>
                  <FormControl>
                    <TimePicker
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

            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Venue / Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Auditorium, Nescii Lawns" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Link */}
            <FormField
              control={form.control}
              name="registration_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Registration URL (Google Form / Unstop)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://forms.gle/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Description & Rules Rich Text Editor */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-bold">Event Description & Rules</FormLabel>
                <FormControl>
                  <div className="rounded-xl border overflow-hidden bg-background">
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
                      className="min-h-[160px]"
                      modules={modules}
                      formats={formats}
                      placeholder="Write detailed event overview, rounds, scoring rules, and guidelines..."
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 3: Single Banner & POCs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
            {/* Banner Upload */}
            <div className="space-y-3">
              <FormLabel className="font-bold block">Event Banner Poster</FormLabel>
              <p className="text-xs text-muted-foreground">
                Upload 1 square banner poster (1:1 aspect ratio).
              </p>
              <FileUpload onFileSelect={(file) => setSelectedFile(file)} />
            </div>

            {/* Event POC Contacts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="font-bold">Points of Contact (POCs)</FormLabel>
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold flex items-center gap-1"
                    onClick={() => append({ name: "", phone: "" })}
                  >
                    <Plus className="h-3 w-3" /> Add POC
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-3.5 border rounded-xl bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span>POC {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:underline flex items-center gap-1 text-xs"
                        >
                          <X className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`pocs.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Full Name" {...field} />
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
                              <Input placeholder="WhatsApp / Phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Submit Button */}
          <div className="pt-6 border-t flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-6 text-lg font-black font-raleway tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Publish Event"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EventsInputForm;
