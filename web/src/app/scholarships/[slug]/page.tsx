import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Bookmark, Check, Scale } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { DocumentsChecklist } from "@/components/scholarships/documents-checklist";
import { toggleSaveScholarship } from "@/lib/scholarships/actions";
import { reportScholarshipIssue } from "@/lib/scholarships/report-actions";
import { initialsOf } from "@/lib/scholarships/format";
import { classificationLabel, computeMatch } from "@/lib/scholarships/match";
import { deadlineLabel, deriveStatus, formatDate, statusLabel } from "@/lib/scholarships/status";
import {
  getCurrentStudentProfile,
  getSavedScholarshipIds,
  getScholarshipBySlug,
  getScholarshipChangeHistory,
  getSimilarScholarships,
} from "@/lib/scholarships/queries";
import { cn } from "@/lib/utils";

const REPORT_REASONS = [
  "Deadline has changed",
  "Funding amount is wrong",
  "Programme is no longer offered",
  "Eligibility rules are different",
  "Broken or redirected source link",
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scholarship = await getScholarshipBySlug(slug);
  if (!scholarship) return {};
  return {
    title: `${scholarship.name} | Studienpfad`,
    description: scholarship.summary,
  };
}

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scholarship = await getScholarshipBySlug(slug);
  if (!scholarship) notFound();

  const [profile, savedIds, history, similar] = await Promise.all([
    getCurrentStudentProfile(),
    getSavedScholarshipIds(),
    getScholarshipChangeHistory(scholarship.id),
    getSimilarScholarships(scholarship),
  ]);

  const status = deriveStatus(scholarship);
  const saved = savedIds.has(scholarship.id);
  const match = computeMatch(profile, scholarship);

  const keyFacts = [
    { label: "DEGREE LEVEL", value: scholarship.degreeLevels.join(" / "), sub: scholarship.subjects.slice(0, 2).join(", ") },
    { label: "FUNDING AMOUNT", value: scholarship.fundingAmountLabel, sub: scholarship.coveredExpenses.slice(0, 2).join(", ") },
    { label: "DEADLINE", value: deadlineLabel(scholarship), sub: scholarship.closeDate ? formatDate(scholarship.closeDate) : "Rolling", crimson: status === "closing_soon" },
    { label: "ELIGIBLE COUNTRIES", value: scholarship.eligibleNationalities === "all" ? "All nationalities" : `${scholarship.eligibleNationalities.length} countries`, sub: scholarship.eligibleCountriesLabel ?? "" },
    { label: "STUDY LOCATION", value: scholarship.universityName ?? "Multiple universities", sub: scholarship.studyLocationLabel ?? "" },
    { label: "APPLICATION METHOD", value: scholarship.applicationMethodLabel ?? "Official portal", sub: "" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-[1320px] px-7 pt-[22px]">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          <Link href="/" className="font-semibold">Home</Link>
          <span>/</span>
          <Link href="/scholarships" className="font-semibold">Scholarships</Link>
          <span>/</span>
          <span className="font-bold text-ink">{scholarship.name}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] items-start gap-[30px] px-7 py-5 [grid-template-columns:minmax(0,1fr)_minmax(300px,358px)]">
        <main className="flex min-w-0 flex-col gap-[22px]">
          <section className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[11.5px] font-extrabold",
                  status === "closing_soon" ? "bg-danger-bg text-crimson" : status === "closed" ? "bg-muted text-muted-foreground" : "bg-success-bg text-success",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabel(status).toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-bg px-2.5 py-1 text-[11.5px] font-extrabold text-success">
                <Check size={11} strokeWidth={3} />
                Verified {formatDate(scholarship.lastVerifiedAt.toISOString().slice(0, 10))}
              </span>
            </div>

            <div className="mt-4.5 flex flex-wrap items-start gap-4.5">
              <div className="flex h-[62px] w-[62px] flex-shrink-0 items-center justify-center rounded-2xl bg-muted font-display text-xl font-semibold">
                {initialsOf(scholarship.name)}
              </div>
              <div className="min-w-[240px] flex-1">
                <h1 className="text-balance font-display text-[clamp(28px,3vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  {scholarship.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <span className="text-[15px] font-bold">{scholarship.providerName}</span>
                  {scholarship.officialApplicationUrl && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <a href={scholarship.officialApplicationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold">
                        Official provider page <ArrowUpRight size={14} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <form action={toggleSaveScholarship}>
                <input type="hidden" name="scholarshipId" value={scholarship.id} />
                <input type="hidden" name="redirectTo" value={`/scholarships/${scholarship.slug}`} />
                <button
                  type="submit"
                  className={cn(
                    "flex items-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-colors",
                    saved ? "border-crimson bg-danger-bg text-crimson" : "border-input bg-card text-ink hover:border-ink",
                  )}
                >
                  <Bookmark size={14} className={saved ? "fill-crimson" : ""} />
                  {saved ? "Saved" : "Save"}
                </button>
              </form>
              <Link
                href={`/scholarships?compare=${scholarship.id}`}
                className="flex items-center gap-2 rounded-full border-[1.5px] border-input px-4 py-2.5 text-[13.5px] font-bold text-ink transition-colors hover:border-ink"
              >
                <Scale size={14} />
                Compare
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-3">
            {keyFacts.map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground">{k.label}</div>
                <div className={cn("mt-1.5 text-[15.5px] font-extrabold leading-[1.35]", k.crimson && "text-crimson")}>{k.value}</div>
                {k.sub && <div className="mt-1 text-[12.5px] text-muted-foreground">{k.sub}</div>}
              </div>
            ))}
          </section>

          <section className="rounded-[22px] bg-ink p-[clamp(22px,2.6vw,32px)] text-white">
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex h-[72px] w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-gold">
                <span className="text-[19px] font-extrabold leading-none">{match.percent === null ? "—" : `${match.percent}%`}</span>
                <span className="text-[9.5px] font-bold text-white/65">MATCH</span>
              </div>
              <div className="min-w-[220px] flex-1">
                <div className="text-xs font-extrabold tracking-[0.1em] text-gold">YOUR ELIGIBILITY RESULT</div>
                <div className="mt-1.5 font-display text-[23px] font-semibold tracking-[-0.025em]">
                  {classificationLabel(match.classification)}
                </div>
                {profile ? (
                  <div className="mt-1 text-sm text-white/72">
                    {match.matched.length} matched · {match.unmet.length} not met · {match.missing.length} need more info
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-white/72">Sign in and complete your profile to see a real result here.</div>
                )}
              </div>
            </div>

            {profile && (match.matched.length + match.unmet.length + match.missing.length > 0) && (
              <div className="mt-5.5 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
                {match.matched.length > 0 && (
                  <div className="rounded-2xl border border-white/14 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#7DD694] text-[11px] font-black text-ink">✓</span>
                      <span className="text-[13px] font-extrabold tracking-[0.04em] text-[#7DD694]">MATCHED · {match.matched.length}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {match.matched.map((m) => (
                        <div key={m.text} className="text-[13.5px] leading-[1.45] text-white/86">{m.text}</div>
                      ))}
                    </div>
                  </div>
                )}
                {match.unmet.length > 0 && (
                  <div className="rounded-2xl border border-white/14 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF9BA8] text-[11px] font-black text-ink">!</span>
                      <span className="text-[13px] font-extrabold tracking-[0.04em] text-[#FF9BA8]">NOT MET · {match.unmet.length}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {match.unmet.map((m) => (
                        <div key={m.text} className="text-[13.5px] leading-[1.45] text-white/86">{m.text}</div>
                      ))}
                    </div>
                  </div>
                )}
                {match.missing.length > 0 && (
                  <div className="rounded-2xl border border-white/14 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[11px] font-black text-ink">?</span>
                      <span className="text-[13px] font-extrabold tracking-[0.04em] text-gold">MISSING FROM PROFILE · {match.missing.length}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {match.missing.map((m) => (
                        <div key={m.text} className="text-[13.5px] leading-[1.45] text-white/86">{m.text}</div>
                      ))}
                    </div>
                    <Link href="/dashboard" className="mt-3.5 inline-block rounded-full bg-gold px-3.5 py-2 text-[12.5px] font-extrabold text-ink">
                      Complete profile
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4.5 flex flex-wrap items-center gap-3 border-t border-white/14 pt-4">
              <span className="text-[13.5px] text-white/70">
                {profile ? "Not eligible yet? An adviser can help you find a better fit —" : "Not signed in? Run the free check instead —"}
              </span>
              <Link href="/signup" className="rounded-full border border-white/40 px-3.5 py-2 text-[13.5px] font-bold text-white transition-colors hover:bg-white hover:text-ink">
                {profile ? "Browse advisers" : "Check my eligibility"}
              </Link>
            </div>
          </section>

          <section className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.028em]">Overview</h2>
            {scholarship.overview.map((p, i) => (
              <p key={i} className="mt-3.5 text-balance text-[15px] leading-[1.68] text-ink-2">{p}</p>
            ))}

            <h3 className="mt-7.5 font-display text-xl font-semibold tracking-[-0.02em]">Funding coverage</h3>
            <div className="mt-3.5 overflow-hidden rounded-2xl border border-border">
              {scholarship.fundingBreakdown.map((f, i) => (
                <div key={i} className="flex items-center gap-3.5 border-b border-border/70 px-4 py-3.5 last:border-b-0">
                  <span
                    className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black",
                      f.status === "covered" && "bg-success text-white",
                      f.status === "partial" && "bg-gold text-ink",
                      f.status === "not_covered" && "bg-[#E3DED5] text-muted-foreground",
                    )}
                  >
                    {f.status === "covered" ? "✓" : f.status === "partial" ? "~" : "×"}
                  </span>
                  <span className="flex-1 text-sm font-bold">{f.label}</span>
                  <span
                    className={cn(
                      "text-right text-sm font-extrabold",
                      f.status === "not_covered" ? "text-muted-foreground" : f.status === "partial" ? "text-[#B4720A]" : "text-ink",
                    )}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
              {scholarship.fundingTotalValueLabel && (
                <div className="flex items-center gap-3.5 bg-ink px-4 py-4 text-white">
                  <span className="flex-1 text-sm font-extrabold">{scholarship.fundingTotalPeriodLabel}</span>
                  <span className="text-[17px] font-extrabold text-gold">{scholarship.fundingTotalValueLabel}</span>
                </div>
              )}
            </div>

            <h3 className="mt-7.5 font-display text-xl font-semibold tracking-[-0.02em]">Eligibility requirements</h3>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {scholarship.eligibilityRequirements.map((r) => (
                <div key={r.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px] bg-ink text-[11px] font-black text-white">
                    ✓
                  </span>
                  <div className="text-[14.5px] leading-[1.55]">
                    <strong className="font-bold">{r.title}</strong> — {r.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <DocumentsChecklist documents={scholarship.requiredDocuments} />
          </section>

          <section className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.028em]">Application process</h2>
            {scholarship.applicationProcessNote && (
              <p className="mt-2.5 text-[14.5px] text-ink-2">{scholarship.applicationProcessNote}</p>
            )}
            <div className="mt-5.5 flex flex-col">
              {scholarship.applicationSteps.map((st, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex flex-shrink-0 flex-col items-center self-stretch">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-ink text-[13px] font-extrabold text-white">
                      {i + 1}
                    </span>
                    {i < scholarship.applicationSteps.length - 1 && (
                      <span className="mt-1 min-h-[14px] w-0.5 flex-1 bg-ink/12" />
                    )}
                  </span>
                  <span className="min-w-0 pb-[18px] pt-1">
                    <span className="block text-base font-bold">{st.title}</span>
                    <span className="mt-0.5 block text-[13px] font-bold text-muted-foreground">{st.dateLabel}</span>
                    <span className="mt-2 block max-w-[620px] text-sm leading-[1.6] text-ink-2">{st.body}</span>
                  </span>
                </div>
              ))}
            </div>

            {scholarship.officialApplicationUrl && (
              <div className="mt-2 flex flex-wrap items-center gap-4 rounded-[18px] border-2 border-ink bg-background p-5">
                <div className="min-w-[220px] flex-1">
                  <div className="text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground">
                    STEP {scholarship.applicationSteps.length} · OFFICIAL SUBMISSION
                  </div>
                  <div className="mt-1.5 text-[16.5px] font-extrabold">Apply on the official portal</div>
                  <div className="mt-1 text-[13px] text-muted-foreground">You leave Studienpfad. We never charge for the application itself.</div>
                </div>
                <a
                  href={scholarship.officialApplicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-crimson"
                >
                  Go to official application
                  <ArrowUpRight size={16} />
                </a>
              </div>
            )}

            {(scholarship.openDate || scholarship.closeDate || scholarship.importantDatesExtra.length > 0) && (
              <>
                <h3 className="mt-7.5 font-display text-xl font-semibold tracking-[-0.02em]">Important dates</h3>
                <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
                  {scholarship.openDate && (
                    <div className="rounded-2xl border border-border p-4">
                      <div className="text-[11px] font-extrabold tracking-[0.07em] text-muted-foreground">APPLICATION OPENS</div>
                      <div className="mt-1.5 text-[15px] font-extrabold">{formatDate(scholarship.openDate)}</div>
                    </div>
                  )}
                  {scholarship.closeDate && (
                    <div className="rounded-2xl border border-danger-bg bg-danger-bg p-4">
                      <div className="text-[11px] font-extrabold tracking-[0.07em] text-muted-foreground">SUBMISSION DEADLINE</div>
                      <div className="mt-1.5 text-[15px] font-extrabold text-crimson">{formatDate(scholarship.closeDate)}</div>
                    </div>
                  )}
                  {scholarship.importantDatesExtra.map((d) => (
                    <div key={d.label} className="rounded-2xl border border-border p-4">
                      <div className="text-[11px] font-extrabold tracking-[0.07em] text-muted-foreground">{d.label}</div>
                      <div className="mt-1.5 text-[15px] font-extrabold">{d.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section id="sources" className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.028em]">Official sources</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-bg px-2.5 py-1 text-[11.5px] font-extrabold text-success">
                <Check size={11} strokeWidth={3} />
                {scholarship.officialSources.length} source{scholarship.officialSources.length === 1 ? "" : "s"} checked
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {scholarship.officialSources.map((s) => (
                <a
                  key={s.url}
                  href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[13px] border border-border px-4 py-3.5 text-ink transition-colors hover:border-ink"
                >
                  <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px] bg-muted text-xs font-extrabold">
                    {s.tag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold">{s.title}</span>
                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{s.url}</span>
                  </span>
                  <ArrowUpRight size={14} className="text-crimson" />
                </a>
              ))}
            </div>

            <h3 className="mt-7 font-display text-xl font-semibold tracking-[-0.02em]">Verification history</h3>
            <div className="mt-3.5 flex flex-col gap-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-start gap-3.5">
                  <span className="mt-1.5 h-[9px] w-[9px] flex-shrink-0 rounded-full bg-ink" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold">
                      {formatDate(h.changedAt.toISOString().slice(0, 10))} — {h.field === "listing" ? "Listing created" : h.field}
                    </div>
                    {h.newValue && <div className="mt-0.5 text-[13px] text-muted-foreground">{h.newValue}</div>}
                  </div>
                </div>
              ))}
            </div>

            <details className="group mt-5.5">
              <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border-[1.5px] border-input px-[17px] py-2.5 text-[13.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                Report incorrect information
              </summary>
              <form action={reportScholarshipIssue} className="mt-4 flex max-w-[480px] flex-col gap-3">
                <input type="hidden" name="scholarshipId" value={scholarship.id} />
                <input type="hidden" name="slug" value={scholarship.slug} />
                <div className="flex flex-col gap-2">
                  {REPORT_REASONS.map((r, i) => (
                    <label key={r} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3.5 py-3">
                      <input type="radio" name="reason" value={r} defaultChecked={i === 0} className="accent-crimson" />
                      <span className="text-sm font-bold">{r}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  name="details"
                  placeholder="What did you find? Paste the funder's page if you have it."
                  className="min-h-[90px] rounded-xl border border-input p-3.5 text-sm outline-none"
                />
                <button type="submit" className="self-end rounded-xl bg-crimson px-5 py-3 text-sm font-bold text-white hover:bg-ink">
                  Send report
                </button>
              </form>
            </details>
          </section>

          <section className="rounded-[22px] border border-border bg-card p-[clamp(22px,2.6vw,32px)]">
            <div className="text-xs font-extrabold tracking-[0.1em] text-crimson">OPTIONAL PAID HELP</div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.028em]">Get a second pair of eyes before you submit</h2>
            <p className="mt-2 max-w-[520px] text-sm text-muted-foreground">
              Independent freelance advisers can review your file against this funder&rsquo;s checklist. Hiring one is
              never required to apply.
            </p>
            <Link
              href="/#advisers"
              className="mt-4 inline-block rounded-full border-[1.5px] border-crimson px-5 py-3 text-sm font-bold text-crimson transition-colors hover:bg-crimson hover:text-white"
            >
              Browse advisers
            </Link>
          </section>

          {(similar.length > 0) && (
            <section className="rounded-[22px] border border-border bg-card p-6">
              <h2 className="mb-3.5 font-display text-[22px] font-semibold tracking-[-0.025em]">Similar scholarships</h2>
              <div className="flex flex-col gap-2.5">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/scholarships/${s.slug}`}
                    className="flex items-center gap-3 rounded-[13px] border border-border px-3.5 py-3 text-ink transition-colors hover:border-ink"
                  >
                    <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-muted text-[12.5px] font-extrabold">
                      {initialsOf(s.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-[1.35]">{s.name}</span>
                      <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                        {s.degreeLevels.join(" / ")} · {s.fundingAmountLabel}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="sticky top-24 flex min-w-0 flex-col gap-3.5">
          <div className="rounded-[20px] border border-border bg-card p-[22px] shadow-[0_14px_34px_rgba(20,20,26,0.08)]">
            <div className="text-[11.5px] font-extrabold tracking-[0.09em] text-muted-foreground">APPLICATION CLOSES</div>
            <div className="mt-1.5 text-base font-extrabold">
              {scholarship.closeDate ? formatDate(scholarship.closeDate) : "Rolling — no fixed deadline"}
            </div>
            <div className="mt-2.5 rounded-xl bg-ink px-3.5 py-3 text-center text-sm font-bold text-gold">
              {deadlineLabel(scholarship)}
            </div>
            {scholarship.officialApplicationUrl && (
              <a
                href={scholarship.officialApplicationUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-[13px] bg-ink py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-crimson"
              >
                Go to official application
                <ArrowUpRight size={16} />
              </a>
            )}
            <div className="mt-2.5 text-center text-xs leading-[1.5] text-muted-foreground">
              Free · applies on the funder&rsquo;s site · Studienpfad takes no fee
            </div>
            <div className="my-4.5 h-px bg-border" />
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Status", value: statusLabel(status) },
                { label: "Last verified", value: formatDate(scholarship.lastVerifiedAt.toISOString().slice(0, 10)) },
                ...(scholarship.applicationsPerYearLabel ? [{ label: "Applications", value: scholarship.applicationsPerYearLabel }] : []),
                ...(scholarship.placesAvailableLabel ? [{ label: "Places", value: scholarship.placesAvailableLabel }] : []),
                ...(match.percent !== null ? [{ label: "Your match", value: `${match.percent}%` }] : []),
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-2.5 text-[13.5px]">
                  <span className="flex-1 text-muted-foreground">{p.label}</span>
                  <span className="text-right font-extrabold">{p.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <form action={toggleSaveScholarship} className="flex-1">
                <input type="hidden" name="scholarshipId" value={scholarship.id} />
                <input type="hidden" name="redirectTo" value={`/scholarships/${scholarship.slug}`} />
                <button
                  type="submit"
                  className={cn(
                    "w-full rounded-[11px] border-[1.5px] py-2.5 text-[13.5px] font-bold transition-colors",
                    saved ? "border-crimson bg-danger-bg text-crimson" : "border-input text-ink hover:border-ink",
                  )}
                >
                  {saved ? "Saved" : "Save"}
                </button>
              </form>
              <Link
                href={`/scholarships?compare=${scholarship.id}`}
                className="flex-1 rounded-[11px] border-[1.5px] border-input py-2.5 text-center text-[13.5px] font-bold text-ink transition-colors hover:border-ink"
              >
                Compare
              </Link>
            </div>
          </div>

          <div className="rounded-[20px] border border-dashed border-input bg-card p-5">
            <div className="text-[11.5px] font-extrabold tracking-[0.09em] text-crimson">OPTIONAL · PAID</div>
            <div className="mt-1.5 text-[15.5px] font-bold leading-[1.4]">Want a reviewer before you submit?</div>
            <div className="mt-1.5 text-[13px] leading-[1.55] text-ink-2">
              An adviser reads your file against the funder&rsquo;s checklist — separate from the official
              application above.
            </div>
            <Link
              href="/#advisers"
              className="mt-3.5 flex items-center justify-center rounded-[11px] border-[1.5px] border-crimson py-3 text-sm font-bold text-crimson transition-colors hover:bg-crimson hover:text-white"
            >
              Browse advisers
            </Link>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
