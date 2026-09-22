# Google Sans typography guidelines

_Started 2026-09-21 07:52 UTC_

---

## User

We are designing a website, which is a marketplace for freelance visa agents for Germany to list their services, and allow students to book their gigs(packages), use the following structure for the design.

Public header
Logo
Scholarships
Find an Adviser
CV Builder
Application Guides
Language selector
Search
Sign in
“Create Free Account” button

Public footer

Organize it into:

Scholarships: degree levels, fields, fully funded, closing soon
Adviser services: CV review, eligibility checks, application coaching
Resources: guides, FAQs, Germany study information
Company: about, contact, careers
Trust and legal: adviser policy, terms, privacy, cookies, refunds
Social links and newsletter signup

2. Home page

The home page should immediately explain the three major benefits: find scholarships, hire advisers, and build application documents.

Recommended section order
Hero section
Main headline
Short explanation
Scholarship search bar
“Find Scholarships” button
“Check My Eligibility” button
Student-focused illustration or interface preview
Trust bar
Number of verified scholarships
Number of approved advisers
Scholarships updated this month
“Sources checked regularly” message
How it works
Create your profile
Discover matching scholarships
Prepare documents or hire an adviser
Track and submit applications
Featured scholarships
Six scholarship cards
Closing-soon tab
Fully-funded tab
Recently verified tab
Personalised matching promotion
Profile completeness preview
Example matching explanation
“Get My Matches” CTA
Adviser service categories
Eligibility assessment
Scholarship shortlist
CV creation
Motivation-letter coaching
Document review
Interview preparation
Featured advisers
Adviser cards
Verification badges
Languages
Starting price
Review score
“View Profile”
CV builder promotion
CV template preview
ATS-friendly explanation
PDF and DOCX export
“Build Your CV”
Application guides
Latest guides
Popular Germany scholarship topics
Degree and nationality guides
Success stories or verified reviews
Frequently asked questions
Final CTA
“Create Your Free Scholarship Profile”
Important widgets
Global scholarship search
Scholarship card
Adviser card
Service-category card
Deadline badge
Verified-data badge
CV preview
Testimonial carousel
FAQ accordion

use the colors of the German flag, design should be more attractive. Now think as experienced UX designer and design homepage.

## Assistant

## User

try now

## User

try now

## Assistant

_[tool: list_files]_

Design system project is empty, so I'll set the direction myself: German flag palette (deep ink, crimson, gold) on warm paper, Instrument Serif display + Plus Jakarta Sans UI.

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: run_script]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

Homepage is built as a single Design Component with the full header, all 12 sections and the organized footer.

Direction: German flag as ink/crimson/gold on warm paper, Instrument Serif headlines over Plus Jakarta Sans UI — the tricolor shows up as small structural accents (logo, adviser card top rail, CTA base strip) rather than as blocks of red-yellow-black.

Live pieces: scholarship tabs (closing soon / fully funded / recently verified, 6 real cards each), testimonial carousel, FAQ accordion, language selector, and a hero "your matches" interface preview. Deadline badges turn crimson under 20 days. Two tweaks exposed: default scholarship tab and whether the first FAQ opens.

Next, if useful: the scholarship search results page, an adviser profile with bookable gigs, or the CV builder flow.

## User

use Google Sans for headings

## User

use Google Sans for headings

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Made the page fluid: header now wraps (CTA always visible, no mid-word nav breaks), all card grids use `auto-fit` so columns reduce instead of crushing, two-column panels stack, and headings scale with `clamp()`.

## User

optimize this

## User

optimize this

## User

make this more user friendly

## Assistant

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Search bar reworked for clarity:

- Each field now has a visible label ("What do you want to study?", "Degree level") so the greyed text isn't mistaken for an answer
- Location swapped for a real working degree-level dropdown with chevron — the old "All of Germany" was a dead label
- Button sits inline instead of spanning full width, with an arrow signalling it moves you forward
- Popular searches below (fully funded Master's, Engineering, DAAD, closing in 30 days) — one tap fills the field and jumps the featured tab
- Eligibility CTA reworded to "Not sure you qualify?" for people who can't name a search term

## User

make the find scholarships button into arrow and make it in 1 row

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Search is now a single locked row: study field, degree level, and a circular-square arrow button — no wrapping, fields shrink instead.

## User

replace this with a image and make the columns in hero section to 60% - 40%

## Assistant

_[tool: copy_starter_component]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Hero is now 60/40 and the matches mockup is replaced by a droppable image slot — drag your photo onto it and it sticks (deadline badge kept floating over the corner). The `heroMatches` data is unused now; say the word if you want it removed.

## User

Change the search button to an icon and align the primary menu to the left.

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Header search is now an icon-only round button, and the primary nav sits flush left beside the logo with the actions group pushed right.

## User

align primary menu to right, change the lagguage switcher to icon

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Nav is right-aligned next to the actions, and the language switcher is now a globe icon button (still cycles EN → DE → FR → ES, current language in its tooltip).

## User

now design this

3. Scholarship directory

Route example: /scholarships

This is one of your most important SEO and conversion pages.

Page structure
Breadcrumbs
H1 and short SEO introduction
Large search field
Popular filter chips
Results count
Filter sidebar on desktop
Filter drawer on mobile
Sort selector
Scholarship results grid/list
Pagination
Related scholarship categories
Helpful guide links
SEO content and FAQs
Filters
Degree level
Field of study
Student nationality
Country of residence
Fully or partially funded
Funding amount
Application status
Deadline
Provider
University
Language requirements
GPA requirements
Work-experience requirements
Scholarship card widgets

Each card should contain:

Scholarship title
Provider
Degree level
Subject areas
Funding summary
Deadline
Open, closing soon or closed badge
Last verified date
Eligibility/match indicator for logged-in students
Save button
Compare checkbox
“View Scholarship” button

Also include a sticky comparison tray when students select scholarships.

## User

now design this

4. Scholarship detail page

Route example: /scholarships/daad-epos-scholarship

Recommended section order
Breadcrumbs
Scholarship header
Title
Provider
Verification status
Last verified date
Open/closed status
Save, compare and share actions
Key facts panel
Degree level
Funding amount
Deadline
Eligible countries
Study location
Application method
Eligibility result
“Check my eligibility” CTA for guests
Match summary for logged-in students
Matched requirements
Unmet requirements
Missing profile information
Scholarship overview
Funding coverage
Tuition
Monthly stipend
Travel
Insurance
Research allowance
Family allowance
Eligibility requirements
Required documents
Application process
Step-by-step timeline
Official application button
Important dates
Official sources
Source links
Verification history
“Report incorrect information”
Recommended adviser services
Similar scholarships
Relevant application guides
Useful widgets
Sticky action panel
Eligibility breakdown
Funding breakdown
Application stepper
Required-document checklist
Deadline countdown
Source-verification panel
Correction-report dialog

The official application button should be visually separate from adviser-service buttons to avoid confusion.

## User

now design this

4. Scholarship detail page

Route example: /scholarships/daad-epos-scholarship

Recommended section order
Breadcrumbs
Scholarship header
Title
Provider
Verification status
Last verified date
Open/closed status
Save, compare and share actions
Key facts panel
Degree level
Funding amount
Deadline
Eligible countries
Study location
Application method
Eligibility result
“Check my eligibility” CTA for guests
Match summary for logged-in students
Matched requirements
Unmet requirements
Missing profile information
Scholarship overview
Funding coverage
Tuition
Monthly stipend
Travel
Insurance
Research allowance
Family allowance
Eligibility requirements
Required documents
Application process
Step-by-step timeline
Official application button
Important dates
Official sources
Source links
Verification history
“Report incorrect information”
Recommended adviser services
Similar scholarships
Relevant application guides
Useful widgets
Sticky action panel
Eligibility breakdown
Funding breakdown
Application stepper
Required-document checklist
Deadline countdown
Source-verification panel
Correction-report dialog

The official application button should be visually separate from adviser-service buttons to avoid confusion.

## User

now design this

5. Adviser directory

Route example: /advisers

Page sections
Heading and trust explanation
Adviser/service search
Service-category chips
Filter and sort controls
Adviser results
How adviser verification works
Adviser code-of-conduct summary
Student protection information
FAQs
Filters
Service type
Field specialization
Degree level
Student nationality experience
Language
Country
Price range
Delivery time
Rating
Availability
Verified credentials
Adviser card
Profile photo
Name
Verified badge
Short professional title
Languages
Specializations
Completed orders
Rating
Response time
Starting price
Available service categories
“View Profile”

## User

now design this

5. Adviser directory

Route example: /advisers

Page sections
Heading and trust explanation
Adviser/service search
Service-category chips
Filter and sort controls
Adviser results
How adviser verification works
Adviser code-of-conduct summary
Student protection information
FAQs
Filters
Service type
Field specialization
Degree level
Student nationality experience
Language
Country
Price range
Delivery time
Rating
Availability
Verified credentials
Adviser card
Profile photo
Name
Verified badge
Short professional title
Languages
Specializations
Completed orders
Rating
Response time
Starting price
Available service categories
“View Profile”

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

`Adviser Directory.dc.html` is live with 9 real adviser records and working filters.

Structure: heading + trust explanation (+ escrow "how payment works" panel) → service/adviser search → six service-category chips with counts → toolbar with count and sort (recommended, rating, price, delivery, orders) → 11-group filter sidebar (service, field, degree level, nationality experience, language, country, price slider, delivery time, rating, availability, verified credentials) → adviser cards → pagination → four-step verification explainer with published rejection rate → code-of-conduct summary (don'ts in red, musts in green) → student-protection cards → FAQ grid.

Cards carry avatar with availability dot, name + verified badge, professional title, rating/reviews/orders, credential badges, languages, specializations, response time, service tags, starting price, Message and View Profile.

Avatars are initials for now — if you want real photos, I can swap them to droppable image slots.

_[tool: dc_write]_

_[tool: run_script]_

_[tool: ready_for_verification]_

`Adviser Profile.dc.html` (Nadia K.) is live.

Main column: profile header (droppable photo, verified badges, location/languages/last-active/response-time) → performance strip (486 orders, 98% on time, 4.9, 41% repeat) → about + specializations grid (services, degree levels, fields, scholarship types, student backgrounds) → verified experience timeline → service packages with a three-way switcher, each showing scope, deliverables, delivery time, revisions, fixed price and Order Service → 10-day availability strip → portfolio samples → reviews with rating distribution → policies, independence disclaimer and Report profile dialog.

Sticky sidebar holds starting price, availability, order/message CTAs and the service price list; under 860px wide it's replaced by a sticky bottom order bar. Profile photo and the three sample thumbnails are droppable slots.

## User

7. Service package page

Route example: /services/[service-slug]

This can initially be displayed inside the adviser profile, but a separate SEO page is useful later.

Sections
Service title and adviser
Price and delivery period
What is included
What is excluded
Deliverables
Number of revisions
Student prerequisites
Service process
Adviser credentials
Reviews for this service
Cancellation and refund summary
Order button
Widgets
Package comparison table
Price summary
Delivery timeline
Requirements checklist
Adviser mini-card
Order confirmation drawer

design this also

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

`Service Package.dc.html` is live — motivation-letter coaching by Nadia K., linked from her profile.

Main column: title + adviser row + price/delivery/revisions/next-slot facts → what it is → included vs not-included panels side by side → deliverables → three-tier comparison table (click a column to switch tier; the whole page reprices) → prerequisites checklist with ready count → delivery timeline that relabels with the tier → verified credentials → service-specific reviews → cancellation/refund table.

Sticky sidebar: price summary with three toggleable add-ons, platform fee, live total, delivery facts, order button, and the adviser mini-card. "Order this service" opens a right-side confirmation drawer (scholarship picker, deadline warning, file checklist reflecting your ticks, itemised total, continue to payment). Under 860px the order CTA moves to a sticky bottom bar.

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: multi_screenshot]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I checked the page end to end — no console errors, the tier switcher reprices the whole page, the prerequisites checklist drives the drawer's file states, and the order drawer opens and totals correctly. Only fix needed was the awkward timeline heading, now "What happens over the 4 days".

