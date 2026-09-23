import type { Scholarship } from "@/lib/db/schema";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

function JsonField({
  label,
  name,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: unknown;
  hint: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ? JSON.stringify(defaultValue, null, 2) : "[]"}
        rows={6}
        className="rounded-lg border border-input bg-background p-3 font-mono text-xs outline-none focus:border-ink"
      />
    </label>
  );
}

export function ScholarshipForm({
  action,
  scholarship,
}: {
  action: (formData: FormData) => void;
  scholarship?: Scholarship;
}) {
  const s = scholarship;

  return (
    <form action={action} className="flex flex-col gap-8">
      {s && <input type="hidden" name="id" value={s.id} />}

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-extrabold uppercase tracking-wide text-crimson">Identity</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Slug" name="slug" defaultValue={s?.slug} required placeholder="daad-epos-postgraduate" />
          <Field label="Status" name="status" defaultValue={s?.status ?? "open"} />
        </div>
        <Field label="Name" name="name" defaultValue={s?.name} required />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Provider name" name="providerName" defaultValue={s?.providerName} required />
          <Field label="University name (if specific)" name="universityName" defaultValue={s?.universityName ?? ""} />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold text-ink">Summary (1-2 sentences)</span>
          <textarea
            name="summary"
            defaultValue={s?.summary}
            rows={2}
            required
            className="rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-ink"
          />
        </label>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Degree levels (comma-separated)" name="degreeLevels" defaultValue={s?.degreeLevels.join(", ")} placeholder="Master's, PhD" />
          <Field label="Subjects (comma-separated)" name="subjects" defaultValue={s?.subjects.join(", ")} placeholder="Engineering, Development" />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-extrabold uppercase tracking-wide text-crimson">Funding</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field label="Funding type (fully_funded / partial)" name="fundingType" defaultValue={s?.fundingType ?? "fully_funded"} required />
          <Field label="Funding amount label" name="fundingAmountLabel" defaultValue={s?.fundingAmountLabel} required placeholder="€992/mo + travel" />
          <Field label="Currency" name="fundingCurrency" defaultValue={s?.fundingCurrency ?? "EUR"} />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field label="Funding amount min (monthly, numeric)" name="fundingAmountMin" defaultValue={s?.fundingAmountMin ?? ""} />
          <Field label="Funding amount max" name="fundingAmountMax" defaultValue={s?.fundingAmountMax ?? ""} />
        </div>
        <Field label="Covered expenses (comma-separated)" name="coveredExpenses" defaultValue={s?.coveredExpenses.join(", ")} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Total value label" name="fundingTotalValueLabel" defaultValue={s?.fundingTotalValueLabel ?? ""} placeholder="≈ €31,400" />
          <Field label="Total value period label" name="fundingTotalPeriodLabel" defaultValue={s?.fundingTotalPeriodLabel ?? ""} placeholder="Total value over 24 months" />
        </div>
        <JsonField
          label="Funding breakdown"
          name="fundingBreakdown"
          defaultValue={s?.fundingBreakdown}
          hint='Array of {"label","value","status": "covered"|"partial"|"not_covered"}'
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-extrabold uppercase tracking-wide text-crimson">Eligibility</legend>
        <Field
          label='Eligible nationalities ("all" or comma-separated country list)'
          name="eligibleNationalities"
          defaultValue={s?.eligibleNationalities === "all" || !s ? "all" : s.eligibleNationalities.join(", ")}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Eligible countries label" name="eligibleCountriesLabel" defaultValue={s?.eligibleCountriesLabel ?? ""} />
          <Field label="Country of residence restriction" name="countryOfResidenceRestriction" defaultValue={s?.countryOfResidenceRestriction ?? ""} />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="GPA requirement (display text)" name="gpaRequirement" defaultValue={s?.gpaRequirement ?? ""} />
          <Field label="GPA requirement max (German scale, numeric)" name="gpaRequirementMaxGerman" defaultValue={s?.gpaRequirementMaxGerman ?? ""} />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Work experience requirement (display text)" name="workExperienceRequirement" defaultValue={s?.workExperienceRequirement ?? ""} />
          <Field label="Work experience min years (numeric)" name="workExperienceMinYears" defaultValue={s?.workExperienceMinYears ?? ""} />
        </div>
        <JsonField label="Eligibility requirements" name="eligibilityRequirements" defaultValue={s?.eligibilityRequirements} hint='Array of {"title","detail"}' />
        <JsonField label="Language requirements" name="languageRequirements" defaultValue={s?.languageRequirements} hint='Array of {"language","test","minScore"}' />
        <JsonField label="Required documents" name="requiredDocuments" defaultValue={s?.requiredDocuments} hint='Array of {"label","note"}' />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-extrabold uppercase tracking-wide text-crimson">Dates & application</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field label="Open date (YYYY-MM-DD)" name="openDate" type="date" defaultValue={s?.openDate ?? ""} />
          <Field label="Close date (YYYY-MM-DD)" name="closeDate" type="date" defaultValue={s?.closeDate ?? ""} />
          <label className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="isRollingDeadline" defaultChecked={s?.isRollingDeadline} className="accent-crimson" />
            <span className="text-[13px] font-bold text-ink">Rolling deadline (no fixed close date)</span>
          </label>
        </div>
        <JsonField label="Extra important dates" name="importantDatesExtra" defaultValue={s?.importantDatesExtra} hint='Array of {"label","value"}' />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Study location label" name="studyLocationLabel" defaultValue={s?.studyLocationLabel ?? ""} />
          <Field label="Application method label" name="applicationMethodLabel" defaultValue={s?.applicationMethodLabel ?? ""} />
        </div>
        <Field label="Application process note" name="applicationProcessNote" defaultValue={s?.applicationProcessNote ?? ""} />
        <Field label="Application process (short summary)" name="applicationProcess" defaultValue={s?.applicationProcess ?? ""} />
        <Field label="Official application URL" name="officialApplicationUrl" defaultValue={s?.officialApplicationUrl ?? ""} placeholder="https://..." />
        <JsonField label="Application steps" name="applicationSteps" defaultValue={s?.applicationSteps} hint='Array of {"title","dateLabel","body"}' />
        <JsonField label="Official sources" name="officialSources" defaultValue={s?.officialSources} hint='Array of {"tag","title","url"}' />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-extrabold uppercase tracking-wide text-crimson">Overview & stats</legend>
        <JsonField label="Overview paragraphs" name="overview" defaultValue={s?.overview} hint="Array of paragraph strings" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field label="Applications per year label" name="applicationsPerYearLabel" defaultValue={s?.applicationsPerYearLabel ?? ""} />
          <Field label="Places available label" name="placesAvailableLabel" defaultValue={s?.placesAvailableLabel ?? ""} />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3">
        <button type="submit" className="rounded-full bg-crimson px-6 py-3 text-sm font-bold text-white hover:bg-ink">
          {s ? "Save changes" : "Create scholarship"}
        </button>
      </div>
    </form>
  );
}
