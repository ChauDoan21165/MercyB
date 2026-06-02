import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Ảnh đại diện" />
      <AvatarFallback>NA</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HV</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarFallback className="text-lg">AB</AvatarFallback>
    </Avatar>
  ),
};

export const Small: Story = {
  render: () => (
    <Avatar className="h-6 w-6">
      <AvatarFallback className="text-xs">CD</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-3">
      {["Hà", "Bí", "Cẩm", "Duy"].map((name) => (
        <Avatar key={name} className="border-2 border-background">
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
