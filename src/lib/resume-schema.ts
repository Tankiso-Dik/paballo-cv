import { z } from "zod";
import { compactText } from "@/lib/utils";

const optionalText = z.string().max(3000).default("");
const shortText = z.string().max(160).default("");

const bulletList = z
  .string()
  .max(3000)
  .default("")
  .transform((value) =>
    value
      .split("\n")
      .map((line) => line.replace(/^[\-\u2022*\s]+/, "").trim())
      .filter(Boolean),
  );

const skillSchema = z.object({
  enabled: z.boolean(),
  value: z.string().max(80).default(""),
});

const experienceSchema = z.object({
  enabled: z.boolean(),
  role: shortText,
  company: shortText,
  location: shortText,
  startDate: shortText,
  endDate: shortText,
  achievements: z.string().max(2500).default(""),
});

const educationSchema = z.object({
  enabled: z.boolean(),
  qualification: shortText,
  school: shortText,
  location: shortText,
  startDate: shortText,
  endDate: shortText,
  notes: z.string().max(1200).default(""),
});

const projectSchema = z.object({
  enabled: z.boolean(),
  name: shortText,
  role: shortText,
  link: shortText,
  summary: z.string().max(1200).default(""),
});

const extraLineSchema = z.object({
  enabled: z.boolean(),
  value: shortText,
});

export const resumeFormSchema = z.object({
  meta: z.object({
    targetRole: shortText,
    candidateLabel: shortText,
    themeMode: z.enum(["accent", "mono"]).default("accent"),
    themeAccent: z.string().max(20).default("#2D7A5E"),
    followUpNotes: optionalText,
    supportingDocsNotes: optionalText,
  }),
  profile: z.object({
    fullName: z.string().max(120).default(""),
    professionalTitle: shortText,
    email: shortText,
    phone: shortText,
    streetAddress: shortText,
    postalCode: shortText,
    city: shortText,
    location: shortText,
    dateOfBirth: shortText,
    gender: shortText,
    nationality: shortText,
    website: shortText,
    linkedin: shortText,
    summaryVisible: z.boolean(),
    summary: optionalText,
  }),
  skills: z.object({
    visible: z.boolean(),
    items: z.array(skillSchema).min(1),
  }),
  experience: z.object({
    visible: z.boolean(),
    items: z.array(experienceSchema).min(1),
  }),
  education: z.object({
    visible: z.boolean(),
    items: z.array(educationSchema).min(1),
  }),
  projects: z.object({
    visible: z.boolean(),
    items: z.array(projectSchema).min(1),
  }),
  certifications: z.object({
    visible: z.boolean(),
    items: z.array(extraLineSchema).min(1),
  }),
  languages: z.object({
    visible: z.boolean(),
    items: z.array(extraLineSchema).min(1),
  }),
  references: z.object({
    visible: z.boolean(),
    items: z.array(extraLineSchema).min(1),
  }),
});

export type ResumeFormValues = z.input<typeof resumeFormSchema>;

export type ResumeDocumentData = {
  meta: {
    targetRole: string;
    candidateLabel: string;
    themeMode: "accent" | "mono";
    themeAccent: string;
    followUpNotes: string;
    supportingDocsNotes: string;
  };
  profile: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    location: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    location: string;
    range: string;
    bullets: string[];
  }>;
  education: Array<{
    qualification: string;
    school: string;
    location: string;
    range: string;
    notes: string[];
  }>;
  projects: Array<{
    name: string;
    role: string;
    link: string;
    bullets: string[];
  }>;
  certifications: string[];
  languages: string[];
  references: string[];
};

export const defaultResumeValues: ResumeFormValues = {
  meta: {
    targetRole: "Entry-level role",
    candidateLabel: "Paballo Monica Mpela intake draft",
    themeMode: "accent",
    themeAccent: "#2D7A5E",
    followUpNotes:
      "Still needed from the candidate: mobile number, email address, physical address, preferred job target, personal summary, and any work or volunteer experience.",
    supportingDocsNotes:
      "Supporting documents on hand: South African national identity card and National Senior Certificate statement of results (November 2025). These support identity, date of birth, nationality, and matric completion but do not need to be forced into the CV beyond what is useful.",
  },
  profile: {
    fullName: "Paballo Monica Mpela",
    professionalTitle: "Matric graduate",
    email: "paballo.mpela@example.com",
    phone: "+27 63 000 0000",
    streetAddress: "Mangaung",
    postalCode: "9301",
    city: "Bloemfontein",
    location: "Bloemfontein, Free State, South Africa",
    dateOfBirth: "26/02/2007",
    gender: "Female",
    nationality: "South African",
    website: "portfolio.example.com",
    linkedin: "linkedin.com/in/paballo-mpela",
    summaryVisible: true,
    summary:
      "Motivated matric graduate seeking an entry-level opportunity to build practical experience, contribute reliably, and continue learning in a structured work environment. Ready to grow, take responsibility, and develop strong workplace skills.",
  },
  skills: {
    visible: true,
    items: [
      { enabled: true, value: "Basic computer literacy" },
      { enabled: true, value: "Strong written communication" },
      { enabled: true, value: "Reliable time management" },
      { enabled: true, value: "Team cooperation" },
      { enabled: true, value: "Customer-facing confidence" },
      { enabled: true, value: "Problem solving" },
    ],
  },
  experience: {
    visible: true,
    items: [
      {
        enabled: true,
        role: "Example customer service assistant",
        company: "Replace with actual employer",
        location: "Bloemfontein",
        startDate: "2024",
        endDate: "Present",
        achievements:
          "Assisted customers in person and helped direct queries to the right person quickly.\nKept work areas organised and supported day-to-day administrative or support tasks.\nWorked well with others, followed instructions carefully, and handled tasks reliably.",
      },
      {
        enabled: true,
        role: "Example school or community support role",
        company: "Replace with actual school, church, or volunteer group",
        location: "Bloemfontein",
        startDate: "2023",
        endDate: "2024",
        achievements:
          "Helped with event preparation, basic record keeping, or coordinating people during activities.\nSupported communication with learners, visitors, or community members in a respectful manner.\nBuilt confidence in teamwork, responsibility, and consistent attendance.",
      },
    ],
  },
  education: {
    visible: true,
    items: [
      {
        enabled: true,
        qualification: "National Senior Certificate",
        school: "St Bernard's Secondary School",
        location: "Bloemfontein",
        startDate: "2021",
        endDate: "2025",
        notes:
          "Statement of results available for November 2025.\nStrong subjects visible on the supplied result include Sesotho Home Language, English First Additional Language, Life Orientation, Agricultural Technology, Life Sciences, and Physical Sciences.\nVisible percentages on the supplied image appear to include 88 for Sesotho Home Language, 90 for English First Additional Language, 76 for Afrikaans First Additional Language, 63 for Mathematics, 95 for Life Orientation, 80 for Agricultural Technology, 82 for Life Sciences, and 67 for Physical Sciences. Confirm against the original document before final use.",
      },
    ],
  },
  projects: {
    visible: true,
    items: [
      {
        enabled: true,
        name: "School support example",
        role: "Learner helper",
        link: "https://example.com/paballo-project",
        summary:
          "Replace this with a school, community, church, or side project.\nKeep each line short and factual.",
      },
      {
        enabled: true,
        name: "Academic focus example",
        role: "Science and language learner",
        link: "https://example.com/academic-profile",
        summary:
          "Use this section if the candidate has no formal work history yet.\nMention academic strengths, leadership, tutoring, peer support, or school participation.\nReplace this example text with real details from the candidate.",
      },
    ],
  },
  certifications: {
    visible: true,
    items: [
      { enabled: true, value: "National Senior Certificate, 2025" },
      { enabled: true, value: "South African ID available for verification" },
    ],
  },
  languages: {
    visible: true,
    items: [
      { enabled: true, value: "English" },
      { enabled: true, value: "Sesotho" },
      { enabled: true, value: "Afrikaans" },
    ],
  },
  references: {
    visible: true,
    items: [
      { enabled: true, value: "Reference 1: Replace with teacher, mentor, or supervisor" },
      { enabled: true, value: "Reference 2: Available on request" },
    ],
  },
};

function isMeaningful(value: string) {
  return compactText(value).length > 0;
}

function combineDates(startDate: string, endDate: string) {
  const start = compactText(startDate);
  const end = compactText(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end;
}

export function normalizeResumeData(values: ResumeFormValues): ResumeDocumentData {
  const parsed = resumeFormSchema.parse(values);

  return {
    meta: {
      targetRole: compactText(parsed.meta.targetRole),
      candidateLabel: compactText(parsed.meta.candidateLabel),
      themeMode: parsed.meta.themeMode,
      themeAccent: compactText(parsed.meta.themeAccent) || "#2D7A5E",
      followUpNotes: compactText(parsed.meta.followUpNotes),
      supportingDocsNotes: compactText(parsed.meta.supportingDocsNotes),
    },
    profile: {
      fullName: compactText(parsed.profile.fullName),
      professionalTitle: compactText(parsed.profile.professionalTitle),
      email: compactText(parsed.profile.email),
      phone: compactText(parsed.profile.phone),
      streetAddress: compactText(parsed.profile.streetAddress),
      postalCode: compactText(parsed.profile.postalCode),
      city: compactText(parsed.profile.city),
      location: compactText(parsed.profile.location),
      dateOfBirth: compactText(parsed.profile.dateOfBirth),
      gender: compactText(parsed.profile.gender),
      nationality: compactText(parsed.profile.nationality),
      website: compactText(parsed.profile.website),
      linkedin: compactText(parsed.profile.linkedin),
      summary: parsed.profile.summaryVisible
        ? compactText(parsed.profile.summary)
        : "",
    },
    skills: parsed.skills.visible
      ? parsed.skills.items
          .filter((item) => item.enabled && isMeaningful(item.value))
          .map((item) => compactText(item.value))
      : [],
    experience: parsed.experience.visible
      ? parsed.experience.items
          .filter(
            (item) =>
              item.enabled &&
              [item.role, item.company, item.achievements].some(isMeaningful),
          )
          .map((item) => ({
            role: compactText(item.role),
            company: compactText(item.company),
            location: compactText(item.location),
            range: combineDates(item.startDate, item.endDate),
            bullets: bulletList.parse(item.achievements),
          }))
      : [],
    education: parsed.education.visible
      ? parsed.education.items
          .filter(
            (item) =>
              item.enabled &&
              [item.qualification, item.school, item.notes].some(isMeaningful),
          )
          .map((item) => ({
            qualification: compactText(item.qualification),
            school: compactText(item.school),
            location: compactText(item.location),
            range: combineDates(item.startDate, item.endDate),
            notes: bulletList.parse(item.notes),
          }))
      : [],
    projects: parsed.projects.visible
      ? parsed.projects.items
          .filter(
            (item) =>
              item.enabled &&
              [item.name, item.role, item.summary, item.link].some(isMeaningful),
          )
          .map((item) => ({
            name: compactText(item.name),
            role: compactText(item.role),
            link: compactText(item.link),
            bullets: bulletList.parse(item.summary),
          }))
      : [],
    certifications: parsed.certifications.visible
      ? parsed.certifications.items
          .filter((item) => item.enabled && isMeaningful(item.value))
          .map((item) => compactText(item.value))
      : [],
    languages: parsed.languages.visible
      ? parsed.languages.items
          .filter((item) => item.enabled && isMeaningful(item.value))
          .map((item) => compactText(item.value))
      : [],
    references: parsed.references.visible
      ? parsed.references.items
          .filter((item) => item.enabled && isMeaningful(item.value))
          .map((item) => compactText(item.value))
      : [],
  };
}
