import type { Meta, StoryObj } from "@storybook/react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="beginner">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="beginner" id="beginner" />
        <Label htmlFor="beginner">Người mới bắt đầu</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="intermediate" id="intermediate" />
        <Label htmlFor="intermediate">Trung cấp</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="advanced" id="advanced" />
        <Label htmlFor="advanced">Nâng cao</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabledOption: Story = {
  render: () => (
    <RadioGroup defaultValue="daily">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="daily" id="daily" />
        <Label htmlFor="daily">Hàng ngày</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="weekly" id="weekly" />
        <Label htmlFor="weekly">Hàng tuần</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="premium" id="premium" disabled />
        <Label htmlFor="premium" className="opacity-50">Kế hoạch cao cấp (sắp ra mắt)</Label>
      </div>
    </RadioGroup>
  ),
};
