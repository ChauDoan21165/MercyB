import type { Meta, StoryObj } from "@storybook/react";

import { Progress } from "@/components/ui/progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    value: 50,
    className: "w-64",
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0 },
};

export const Full: Story = {
  args: { value: 100 },
};

export const Low: Story = {
  args: { value: 20 },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex justify-between text-sm">
        <span>Tiến độ học tập</span>
        <span>75%</span>
      </div>
      <Progress value={75} />
    </div>
  ),
};
