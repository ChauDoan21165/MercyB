import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Học viên",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Đang học" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Hết hạn" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Miễn phí" },
};
