"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/TextField/TextField";
import { CloseIcon } from "@/components/ui/icons/close";
import type { UserProfileData } from "@/domain/user-profile";

export type ProfileEditModalProps = {
  profile: UserProfileData;
  onSave: (data: UserProfileData) => void;
  onClose: () => void;
};

type ProfileEditValues = {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
};

type ProfileEditErrors = Partial<Record<keyof ProfileEditValues, string>>;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function toValues(profile: UserProfileData): ProfileEditValues {
  return {
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    avatarUrl: profile.avatarUrl ?? "",
  };
}

function validateValues(values: ProfileEditValues): ProfileEditErrors {
  const errors: ProfileEditErrors = {};
  if (values.name.trim() === "") errors.name = "Ingresá tu nombre.";
  if (values.phone.trim() === "") errors.phone = "Ingresá tu teléfono.";
  if (values.email.trim() === "") {
    errors.email = "Ingresá tu email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }
  return errors;
}

export function ProfileEditModal({
  profile,
  onSave,
  onClose,
}: Readonly<ProfileEditModalProps>) {
  const [values, setValues] = useState<ProfileEditValues>(() => toValues(profile));
  const [errors, setErrors] = useState<ProfileEditErrors>({});
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const patchValue = (key: keyof ProfileEditValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (previous[key] === undefined) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleSave = () => {
    const nextErrors = validateValues(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const trimmedAvatar = values.avatarUrl.trim();
    onSave({
      id: profile.id,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      avatarUrl: trimmedAvatar === "" ? null : trimmedAvatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-modal"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              Editar datos
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Actualizá la información que ven los propietarios.
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <TextField
            ref={firstFieldRef}
            label="Nombre"
            required
            value={values.name}
            error={errors.name}
            onChange={(event) => patchValue("name", event.target.value)}
          />
          <TextField
            label="Teléfono"
            required
            type="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(event) => patchValue("phone", event.target.value)}
          />
          <TextField
            label="Email"
            required
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(event) => patchValue("email", event.target.value)}
          />
          <TextField
            label="Foto (URL)"
            value={values.avatarUrl}
            placeholder="https://…"
            helper="Opcional. Si la URL no carga, se muestran las iniciales."
            onChange={(event) => patchValue("avatarUrl", event.target.value)}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Cancelar
          </button>
          <Button type="button" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
