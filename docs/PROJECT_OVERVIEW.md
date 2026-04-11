# Customize With Class (CWC) — Project overview

**Purpose of this document:** Explain **why this product exists**, **who it helps**, and **what it does** in business terms. A short **technical appendix** at the end supports engineers and AI assistants who need to navigate the codebase.

**Audience:** Founders, operators, product-minded contributors, and implementers.

**Scope:** The product spans two repositories: the **staff web app** (`cvc-angular`, package name `cvc-web`) and the **API** (`nest-server`). Keep this file aligned with `cvc-angular/docs/PROJECT_OVERVIEW.md` (same content aside from the repo note below).

**This copy:** Backend repo. **Sibling doc:** `cvc-angular/docs/PROJECT_OVERVIEW.md`.

**Last reviewed:** 2026-04-12.

---

## 1. What this product is

**Customize With Class** is an internal **order and operations hub** for a small business that sells **made-to-order or personalized physical goods**—for example items where each line might need a specific color, label, engraving, or other customization.

It is **not** a consumer shopping cart. It is the **team’s system of record**: one place to capture orders, tie them to real customers and products, know where each order came from (social, web, etc.), move work through fulfillment stages, and see **simple business reports** (volume, geography, channels, top products).

---

## 2. The business problem

Small shops taking customized orders often struggle because:

- **Details live in scattered places**—DMs, spreadsheets, notebooks—so it is easy to lose specifications or duplicate effort.
- **Every order is different**; generic retail tools do not model **per-line customization** (colors, names, variants) well.
- **Knowing what to make and ship** depends on clear **order status** and history; without it, the team chases updates manually.
- **Growth is hard to see** when the owner cannot quickly answer: *Where do orders come from? What sells? Which regions order most?*

Without a dedicated system, the business risks mistakes, slower fulfillment, and weak visibility into what is actually working.

---

## 3. The solution (why this product exists)

CWC gives the business a **single, structured workflow**:

1. **Define what you sell** (products, costs, weights, images) so the team speaks one language about the catalog.
2. **Know your buyers** (customers with contact and location) so orders are tied to real people and addresses.
3. **Record each order once** with line-level customization, payment method, totals, and weight—so production and dispatch have a clear spec.
4. **Tag where the sale originated** (e.g. Instagram, Facebook, web) so marketing and effort can be tied to results.
5. **Track the order through its life** (pending → with vendor → dispatched → delivered, with room for returns) so everyone sees the same state.
6. **Glance at the business** via a dashboard and reports instead of reconstructing numbers by hand.

The product exists to **reduce operational chaos**, **cut errors on custom work**, and **make informal channel sales measurable**.

---

## 4. Who uses it

| User | Role in the story |
|------|-------------------|
| **Business operators / staff** | Day-to-day users: log in, manage catalog and customers, create and edit orders, update status, review reports. |
| **Owner / manager** | Same app; cares especially about overview stats, sources, and product performance. |
| **End customers** | They do not use this app directly; their orders and details are **captured and managed here** by the team. |

Access is **staff-only** (sign-in); the app assumes a trusted internal team.

---

## 5. How it helps (outcomes)

- **Fewer mistakes on custom orders** because specifications (per line) and customer details live with the order.
- **Faster answers** to “What’s the status?” and “What did they order?” without digging through messages.
- **Clearer picture of demand** by **order source** (which channels drive sales).
- **Better geographic and product insight** through reports (e.g. orders by region, over time, top products).
- **One workflow** from intake to fulfillment tracking, sized for a **small team** without enterprise complexity.

---

## 6. Core capabilities (the system as a whole)

These are the **main things the product does** for the business, independent of how the code is split.

1. **Secure staff access** — Team members sign in; work happens inside a protected workspace.
2. **Product catalog** — Maintain products (including cost, weight, descriptions, and visuals) so orders always reference the same items.
3. **Customer records** — Store buyers with contact information and location (including province/region) for shipping, support, and reporting.
4. **Order management** — Create and edit orders with:
   - linked customer,
   - multiple line items from the catalog,
   - **per-line customization** (e.g. color, personalized name/text),
   - payment method, amounts, optional total weight,
   - **order date** and free-text description for extra notes.
5. **Order sources** — Configure and assign **channels** (e.g. Instagram, Facebook, web) to orders so the business can see **where sales originate**.
6. **Order status** — Move orders through stages that match how the shop works (e.g. pending, with vendor, dispatched, delivered; returns when needed).
7. **Dashboard & reports** — High-level stats plus deeper views (orders by period, by source, by province; product performance) to support decisions.
8. **Supporting assets** — Ability to attach/upload images and documents where the product needs them (e.g. product imagery, files relevant to orders).

Together, these capabilities form the **operating backbone** for a small customized-goods business.

---

## 7. Typical order journey (business view)

```mermaid
flowchart LR
  A[Inquiry or sale on a channel] --> B[Staff creates order in CWC]
  B --> C[Order linked to customer and products]
  C --> D[Customization captured per line]
  D --> E[Source tagged e.g. Instagram]
  E --> F[Status updated through fulfillment]
  F --> G[Delivered or returned]
  G --> H[Reports reflect volume and patterns]
```

This is the **intended story** the software supports—not a mandatory rigid process, but the mental model the features reinforce.

---

## 8. What the product is not (scope)

- **Not** a public e-commerce storefront for shoppers.
- **Not** payment processing or accounting software (it records **payment method** and amounts as the business enters them; it does not replace a bank or accounting tool).
- **Not** inventory or manufacturing execution at scale—though **weight** and **quantities** support operational awareness.

Keeping this boundary clear helps stakeholders set the right expectations.

---

## Appendix A — Technical snapshot (for orientation)

| Piece | Repository | Role |
|-------|------------|------|
| Staff web UI | `cvc-angular` | Angular app: dashboard, products, customers, orders, order sources, reports, login. |
| API & database | `nest-server` | NestJS REST API, PostgreSQL, file storage integration for uploads. |

**Stack (high level):** Angular 19 + PrimeNG on the frontend; NestJS 9 + TypeORM + PostgreSQL on the backend; JWT-based staff authentication.

**Local development:** Run API and UI together; point the Angular `environment.baseUrl` at the running API.

**Further technical detail:** OpenAPI/Swagger is served from the API when running; a Postman collection lives under `nest-server/docs/postman_collection`. Frontend deployment notes: `cvc-angular/docs/DEPLOYMENT_SETUP.md`.

**Specification suite (both repos, Option A layout):** Root **`AGENTS.md`**, plus **`docs/ARCHITECTURE.md`**, **`docs/API_CONTRACT.md`**, **`docs/DOMAIN_MODEL.md`**, **`docs/OPERATIONS.md`**, **`docs/SECURITY_NOTES.md`**, **`docs/adr/`**, and **`docs/openapi/`** (API repo). The Angular repo also has **`docs/FRONTEND_SPEC.md`**.

---

## Appendix B — For implementers & AI assistants

- **Start here:** Repo root **`AGENTS.md`**, then the **`docs/`** files above; keep **`PROJECT_OVERVIEW.md`** for business context only.
- **Where to start in code:** Backend `src/app.module.ts`, `src/main.ts`; frontend `src/app/app-routing.ts`, `src/app/app.config.ts`. Order flows live under `nest-server/src/modules/order/` and `cvc-angular/src/app/modules/order/`.
- **Database changes:** Use TypeORM migrations; schema sync is not enabled for production safety.
- **API responses:** Success payloads are wrapped consistently (`payload` / `metadata`); client services often accept both `data` and `payload`—keep that contract coherent when changing either side.
- **Public vs authenticated routes:** Some endpoints are intentionally public (e.g. health, login); changing that surface is security-sensitive.
- **Maintenance:** When you add a **user-visible capability**, update the **Core capabilities** and **Order journey** sections here in **business language**; put file-level detail in code comments or API docs rather than bloating this overview.

When business positioning or target users change, revise sections 1–8 first so this file stays the **context anchor** for the project.
