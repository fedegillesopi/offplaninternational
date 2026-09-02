import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/platform/property-form/form-section";

const CURRENCIES = [
  { value: "AED", label: "AED" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

interface PropertyDetailsSectionProps {
  bedrooms: string;
  bathrooms: string;
  floor: string;
  areaSqft: string;
  areaSqm: string;
  price: string;
  currency: string;
  depositPercentage: string;
  depositAmount: string;
  hasPostHandover: boolean;
  handoverDate: string;
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onAreaSqftChange: (value: string) => void;
  onAreaSqmChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onDepositPercentageChange: (value: string) => void;
  onDepositAmountChange: (value: string) => void;
  onHasPostHandoverChange: (checked: boolean) => void;
  onHandoverDateChange: (value: string) => void;
}

export function PropertyDetailsSection({
  bedrooms,
  bathrooms,
  floor,
  areaSqft,
  areaSqm,
  price,
  currency,
  depositPercentage,
  depositAmount,
  hasPostHandover,
  handoverDate,
  onBedroomsChange,
  onBathroomsChange,
  onFloorChange,
  onAreaSqftChange,
  onAreaSqmChange,
  onPriceChange,
  onCurrencyChange,
  onDepositPercentageChange,
  onDepositAmountChange,
  onHasPostHandoverChange,
  onHandoverDateChange,
}: PropertyDetailsSectionProps) {
  return (
    <>
      <FormSection title="Property Details">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={bedrooms}
              onChange={(e) => onBedroomsChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={bathrooms}
              onChange={(e) => onBathroomsChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Floor</Label>
            <Input
              type="number"
              min={0}
              value={floor}
              onChange={(e) => onFloorChange(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Area (sqft)</Label>
            <Input
              type="number"
              min={0}
              value={areaSqft}
              onChange={(e) => onAreaSqftChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Area (sqm)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={areaSqm}
              onChange={(e) => onAreaSqmChange(e.target.value)}
              placeholder="Auto-calculated"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Deposit %</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={depositPercentage}
              onChange={(e) => onDepositPercentageChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Deposit Amount</Label>
            <Input
              type="number"
              min={0}
              value={depositAmount}
              onChange={(e) => onDepositAmountChange(e.target.value)}
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Handover Date</Label>
            <Input
              type="date"
              value={handoverDate}
              onChange={(e) => onHandoverDateChange(e.target.value)}
            />
          </div>
          <div className="flex items-end pb-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="post_handover"
                checked={hasPostHandover}
                onCheckedChange={(c) => onHasPostHandoverChange(c === true)}
              />
              <Label htmlFor="post_handover" className="font-normal">
                Post Handover
              </Label>
            </div>
          </div>
        </div>
      </FormSection>
    </>
  );
}
