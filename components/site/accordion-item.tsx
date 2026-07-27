"use client";

import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-1 bg-white px-4 py-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-start justify-between border-none bg-transparent p-0 text-left"
      >
        <h4 className="font-heading text-subtitle-1 font-bold text-text-primary">
          {question}
        </h4>
        <div className="flex  items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          >
            <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
          </svg>
        </div>
      </button>
      <div
        className={`accordion-item-content overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <p className="font-body text-body-1 text-text-secondary mr-4 mt-1">
          {answer}
        </p>
      </div>
    </div>
  );
}
