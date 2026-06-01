import type { Meta, StoryObj } from "@storybook/react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const meta = {
  title: "UI/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Vietnamese: Story = {
  args: { lang: "vi", size: "md" },
};

export const CustomMessage: Story = {
  args: { message: "Đang tải bài học...", size: "md" },
};

export const NoMessage: Story = {
  args: { message: "", size: "md" },
};
