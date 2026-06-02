import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree">Tôi đồng ý với điều khoản sử dụng</Label>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {["Luyện nghe", "Luyện nói", "Luyện đọc", "Luyện viết"].map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox id={item} />
          <Label htmlFor={item}>{item}</Label>
        </div>
      ))}
    </div>
  ),
};
