import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "h-4 w-48" },
};

export const Circle: Story = {
  args: { className: "h-12 w-12 rounded-full" },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64 p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  ),
};

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};
