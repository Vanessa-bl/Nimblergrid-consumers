"use client";

import { memo, useId, type ReactNode } from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { EditIcon } from "@/components/ui/icons/edit";
import { MailIcon } from "@/components/ui/icons/mail";
import { PhoneIcon } from "@/components/ui/icons/phone";
import type { UserProfileCardProps, UserProfileData } from "./UserProfileCard.types";

const focusVisibleClasses =
  "rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

type ProfileHeaderProps = {
  id: string;
  title: string;
  description?: string;
};

function ProfileHeader({ id, title, description }: Readonly<ProfileHeaderProps>) {
  const hasDescription = description !== undefined && description.trim() !== "";
  return (
    <header>
      <h2
        id={id}
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        {title}
      </h2>
      {hasDescription ? (
        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
      ) : null}
    </header>
  );
}

function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando tus datos"
      className="mt-5 animate-pulse"
    >
      <div className="flex items-start gap-4">
        <div className="h-[72px] w-[72px] shrink-0 rounded-full bg-zinc-200" />
        <div className="min-w-0 flex-1 space-y-2.5 pt-1.5">
          <div className="h-4 w-1/2 rounded-md bg-zinc-200" />
          <div className="h-3.5 w-2/3 rounded-md bg-zinc-100" />
          <div className="h-3.5 w-1/3 rounded-md bg-zinc-100" />
        </div>
      </div>
      <div className="mt-5 border-t border-zinc-200 pt-4">
        <div className="h-4 w-24 rounded-md bg-zinc-200" />
      </div>
    </div>
  );
}

function ProfileEmptyState() {
  return (
    <p className="mt-5 rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm leading-relaxed text-zinc-500">
      Todavía no hay datos de contacto para mostrar.
    </p>
  );
}

type ContactRowProps = {
  icon: ReactNode;
  value: string;
};

function ContactRow({ icon, value }: Readonly<ContactRowProps>) {
  if (value.trim() === "") return null;
  return (
    <p className="mt-1.5 flex items-center gap-2 text-sm text-zinc-600">
      <span aria-hidden="true" className="shrink-0 text-zinc-400">
        {icon}
      </span>
      <span className="truncate">{value}</span>
    </p>
  );
}

type ProfileContactRowsProps = {
  name: string;
  phone: string;
  email: string;
};

function ProfileContactRows({
  name,
  phone,
  email,
}: Readonly<ProfileContactRowsProps>) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-base font-semibold text-zinc-900">{name}</h3>
      <ContactRow icon={<PhoneIcon className="h-4 w-4" />} value={phone} />
      <ContactRow icon={<MailIcon className="h-4 w-4" />} value={email} />
    </div>
  );
}

type ProfileContentProps = {
  data: UserProfileData;
  onEdit?: (data: UserProfileData) => void;
};

function ProfileContent({ data, onEdit }: Readonly<ProfileContentProps>) {
  return (
    <>
      <div className="mt-5 flex items-start gap-4">
        <Avatar
          name={data.name}
          avatarUrl={data.avatarUrl}
          size="lg"
          alt=""
        />
        <ProfileContactRows
          name={data.name}
          phone={data.phone}
          email={data.email}
        />
      </div>
      {onEdit !== undefined ? (
        <footer className="mt-5 border-t border-zinc-200 pt-4">
          <button
            type="button"
            onClick={() => onEdit(data)}
            className={`inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 ${focusVisibleClasses}`}
          >
            <EditIcon className="h-4 w-4" />
            Editar datos
          </button>
        </footer>
      ) : null}
    </>
  );
}

export const UserProfileCard = memo(function UserProfileCard(
  props: Readonly<UserProfileCardProps>,
) {
  const {
    data = null,
    title = "Tus datos",
    description,
    onEdit,
    isLoading = false,
    className,
  } = props;

  const titleId = useId();
  const cardClassName = [
    "rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_2px_10px_-6px_rgba(24,24,27,0.10)] sm:p-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let body: ReactNode;
  if (isLoading) {
    body = <ProfileSkeleton />;
  } else if (data === null) {
    body = <ProfileEmptyState />;
  } else {
    body = <ProfileContent data={data} onEdit={onEdit} />;
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isLoading}
      className={cardClassName}
    >
      <ProfileHeader id={titleId} title={title} description={description} />
      {body}
    </section>
  );
});
