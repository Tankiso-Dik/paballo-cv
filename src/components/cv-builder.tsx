"use client";

import dynamic from "next/dynamic";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CirclePlus,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Palette,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  defaultResumeValues,
  normalizeResumeData,
  resumeFormSchema,
  type ResumeFormValues,
} from "@/lib/resume-schema";
import { cn } from "@/lib/utils";

const DownloadCvButton = dynamic(
  () =>
    import("@/components/download-cv-button").then((module) => module.DownloadCvButton),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted">
        Preparing CV...
      </span>
    ),
  },
);

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
        checked
          ? "border-foreground bg-foreground text-background"
          : "border-line bg-white text-muted hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
          checked
            ? "border-white/60 bg-white/15 text-white"
            : "border-line bg-background text-transparent",
        )}
      >
        <Check className="h-3 w-3" />
      </span>
      {label}
    </button>
  );
}

function TextInput({
  label,
  helper,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="field-shell rounded-xl">
        <input
          {...props}
          className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted"
        />
      </span>
      {helper ? <span className="text-xs text-muted">{helper}</span> : null}
    </label>
  );
}

function TextareaInput({
  label,
  helper,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helper?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="field-shell rounded-xl">
        <textarea
          {...props}
          className="min-h-[96px] w-full resize-y rounded-xl bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted"
        />
      </span>
      {helper ? <span className="text-xs text-muted">{helper}</span> : null}
    </label>
  );
}

function AccordionSection({
  title,
  icon: Icon,
  summary,
  children,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-line bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 hover:bg-background">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-background text-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted">{summary}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <span className="hidden rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted sm:inline-flex">
            Tap to open
          </span>
          <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" />
        </div>
      </summary>
      <div className="border-t border-line px-4 py-4">{children}</div>
    </details>
  );
}

function RowShell({
  title,
  children,
  toggle,
  onRemove,
}: {
  title: string;
  children: React.ReactNode;
  toggle?: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="flex items-center gap-2">
          {toggle}
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-sm font-medium",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-line bg-white text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function CvBuilder() {
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: defaultResumeValues,
  });

  const values = useWatch({ control: form.control }) as ResumeFormValues;
  const data = normalizeResumeData(values ?? defaultResumeValues);

  const experienceArray = useFieldArray({ control: form.control, name: "experience.items" });
  const educationArray = useFieldArray({ control: form.control, name: "education.items" });
  const skillArray = useFieldArray({ control: form.control, name: "skills.items" });
  const projectArray = useFieldArray({ control: form.control, name: "projects.items" });
  const certificationArray = useFieldArray({
    control: form.control,
    name: "certifications.items",
  });
  const languageArray = useFieldArray({ control: form.control, name: "languages.items" });
  const referenceArray = useFieldArray({ control: form.control, name: "references.items" });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-5 lg:px-8">
      <section className="mb-6 rounded-2xl border border-line bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              {data.profile.fullName || "Candidate"}
            </h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DownloadCvButton
              data={data}
              label="Download CV"
              className="w-full"
            />
            <DownloadCvButton
              data={{
                ...data,
                meta: {
                  ...data.meta,
                  themeMode: "mono",
                },
              }}
              label="Download black and white"
              className="w-full border border-line bg-white text-foreground"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-4">
          <AccordionSection
            title="Profile"
            icon={UserRound}
            summary="These details appear in the top part of the CV: name, contact details, and the short profile paragraph."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Full name" helper="Shown as the main heading." {...form.register("profile.fullName")} />
              <TextInput label="Professional title" helper="Short label directly under the name." {...form.register("profile.professionalTitle")} />
              <TextInput label="Email" helper="Shown in the left info column." {...form.register("profile.email")} />
              <TextInput label="Phone" helper="Shown in the left info column." {...form.register("profile.phone")} />
              <TextInput label="Street address" helper="Shown in the address block." {...form.register("profile.streetAddress")} />
              <TextInput label="City / town" helper="Used in both address and education/work lines." {...form.register("profile.city")} />
              <TextInput label="Postal code" helper="Shown in the left info column." {...form.register("profile.postalCode")} />
              <TextInput label="Location line" helper="Used where one combined location line is needed." {...form.register("profile.location")} />
              <TextInput label="Date of birth" helper="Shown in the left info column." {...form.register("profile.dateOfBirth")} />
              <TextInput label="Gender" helper="Shown in the left info column." {...form.register("profile.gender")} />
              <TextInput label="Nationality" helper="Shown in the left info column." {...form.register("profile.nationality")} />
              <TextInput label="Target role" helper="Helps guide the wording, not shown as a big heading." {...form.register("meta.targetRole")} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Toggle
                checked={values.profile.summaryVisible}
                onChange={(next) => form.setValue("profile.summaryVisible", next)}
                label={values.profile.summaryVisible ? "Summary visible" : "Summary hidden"}
              />
            </div>
            <div className="mt-4">
              <TextareaInput
                label="Summary"
                helper="Keep it short and practical. This is the main paragraph under Profile."
                {...form.register("profile.summary")}
              />
            </div>
          </AccordionSection>

          <AccordionSection
            title="Education"
            icon={GraduationCap}
            summary="Each entry shows qualification, school, year, and a few supporting notes under Studies and certificates."
            action={
              <Toggle
                checked={values.education.visible}
                onChange={(next) => form.setValue("education.visible", next)}
                label={values.education.visible ? "Visible" : "Hidden"}
              />
            }
          >
            <div className="space-y-4">
              {educationArray.fields.map((field, index) => (
                <RowShell
                  key={field.id}
                  title={`Education ${index + 1}`}
                  toggle={
                    <Toggle
                      checked={values.education.items[index]?.enabled ?? true}
                      onChange={(next) => form.setValue(`education.items.${index}.enabled`, next)}
                      label={values.education.items[index]?.enabled ? "Included" : "Skipped"}
                    />
                  }
                  onRemove={educationArray.fields.length > 1 ? () => educationArray.remove(index) : undefined}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Qualification" helper="Example: National Senior Certificate." {...form.register(`education.items.${index}.qualification`)} />
                    <TextInput label="School or provider" helper="School, college, or training provider." {...form.register(`education.items.${index}.school`)} />
                    <TextInput label="Location" helper="This shows under the school name." {...form.register(`education.items.${index}.location`)} />
                    <TextInput label="End year / completion year" helper="Example: 2025." {...form.register(`education.items.${index}.endDate`)} />
                    <TextareaInput
                      className="md:col-span-2"
                      label="Notes"
                      helper="Each new line becomes another small note under this education entry."
                      {...form.register(`education.items.${index}.notes`)}
                    />
                  </div>
                </RowShell>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                educationArray.append({
                  enabled: true,
                  qualification: "",
                  school: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  notes: "",
                })
              }
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <CirclePlus className="h-4 w-4" />
              Add education
            </button>
          </AccordionSection>

          <AccordionSection
            title="Experience"
            icon={BriefcaseBusiness}
            summary="Each entry becomes: role title, employer, date line, location line, then short bullet-style details."
          >
            <div className="space-y-4">
              {experienceArray.fields.map((field, index) => (
                <RowShell
                  key={field.id}
                  title={`Experience ${index + 1}`}
                  onRemove={experienceArray.fields.length > 1 ? () => experienceArray.remove(index) : undefined}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Role title" helper="Example: Cashier, receptionist, volunteer helper." {...form.register(`experience.items.${index}.role`)} />
                    <TextInput label="Employer / place" helper="Company, organisation, school, church, or community group." {...form.register(`experience.items.${index}.company`)} />
                    <TextInput label="Location" helper="Usually town or city only." {...form.register(`experience.items.${index}.location`)} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput label="Start date" helper="Month/year or just year. Example: Jan 2024." {...form.register(`experience.items.${index}.startDate`)} />
                      <TextInput label="End date" helper="Use Present if it is current." {...form.register(`experience.items.${index}.endDate`)} />
                    </div>
                    <TextareaInput
                      className="md:col-span-2"
                      label="What did you do there?"
                      helper="Write one short line per task, strength, or result. Each line appears as a separate detail in the CV."
                      {...form.register(`experience.items.${index}.achievements`)}
                    />
                  </div>
                </RowShell>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                experienceArray.append({
                  enabled: true,
                  role: "",
                  company: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  achievements: "",
                })
              }
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <CirclePlus className="h-4 w-4" />
              Add experience
            </button>
          </AccordionSection>

          <AccordionSection
            title="Skills and languages"
            icon={Languages}
            summary="These appear in the left side of the CV, so keep them short and easy to scan."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Skills</h3>
                  <Toggle
                    checked={values.skills.visible}
                    onChange={(next) => form.setValue("skills.visible", next)}
                    label={values.skills.visible ? "Visible" : "Hidden"}
                  />
                </div>
                {skillArray.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Skill ${index + 1}`}
                    toggle={
                      <Toggle
                        checked={values.skills.items[index]?.enabled ?? true}
                        onChange={(next) => form.setValue(`skills.items.${index}.enabled`, next)}
                        label={values.skills.items[index]?.enabled ? "Included" : "Skipped"}
                      />
                    }
                    onRemove={skillArray.fields.length > 1 ? () => skillArray.remove(index) : undefined}
                  >
                    <TextInput label="Skill" helper="Keep it short, like communication or computer literacy." {...form.register(`skills.items.${index}.value`)} />
                  </RowShell>
                ))}
                <button
                  type="button"
                  onClick={() => skillArray.append({ enabled: true, value: "" })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <CirclePlus className="h-4 w-4" />
                  Add skill
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Languages</h3>
                  <Toggle
                    checked={values.languages.visible}
                    onChange={(next) => form.setValue("languages.visible", next)}
                    label={values.languages.visible ? "Visible" : "Hidden"}
                  />
                </div>
                {languageArray.fields.map((field, index) => (
                  <RowShell
                    key={field.id}
                    title={`Language ${index + 1}`}
                    toggle={
                      <Toggle
                        checked={values.languages.items[index]?.enabled ?? true}
                        onChange={(next) => form.setValue(`languages.items.${index}.enabled`, next)}
                        label={values.languages.items[index]?.enabled ? "Included" : "Skipped"}
                      />
                    }
                    onRemove={languageArray.fields.length > 1 ? () => languageArray.remove(index) : undefined}
                  >
                    <TextInput label="Language" helper="Example: English, Sesotho, Afrikaans." {...form.register(`languages.items.${index}.value`)} />
                  </RowShell>
                ))}
                <button
                  type="button"
                  onClick={() => languageArray.append({ enabled: true, value: "" })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <CirclePlus className="h-4 w-4" />
                  Add language
                </button>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            title="Extras"
            icon={FileText}
            summary="Useful if you want to make the CV feel fuller, or keep private notes while editing."
          >
            <div className="space-y-4">
              <TextareaInput
                label="Follow-up notes"
                helper="These notes stay in the form only."
                {...form.register("meta.followUpNotes")}
              />
              <TextareaInput
                label="Supporting document notes"
                helper="Keep what the ID or certificate confirms without forcing it into the CV."
                {...form.register("meta.supportingDocsNotes")}
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Projects",
                  visible: values.projects.visible,
                  onVisible: (next: boolean) => form.setValue("projects.visible", next),
                  fields: projectArray.fields,
                  append: () =>
                    projectArray.append({
                      enabled: true,
                      name: "",
                      role: "",
                      link: "",
                      summary: "",
                    }),
                  render: (index: number) => (
                    <div className="grid gap-3">
                      <TextInput label="Project name" {...form.register(`projects.items.${index}.name`)} />
                      <TextInput label="Role" {...form.register(`projects.items.${index}.role`)} />
                      <TextInput label="Link" {...form.register(`projects.items.${index}.link`)} />
                      <TextareaInput label="Summary" {...form.register(`projects.items.${index}.summary`)} />
                    </div>
                  ),
                  remove: (index: number) => projectArray.remove(index),
                  itemToggle: (index: number, next: boolean) =>
                    form.setValue(`projects.items.${index}.enabled`, next),
                  itemEnabled: (index: number) => values.projects.items[index]?.enabled ?? true,
                },
                {
                  title: "Certifications",
                  visible: values.certifications.visible,
                  onVisible: (next: boolean) => form.setValue("certifications.visible", next),
                  fields: certificationArray.fields,
                  append: () => certificationArray.append({ enabled: true, value: "" }),
                  render: (index: number) => (
                    <TextInput label="Certification" {...form.register(`certifications.items.${index}.value`)} />
                  ),
                  remove: (index: number) => certificationArray.remove(index),
                  itemToggle: (index: number, next: boolean) =>
                    form.setValue(`certifications.items.${index}.enabled`, next),
                  itemEnabled: (index: number) => values.certifications.items[index]?.enabled ?? true,
                },
                {
                  title: "References",
                  visible: values.references.visible,
                  onVisible: (next: boolean) => form.setValue("references.visible", next),
                  fields: referenceArray.fields,
                  append: () => referenceArray.append({ enabled: true, value: "" }),
                  render: (index: number) => (
                    <TextInput label="Reference line" {...form.register(`references.items.${index}.value`)} />
                  ),
                  remove: (index: number) => referenceArray.remove(index),
                  itemToggle: (index: number, next: boolean) =>
                    form.setValue(`references.items.${index}.enabled`, next),
                  itemEnabled: (index: number) => values.references.items[index]?.enabled ?? true,
                },
              ].map((group) => (
                <div key={group.title} className="rounded-xl border border-line bg-background p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-foreground">{group.title}</h3>
                    <Toggle
                      checked={group.visible}
                      onChange={group.onVisible}
                      label={group.visible ? "Visible" : "Hidden"}
                    />
                  </div>
                  <div className="space-y-3">
                    {group.fields.map((field, index) => (
                      <RowShell
                        key={field.id}
                        title={`${group.title} ${index + 1}`}
                        toggle={
                          <Toggle
                            checked={group.itemEnabled(index)}
                            onChange={(next) => group.itemToggle(index, next)}
                            label={group.itemEnabled(index) ? "Included" : "Skipped"}
                          />
                        }
                        onRemove={group.fields.length > 1 ? () => group.remove(index) : undefined}
                      >
                        {group.render(index)}
                      </RowShell>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={group.append}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <CirclePlus className="h-4 w-4" />
                    Add {group.title.slice(0, -1).toLowerCase()}
                  </button>
                </div>
              ))}
            </div>
          </AccordionSection>
        </div>

        <section className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-background">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Theme</h2>
                <p className="text-sm text-muted">Accent or monochrome.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ModeButton
                active={values.meta.themeMode === "accent"}
                label="Accent"
                onClick={() => form.setValue("meta.themeMode", "accent")}
              />
              <ModeButton
                active={values.meta.themeMode === "mono"}
                label="Black and white"
                onClick={() => form.setValue("meta.themeMode", "mono")}
              />
            </div>
            {values.meta.themeMode === "accent" ? (
              <div className="mt-4">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-background px-3 py-2.5">
                  <span className="text-sm font-medium text-foreground">Accent color</span>
                  <input
                    type="color"
                    value={values.meta.themeAccent}
                    onChange={(event) => form.setValue("meta.themeAccent", event.target.value)}
                    className="h-8 w-10 border-0 bg-transparent p-0"
                  />
                </label>
              </div>
            ) : null}
        </section>

        <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="text-base font-semibold text-foreground">Preview</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xl font-semibold text-foreground">
                  {data.profile.fullName}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {data.profile.professionalTitle || "Add a short title"}
                </p>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{data.profile.email || "Email still needed"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{data.profile.phone || "Phone still needed"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[data.profile.streetAddress, data.profile.city, data.profile.postalCode]
                      .filter(Boolean)
                      .join(", ") || "Address still needed"}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-background p-3 text-sm leading-6 text-foreground">
                {data.profile.summary}
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Education</p>
                  <p className="text-muted">
                    {data.education[0]
                      ? [data.education[0].qualification, data.education[0].school]
                          .filter(Boolean)
                          .join(", ")
                      : "No education entry yet"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Languages</p>
                  <p className="text-muted">
                    {data.languages.length ? data.languages.join(", ") : "No languages yet"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Experience</p>
                  <p className="text-muted">
                    {data.experience.length
                      ? `${data.experience.length} role${data.experience.length > 1 ? "s" : ""}`
                      : "Hidden for now"}
                  </p>
                </div>
              </div>
            </div>
        </section>
      </section>
    </main>
  );
}
