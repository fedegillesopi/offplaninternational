import { AccordionItem } from "./accordion-item";

const faqData = [
  {
    question: "What makes Off-Plan International different from other property platforms?",
    answer:
      "Off-Plan International is the only platform that lists every individual Off-Plan unit on the market not just project-level summaries. Investors can filter by deposit, payment plan, size, location, amenities, and more to find properties that match their exact criteria. No agents, no pressure, no missing information just transparent, searchable units.",
  },
  {
    question: "Is Off-Plan International free for investors to use?",
    answer:
      "Yes. The platform is completely free for investors. You can search, compare, save units, and inquire directly through verified developers at no cost. Our model is built to make Off-Plan property investing easier, safer, and fully transparent for buyers.",
  },
  {
    question: "How does Off-Plan International verify developers and listings?",
    answer:
      "Every developer undergoes a verification process before being allowed to list individual units. This includes reviewing licenses, project approvals, track record, and proof of ownership. Only approved developers can publish inventory, ensuring investors see accurate, verified, real-time data.",
  },
  {
    question: "Do I need to speak to a sales agent to inquire about a unit?",
    answer:
      "No. Off-Plan International removes the need for traditional outbound sales. Inquiries go directly to the verified developer, eliminating pressure, misinformation, or manipulation. You get transparent information straight from the source.",
  },
  {
    question: "What information do I get about each unit before enquiring?",
    answer:
      "Every unit includes full financial and property details: deposit requirements, monthly payment plan, handover date, unit size, bedroom and bathroom count, balcony/garden availability, location, amenities, and more. You see everything upfront, making comparison and decision-making fast and stress-free.",
  },
];

export function FaqSection() {
  return (
    <section className="faq bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-[1440px]">
        <h4 className="font-heading text-h3 text-center text-text-primary">
          Frequently asked questions
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
