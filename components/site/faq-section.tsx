import { getTranslations } from "next-intl/server";
import { AccordionItem } from "./accordion-item";

export async function FaqSection() {
  const t = await getTranslations("faq");
  const faqData = t.raw("items") as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="faq bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-[1440px]">
        <h4 className="font-heading text-h3 text-center text-text-primary">
          {t("title")}
        </h4>
        <div className="accordion-wrapper mx-auto mt-7 flex max-w-4xl flex-col gap-3">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
