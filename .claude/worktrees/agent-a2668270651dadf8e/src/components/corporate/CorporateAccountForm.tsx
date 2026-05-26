// src/components/corporate/CorporateAccountForm.tsx
//
// Initial setup form for a corporate / school multi-seat account.
// Validates client-side via the same `validateCreateCorporateAccountInput`
// the lib uses, so users see a Vietnamese-friendly message before any
// network round-trip. Bilingual labels, English placeholders.

import React, { useMemo, useState } from "react";

import {
  CORPORATE_MIN_SEAT_COUNT,
  CORPORATE_ORGANIZATION_TYPES,
  createCorporateAccount,
  validateCreateCorporateAccountInput,
  type CorporateAccount,
  type CorporateOrganizationType,
  type CreateCorporateAccountInput,
} from "@/lib/corporate/corporateClient";

export type CorporateAccountFormProps = {
  /** Authenticated admin user id; caller resolves before mounting. */
  adminUserId: string;
  /** Called once an account has been created successfully. */
  onCreated?: (account: CorporateAccount) => void;
};

const ORG_TYPE_LABEL: Record<CorporateOrganizationType, { vi: string; en: string }> = {
  school:    { vi: "Trường học",        en: "School" },
  church:    { vi: "Nhà thờ / hội thánh", en: "Church" },
  business:  { vi: "Doanh nghiệp",       en: "Business" },
  community: { vi: "Cộng đồng",          en: "Community group" },
  other:     { vi: "Khác",               en: "Other" },
};

export function CorporateAccountForm({
  adminUserId,
  onCreated,
}: CorporateAccountFormProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<CorporateOrganizationType>("school");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [country, setCountry] = useState("");
  const [seatCount, setSeatCount] = useState<number>(CORPORATE_MIN_SEAT_COUNT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload: CreateCorporateAccountInput = useMemo(
    () => ({
      organizationName,
      organizationType,
      contactEmail,
      contactPhone: contactPhone.trim() === "" ? null : contactPhone,
      country,
      seatCount,
    }),
    [organizationName, organizationType, contactEmail, contactPhone, country, seatCount],
  );

  const clientError = useMemo(
    () => validateCreateCorporateAccountInput(payload),
    [payload],
  );
  const canSubmit = !submitting && clientError === null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createCorporateAccount(adminUserId, payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onCreated?.(result.data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto space-y-4"
      aria-label="Create corporate account"
    >
      <div>
        <label htmlFor="corp-name" className="block text-sm font-semibold mb-1">
          Tên tổ chức
          <span className="text-slate-400 font-normal ml-2">Organization name</span>
        </label>
        <input
          id="corp-name"
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="corp-type" className="block text-sm font-semibold mb-1">
          Loại tổ chức
          <span className="text-slate-400 font-normal ml-2">Organization type</span>
        </label>
        <select
          id="corp-type"
          value={organizationType}
          onChange={(e) =>
            setOrganizationType(e.target.value as CorporateOrganizationType)
          }
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
        >
          {CORPORATE_ORGANIZATION_TYPES.map((t) => (
            <option key={t} value={t}>
              {ORG_TYPE_LABEL[t].vi} · {ORG_TYPE_LABEL[t].en}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="corp-email" className="block text-sm font-semibold mb-1">
            Email liên hệ
            <span className="text-slate-400 font-normal ml-2">Contact email</span>
          </label>
          <input
            id="corp-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="corp-phone" className="block text-sm font-semibold mb-1">
            Số điện thoại (tuỳ chọn)
            <span className="text-slate-400 font-normal ml-2">Contact phone</span>
          </label>
          <input
            id="corp-phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="corp-country" className="block text-sm font-semibold mb-1">
            Quốc gia
            <span className="text-slate-400 font-normal ml-2">Country</span>
          </label>
          <input
            id="corp-country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="Vietnam, USA, Australia, …"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="corp-seats" className="block text-sm font-semibold mb-1">
            Số ghế (tối thiểu {CORPORATE_MIN_SEAT_COUNT})
            <span className="text-slate-400 font-normal ml-2">Seats</span>
          </label>
          <input
            id="corp-seats"
            type="number"
            min={CORPORATE_MIN_SEAT_COUNT}
            step={1}
            value={seatCount}
            onChange={(e) => setSeatCount(Number(e.target.value))}
            required
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Việc thanh toán Stripe sẽ được nhóm sales kích hoạt sau khi xét duyệt.
        Tài khoản này tạo trước, gắn Stripe sau.
      </p>

      {clientError && organizationName.length > 0 && (
        <p className="text-sm text-amber-700 dark:text-amber-300" role="status">
          {clientError}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 font-medium"
        >
          {submitting ? "Đang tạo…" : "Tạo tài khoản"}
        </button>
      </div>
    </form>
  );
}

export default CorporateAccountForm;
