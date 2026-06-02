import type { Meta, StoryObj } from "@storybook/react";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex items-center justify-center p-12">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Xem thêm</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Nhấn để xem chi tiết bài học</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Phát âm</Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Nghe phát âm chuẩn</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Bắt đầu</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Bắt đầu bài học mới</p>
      </TooltipContent>
    </Tooltip>
  ),
};
