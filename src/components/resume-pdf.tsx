import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeDocumentData } from "@/lib/resume-schema";

type ResumePdfProps = {
  data: ResumeDocumentData;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#334155",
    fontSize: 10,
    padding: 0,
  },
  leftRail: {
    width: "27%",
    paddingTop: 36,
    paddingRight: 18,
    paddingBottom: 30,
    paddingLeft: 18,
  },
  main: {
    width: "73%",
    paddingTop: 28,
    paddingRight: 32,
    paddingBottom: 30,
    paddingLeft: 26,
  },
});

function barTitle(title: string, accent: string, mono: boolean) {
  return (
    <View
      style={{
        backgroundColor: mono ? "#f3f4f6" : `${accent}12`,
        paddingVertical: 5,
        paddingHorizontal: 10,
      }}
    >
      <Text style={{ color: accent, fontSize: 12, fontWeight: 700 }}>{title}</Text>
    </View>
  );
}

export function ResumePdfDocument({ data }: ResumePdfProps) {
  const isMono = data.meta.themeMode === "mono";
  const accent = isMono ? "#111111" : data.meta.themeAccent || "#2D7A5E";
  const headingColor = isMono ? "#111111" : "#1f2c58";
  const [firstName, ...rest] = (data.profile.fullName || "Candidate Name").split(" ");
  const surname = rest.join(" ");
  const sidebarSections = [
    { label: "Email address", value: data.profile.email },
    { label: "Telephone number", value: data.profile.phone },
    {
      label: "Address",
      value: [data.profile.streetAddress, data.profile.city].filter(Boolean).join(", "),
    },
    { label: "Postal code", value: data.profile.postalCode },
    { label: "City/Town", value: data.profile.city || data.profile.location },
    { label: "Date of birth", value: data.profile.dateOfBirth },
    { label: "Gender", value: data.profile.gender },
    { label: "Nationality", value: data.profile.nationality },
  ].filter((item) => item.value);

  return (
    <Document
      title={data.profile.fullName || "CV"}
      author={data.profile.fullName || "CV Builder"}
      subject={data.meta.targetRole || "Curriculum Vitae"}
    >
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: "row", minHeight: "100%" }}>
          <View style={[styles.leftRail, { backgroundColor: isMono ? "#ffffff" : `${accent}0D` }]}>
            {sidebarSections.map((item, index) => (
              <View key={`${item.label}-${index}`} style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    color: headingColor,
                    fontSize: 9.1,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </Text>
                <Text style={{ color: "#334155", fontSize: 9.3, lineHeight: 1.5 }}>
                  {item.value}
                </Text>
              </View>
            ))}

            {data.languages.length ? (
              <View style={{ marginTop: 18 }}>
                <Text style={{ color: accent, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                  Languages
                </Text>
                {data.languages.map((item, index) => (
                  <Text key={`${item}-${index}`} style={{ color: "#334155", fontSize: 9.3, lineHeight: 1.6 }}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null}

            {data.skills.length ? (
              <View style={{ marginTop: 18 }}>
                <Text style={{ color: accent, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                  Skills
                </Text>
                {data.skills.map((item, index) => (
                  <Text key={`${item}-${index}`} style={{ color: "#334155", fontSize: 9.3, lineHeight: 1.6 }}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.main}>
            <Text style={{ fontSize: 25, color: headingColor }}>
              <Text style={{ fontWeight: 700 }}>{firstName}</Text>
              {surname ? ` ${surname}` : ""}
            </Text>
            <View style={{ marginTop: 12, borderBottomWidth: 1.2, borderBottomColor: headingColor }} />

            <View style={{ marginTop: 26 }}>
              {barTitle("Studies and certificates", accent, isMono)}
              {data.education.length ? (
                <View style={{ marginTop: 16 }}>
                  {data.education.map((item, index) => (
                    <View key={`${item.school}-${index}`} style={{ marginBottom: 12 }} wrap={false}>
                      <Text style={{ color: headingColor, fontSize: 11.2, fontWeight: 700 }}>
                        {item.qualification || "Qualification"}
                      </Text>
                      {item.range ? (
                        <Text style={{ color: "#64748b", fontSize: 9.2, marginTop: 6 }}>{item.range}</Text>
                      ) : null}
                      <Text style={{ color: "#334155", fontSize: 9.5, marginTop: 7 }}>
                        {[item.school, item.location].filter(Boolean).join(", ")}
                      </Text>
                      {item.notes.map((note, noteIndex) => (
                        <Text
                          key={`${note}-${noteIndex}`}
                          style={{ color: "#64748b", fontSize: 9.2, lineHeight: 1.5, marginTop: 5 }}
                        >
                          {note}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>

            {data.profile.summary ? (
              <View style={{ marginTop: 24 }}>
                {barTitle("Profile", accent, isMono)}
                <Text style={{ color: "#64748b", fontSize: 9.6, lineHeight: 1.8, marginTop: 14 }}>
                  {data.profile.summary}
                </Text>
              </View>
            ) : null}

            {data.experience.length ? (
              <View style={{ marginTop: 24 }}>
                {barTitle("Work experience", accent, isMono)}
                <View style={{ marginTop: 16 }}>
                  {data.experience.map((item, index) => (
                    <View key={`${item.company}-${index}`} style={{ marginBottom: 14 }} wrap={false}>
                      <Text style={{ color: headingColor, fontSize: 11.2, fontWeight: 700 }}>
                        {item.role}
                      </Text>
                      {item.range ? (
                        <Text style={{ color: "#64748b", fontSize: 9.2, marginTop: 6 }}>{item.range}</Text>
                      ) : null}
                      <Text style={{ color: "#334155", fontSize: 9.5, marginTop: 7 }}>
                        {[item.company, item.location].filter(Boolean).join(", ")}
                      </Text>
                      {item.bullets.map((bullet, bulletIndex) => (
                        <Text
                          key={`${bullet}-${bulletIndex}`}
                          style={{ color: "#64748b", fontSize: 9.4, lineHeight: 1.6, marginTop: 7 }}
                        >
                          {bullet}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {data.projects.length ? (
              <View style={{ marginTop: 24 }}>
                {barTitle("Projects", accent, isMono)}
                <View style={{ marginTop: 16 }}>
                  {data.projects.map((item, index) => (
                    <View key={`${item.name}-${index}`} style={{ marginBottom: 12 }} wrap={false}>
                      <Text style={{ color: headingColor, fontSize: 11.2, fontWeight: 700 }}>
                        {[item.name, item.role].filter(Boolean).join(" - ")}
                      </Text>
                      {item.link ? (
                        <Link src={item.link} style={{ color: "#64748b", fontSize: 9.3, textDecoration: "none", marginTop: 5 }}>
                          {item.link}
                        </Link>
                      ) : null}
                      {item.bullets.map((bullet, bulletIndex) => (
                        <Text
                          key={`${bullet}-${bulletIndex}`}
                          style={{ color: "#64748b", fontSize: 9.4, lineHeight: 1.6, marginTop: 7 }}
                        >
                          {bullet}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}
