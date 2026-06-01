import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Nhập ghi chú của bạn...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "Hôm nay tôi đã học được nhiều từ vựng mới về chủ đề du lịch.",
    rows: 4,
  },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Không thể chỉnh sửa" },
};

export const Tall: Story = {
  args: { rows: 8, placeholder: "Viết bài luận của bạn ở đây..." },
};
