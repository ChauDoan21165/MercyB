import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from "@/components/ui/separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Bài học buổi sáng</p>
      <Separator className="my-3" />
      <p className="text-sm">Bài học buổi chiều</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-10">
      <span className="text-sm">Nghe</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Nói</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Đọc</span>
    </div>
  ),
};
