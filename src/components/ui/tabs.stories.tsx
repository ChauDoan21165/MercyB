import type { Meta, StoryObj } from "@storybook/react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="listen" className="w-80">
      <TabsList>
        <TabsTrigger value="listen">Nghe</TabsTrigger>
        <TabsTrigger value="speak">Nói</TabsTrigger>
        <TabsTrigger value="read">Đọc</TabsTrigger>
      </TabsList>
      <TabsContent value="listen">
        <p className="text-sm p-2">Luyện kỹ năng nghe hiểu tiếng Anh.</p>
      </TabsContent>
      <TabsContent value="speak">
        <p className="text-sm p-2">Luyện phát âm và hội thoại.</p>
      </TabsContent>
      <TabsContent value="read">
        <p className="text-sm p-2">Luyện đọc và từ vựng.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="daily" className="w-72">
      <TabsList>
        <TabsTrigger value="daily">Hàng ngày</TabsTrigger>
        <TabsTrigger value="weekly">Hàng tuần</TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        <p className="text-sm p-2">Mục tiêu hôm nay: 30 phút học.</p>
      </TabsContent>
      <TabsContent value="weekly">
        <p className="text-sm p-2">Mục tiêu tuần: 5 bài học.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-72">
      <TabsList>
        <TabsTrigger value="tab1">Bài học</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Sắp ra mắt
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-2">Nội dung bài học hiện tại.</p>
      </TabsContent>
    </Tabs>
  ),
};
