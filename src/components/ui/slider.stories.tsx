import type { Meta, StoryObj } from "@storybook/react";

import { Slider } from "@/components/ui/slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    className: "w-64",
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Low: Story = {
  args: { defaultValue: [20] },
};

export const High: Story = {
  args: { defaultValue: [80] },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: [40] },
};

export const WithSteps: Story = {
  args: { step: 10, defaultValue: [30] },
};

export const VolumeControl: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex justify-between text-sm">
        <span>Âm lượng</span>
        <span>60%</span>
      </div>
      <Slider defaultValue={[60]} min={0} max={100} step={5} />
    </div>
  ),
};
