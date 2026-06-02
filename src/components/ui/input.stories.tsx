import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Nhập nội dung...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "Xin chào thế giới", readOnly: true },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Không thể chỉnh sửa" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Mật khẩu" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "email@mercyblade.com" },
};
