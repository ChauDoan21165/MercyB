import type { Meta, StoryObj } from "@storybook/react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Bài học hôm nay</CardTitle>
        <CardDescription>Luyện phát âm tiếng Anh</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Hoàn thành 3/5 bài tập trong hôm nay.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Tiến độ học</CardTitle>
        <CardDescription>Tuần này bạn học rất chăm chỉ!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Bạn đã học 120 phút trong tuần này.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Xem chi tiết</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-80 p-4">
      <p className="text-sm">Thẻ đơn giản không có tiêu đề.</p>
    </Card>
  ),
};
