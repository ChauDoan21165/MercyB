import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "@/components/ui/toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    children: "Bật/Tắt",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const OutlinePressed: Story = {
  args: { variant: "outline", defaultPressed: true },
};

export const Small: Story = {
  args: { size: "sm", children: "Nhỏ" },
};

export const Large: Story = {
  args: { size: "lg", children: "Lớn" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
