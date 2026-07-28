import { getTranslations } from "next-intl/server";

interface PaymentPlan {
  length: string;
  depositPercentage: string;
  depositValue: string;
  description: string;
}

export async function PropertyPaymentPlan({
  paymentPlan,
}: {
  paymentPlan: PaymentPlan;
}) {
  const t = await getTranslations("property_detail");
  const rows = [
    { label: t("payment_plan_length"), value: paymentPlan.length },
    { label: t("deposit_percentage"), value: paymentPlan.depositPercentage },
    { label: t("deposit_value"), value: paymentPlan.depositValue },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className=" font-heading text-h4 font-bold text-[--text-primary]">
        {t("mortgage_information")}
      </h3>
      <h4 className=" font-heading text-subtitle-2 font-semibold text-[--primary-main]">
        {t("off_plan_payment_plan")}
      </h4>
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
      <p className="mt-2 font-body text-sm font-light text-[--text-primary]">
        {t("payment_plan_description")} {paymentPlan.description}
      </p>
    </div>
  );
}
