import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

/**
 * Lane E5 smoke story — validates the Storybook pipeline (alias resolution,
 * Tailwind layer, CSF3) against the shared button primitive. Variant coverage
 * for the rest of the shared library is fanned out across E5.
 */
const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Bắt đầu học",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm">
        Nhỏ
      </Button>
      <Button {...args} size="default">
        Mặc định
      </Button>
      <Button {...args} size="lg">
        Lớn
      </Button>
    </div>
  ),
};
