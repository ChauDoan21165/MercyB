import type { Meta, StoryObj } from "@storybook/react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Thông báo</AlertTitle>
      <AlertDescription>Bạn đã hoàn thành bài học hôm nay.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription>Không thể kết nối. Vui lòng thử lại.</AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Nhắc nhở học tập</AlertTitle>
    </Alert>
  ),
};
