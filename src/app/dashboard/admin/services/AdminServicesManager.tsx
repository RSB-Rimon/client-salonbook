"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { BriefcaseBusiness, ImagePlus, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const serviceFormSchema = z.object({
  serviceName: z.string().trim().min(2, "Enter a service name.").max(100, "Service name must be under 100 characters."),
  category: z.string().trim().min(2, "Enter a category.").max(60, "Category must be under 60 characters."),
  description: z.string().trim().min(10, "Add a short service description.").max(1500, "Description must be under 1500 characters."),
  price: z.coerce.number().positive("Price must be greater than zero."),
  duration: z.coerce.number().int("Duration must be a whole number of minutes.").positive("Duration must be greater than zero."),
});

type SalonService = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

async function getAdminToken() {
  const result = await authClient.$fetch("/token", { method: "GET" });
  if (result.error) {
    throw new Error(result.error.message || "Your sign-in has expired. Please sign in again.");
  }

  const tokenData = result.data as { token?: string } | null;
  if (!tokenData?.token) {
    throw new Error("Could not verify your admin session. Please sign in again.");
  }

  return tokenData.token;
}

async function readResponse<T>(response: Response): Promise<T> {
  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof responseData.message === "string"
        ? responseData.message
        : "The request could not be completed.";
    throw new Error(message);
  }
  return responseData as T;
}

export default function AdminServicesManager() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState("");
  const [editingService, setEditingService] = useState<SalonService | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const loadServices = useCallback(async () => {
    try {
      const token = await getAdminToken();
      const response = await fetch(API_BASE_URL + "/api/admin/services", {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
      });
      const result = await readResponse<{ services: SalonService[] }>(response);
      setServices(result.services);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load salon services.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadServices();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadServices]);

  async function handleSaveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);
    const values = serviceFormSchema.safeParse({
      serviceName: formData.get("serviceName"),
      category: formData.get("category"),
      description: formData.get("description"),
      price: formData.get("price"),
      duration: formData.get("duration"),
    });

    if (!values.success) {
      setErrorMessage(values.error.issues[0]?.message || "Check the service details.");
      return;
    }

    const imageEntry = formData.get("image");
    const imageFile =
      imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;

    if (!editingService && !imageFile) {
      setErrorMessage("Choose an image for this service.");
      return;
    }

    if (imageFile && !ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      setErrorMessage("Choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
      setErrorMessage("The image must be 5 MB or smaller.");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getAdminToken();
      let imageUrl = editingService?.image;

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);
        const imageResponse = await fetch(API_BASE_URL + "/api/admin/service-images", {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: imageData,
        });
        const uploadedImage = await readResponse<{ imageUrl: string }>(imageResponse);
        imageUrl = uploadedImage.imageUrl;
      }

      const serviceData: ServiceFormValues & { image?: string } = {
        ...values.data,
        ...(imageUrl ? { image: imageUrl } : {}),
      };
      const endpoint = editingService
        ? API_BASE_URL + "/api/admin/services/" + editingService._id
        : API_BASE_URL + "/api/admin/services";
      const response = await fetch(endpoint, {
        method: editingService ? "PATCH" : "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      const result = await readResponse<{ service: SalonService }>(response);

      setServices((currentServices) => {
        if (editingService) {
          return currentServices.map((service) =>
            service._id === result.service._id ? result.service : service
          );
        }
        return [result.service, ...currentServices];
      });
      setSuccessMessage(editingService ? "Service details updated." : "Service added successfully.");
      setEditingService(null);
      formRef.current?.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save this service.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(service: SalonService) {
    setErrorMessage("");
    setSuccessMessage("");
    setPendingServiceId(service._id);
    try {
      const token = await getAdminToken();
      const nextStatus = service.status === "active" ? "inactive" : "active";
      const response = await fetch(API_BASE_URL + "/api/admin/services/" + service._id, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await readResponse<{ service: SalonService }>(response);
      setServices((currentServices) =>
        currentServices.map((item) =>
          item._id === result.service._id ? result.service : item
        )
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not update service status.");
    } finally {
      setPendingServiceId("");
    }
  }

  async function handleDeleteService(service: SalonService) {
    if (!window.confirm("Delete " + service.serviceName + "? This cannot be undone.")) return;

    setErrorMessage("");
    setSuccessMessage("");
    setPendingServiceId(service._id);
    try {
      const token = await getAdminToken();
      const response = await fetch(API_BASE_URL + "/api/admin/services/" + service._id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      await readResponse<{ message: string }>(response);
      setServices((currentServices) =>
        currentServices.filter((item) => item._id !== service._id)
      );
      setSuccessMessage("Service deleted.");
      if (editingService?._id === service._id) {
        setEditingService(null);
        formRef.current?.reset();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not delete this service.");
    } finally {
      setPendingServiceId("");
    }
  }

  function startEditing(service: SalonService) {
    setEditingService(service);
    setSuccessMessage("");
    setErrorMessage("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function cancelEditing() {
    setEditingService(null);
    setErrorMessage("");
    formRef.current?.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl bg-[#493126] px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8c9ad]">Admin workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Manage salon services</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f0e2d7]">
          Add, update, and organize the services customers can browse and book.
        </p>
      </section>

      <section className="scroll-mt-6 rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7eee6] text-[#7b4e39]">
            {editingService ? <Pencil size={19} /> : <Plus size={20} />}
          </span>
          <div>
            <h2 className="text-xl font-semibold text-[#38251e]">
              {editingService ? "Edit service" : "Add a service"}
            </h2>
            <p className="mt-1 text-sm text-[#77665c]">
              {editingService ? "Update the details below. Choose a new image only if you want to replace it." : "Enter service details and upload a JPG, PNG, or WEBP image."}
            </p>
          </div>
        </div>

        {errorMessage && (
          <p className="mb-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4236]" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mb-5 rounded-xl bg-[#eef7ed] px-4 py-3 text-sm text-[#47734c]" role="status">
            {successMessage}
          </p>
        )}

        <form
          key={editingService?._id || "new-service"}
          ref={formRef}
          className="grid gap-5 md:grid-cols-2"
          onSubmit={handleSaveService}
        >
          <div>
            <Label htmlFor="serviceName">Service name</Label>
            <Input id="serviceName" name="serviceName" placeholder="e.g. Signature haircut" defaultValue={editingService?.serviceName} required minLength={2} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g. Hair" defaultValue={editingService?.category} required maxLength={60} />
          </div>
          <div>
            <Label htmlFor="price">Price (BDT)</Label>
            <Input id="price" name="price" type="number" min="1" step="0.01" placeholder="1200" defaultValue={editingService?.price} required />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" name="duration" type="number" min="1" step="1" placeholder="45" defaultValue={editingService?.duration} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={editingService?.description}
              required
              minLength={10}
              maxLength={1500}
              rows={4}
              placeholder="Describe what the customer can expect from this service."
              className="w-full resize-y rounded-xl border border-[#e6d9cd] bg-[#fffdfa] px-4 py-3 text-sm text-[#38251e] outline-none transition placeholder:text-[#ad9c90] focus-visible:border-[#9b6a4e] focus-visible:ring-4 focus-visible:ring-[#9b6a4e]/10"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="image">
              Service image {editingService && <span className="font-normal text-[#9b8a7e]">(optional when editing)</span>}
            </Label>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#d9c6b7] bg-[#fffdfa] p-4 sm:flex-row sm:items-center">
              <ImagePlus className="shrink-0 text-[#9b6a4e]" size={21} />
              <Input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!editingService} className="border-0 bg-transparent px-0 focus-visible:ring-0" />
              <p className="shrink-0 text-xs text-[#88766a]">Up to 5 MB</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button className="h-11 rounded-full bg-[#6e4434] px-6 text-white hover:bg-[#543326]" type="submit" disabled={isSaving}>
              {isSaving && <LoaderCircle className="animate-spin" />}
              {isSaving ? "Saving…" : editingService ? "Save changes" : "Add service"}
            </Button>
            {editingService && (
              <Button type="button" variant="outline" className="h-11 rounded-full px-6" onClick={cancelEditing} disabled={isSaving}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#38251e]">Your services</h2>
            <p className="mt-1 text-sm text-[#77665c]">{services.length} service{services.length === 1 ? "" : "s"} in the salon catalog</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => { setErrorMessage(""); void loadServices(); }} disabled={isLoading}>
            Refresh list
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#eadfd3] bg-white p-8 text-sm text-[#77665c]">
            <LoaderCircle className="animate-spin" size={18} /> Loading services…
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c6b7] bg-white px-6 py-12 text-center">
            <BriefcaseBusiness className="mx-auto text-[#a0755e]" size={28} />
            <h3 className="mt-3 font-semibold text-[#38251e]">No services yet</h3>
            <p className="mt-1 text-sm text-[#77665c]">Add your first salon service using the form above.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {services.map((service) => (
              <article key={service._id} className="overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm sm:flex">
                <div className="relative h-48 bg-[#f7eee6] sm:h-auto sm:min-h-[220px] sm:w-44 sm:shrink-0">
                  <Image src={service.image} alt={service.serviceName} fill unoptimized className="object-cover" sizes="176px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a0755e]">{service.category}</span>
                      <h3 className="mt-1 text-lg font-semibold text-[#38251e]">{service.serviceName}</h3>
                    </div>
                    <span className={service.status === "active" ? "rounded-full bg-[#eef7ed] px-3 py-1 text-xs font-semibold text-[#47734c]" : "rounded-full bg-[#f2eee9] px-3 py-1 text-xs font-semibold text-[#77665c]"}>
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#77665c]">{service.description}</p>
                  <p className="mt-3 text-sm font-semibold text-[#493126]">
                    ৳{service.price.toLocaleString("en-BD")} <span className="font-normal text-[#88766a]">· {service.duration} min</span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => startEditing(service)}>
                      <Pencil /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => void handleStatusChange(service)} disabled={pendingServiceId === service._id}>
                      {pendingServiceId === service._id ? "Updating…" : service.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="destructive" size="sm" className="rounded-full" onClick={() => void handleDeleteService(service)} disabled={pendingServiceId === service._id}>
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
