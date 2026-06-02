import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Họ và tên",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="name-input">Họ và tên</Label>
      <Input id="name-input" placeholder="Nguyễn Văn A" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="dis-input" className="opacity-70 cursor-not-allowed">
        Tài khoản (bị khóa)
      </Label>
      <Input id="dis-input" disabled placeholder="Không thể chỉnh sửa" />
    </div>
  ),
};
