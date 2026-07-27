import { getTranslations } from "next-intl/server";

interface PropertyDetailsTableProps {
  subcategory: string;
  addedOn: string;
  status: string;
  handoverDate: string;
}

export async function PropertyDetailsTable({
  subcategory,
  addedOn,
  status,
  handoverDate,
}: PropertyDetailsTableProps) {
  const t = await getTranslations("property_detail");
  const rows = [
    { label: t("subcategory"), value: subcategory },
    { label: t("added_on"), value: addedOn },
    { label: t("property_status"), value: status },
    { label: t("handover_date"), value: handoverDate },
  ];

  return (
    <div>
      <h3 className="mb-2 font-heading text-h4 font-bold text-[--text-primary]">
        {t("property_details")}
      </h3>
      <div className="divide-y divide-[--grey-50] rounded-2 border border-[--grey-50]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-3 py-2"
          >
            <span className="font-body text-sm font-light text-[--grey-300]">
              {row.label}:
            </span>
            <span className="font-body text-sm font-medium text-[--text-primary]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
