const FAQS = [
  {
    q: "Are these scholarships open to non-EU students?",
    a: "Most are. DAAD, KAAD and the political foundations run programmes specifically for applicants from outside the EU; university awards are usually open to anyone admitted to the programme. Use the nationality filter to hide listings that exclude your passport.",
  },
  {
    q: 'What does "fully funded" mean here?',
    a: "A monthly living stipend plus at least one of: tuition waiver, travel allowance, health insurance or family supplement. Partially funded means a contribution only — typically €300–€750 a month with no tuition cover.",
  },
  {
    q: "How current are the deadlines?",
    a: "Every listing carries the date we last opened the funder's official page. Anything not re-verified within 45 days is pulled from search until a human re-checks it.",
  },
  {
    q: "Can I apply to more than one scholarship?",
    a: "Yes, with one exception: most funders forbid holding two public German stipends at once. Apply widely, declare other applications if asked, and decline the smaller award if two come through.",
  },
  {
    q: "Do I need German to win a scholarship?",
    a: "Not for English-taught programmes and research fellowships. German B1–C1 is genuinely required by the political foundations and most Deutschlandstipendium places. The language filter separates the two.",
  },
];

export function DirectoryFaq() {
  return (
    <div className="flex flex-col gap-2.5">
      {FAQS.map((f) => (
        <details key={f.q} className="group rounded-[13px] border border-border [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-[17px] py-[15px]">
            <span className="flex-1 text-[14.5px] font-bold text-ink">{f.q}</span>
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-ink group-open:bg-ink group-open:text-white">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">{"−"}</span>
            </span>
          </summary>
          <div className="px-[17px] pb-4 text-sm leading-[1.62] text-ink-2">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
