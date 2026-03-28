"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { ResumePdfDocument } from "@/components/resume-pdf";
import type { ResumeDocumentData } from "@/lib/resume-schema";
import { slugify } from "@/lib/utils";

type DownloadCvButtonProps = {
  data: ResumeDocumentData;
  label?: string;
  className?: string;
};

export function DownloadCvButton({
  data,
  label = "Download CV",
  className,
}: DownloadCvButtonProps) {
  const fileName = `${slugify(data.profile.fullName || "candidate")}-cv.pdf`;

  return (
    <PDFDownloadLink document={<ResumePdfDocument data={data} />} fileName={fileName}>
      {({ loading }) => (
        <span
          className={
            loading
              ? `inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted ${className ?? ""}`
              : `inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background ${className ?? ""}`
          }
        >
          <Download className="h-4 w-4" />
          {loading ? "Preparing CV..." : label}
        </span>
      )}
    </PDFDownloadLink>
  );
}
