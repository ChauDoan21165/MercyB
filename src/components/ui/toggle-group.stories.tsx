import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { VariantProps } from "class-variance-authority";
import { toggleVariants } from "@/components/ui/toggle";

// Fixed-type wrapper so Storybook meta avoids ToggleGroup's discriminated union
interface ToggleGroupDemoProps extends VariantProps<typeof toggleVariants> {
  type?: "single" | "multiple";
  className?: string;
  children?: React.ReactNode;
}
function ToggleGroupDemo({ type = "single", variant, size, className, children }: ToggleGroupDemoProps) {
  if (type === "multiple") {
    return (
      <ToggleGroup type="multiple" variant={variant} size={size} className={className}>
        {children}
      </ToggleGroup>
    );
  }
  return (
    <ToggleGroup type="single" variant={variant} size={size} className={className}>
      {children}
    </ToggleGroup>
  );
}

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroupDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroupDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroupDemo type="single">
      <ToggleGroupItem value="vi">Tiếng Việt</ToggleGroupItem>
      <ToggleGroupItem value="en">English</ToggleGroupItem>
    </ToggleGroupDemo>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroupDemo type="multiple">
      <ToggleGroupItem value="listen">Nghe</ToggleGroupItem>
      <ToggleGroupItem value="speak">Nói</ToggleGroupItem>
      <ToggleGroupItem value="read">Đọc</ToggleGroupItem>
      <ToggleGroupItem value="write">Viết</ToggleGroupItem>
    </ToggleGroupDemo>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroupDemo type="single" variant="outline">
      <ToggleGroupItem value="beginner">Cơ bản</ToggleGroupItem>
      <ToggleGroupItem value="intermediate">Trung cấp</ToggleGroupItem>
      <ToggleGroupItem value="advanced">Nâng cao</ToggleGroupItem>
    </ToggleGroupDemo>
  ),
};

export const Small: Story = {
  render: () => (
    <ToggleGroupDemo type="single" size="sm">
      <ToggleGroupItem value="a1">A1</ToggleGroupItem>
      <ToggleGroupItem value="a2">A2</ToggleGroupItem>
      <ToggleGroupItem value="b1">B1</ToggleGroupItem>
      <ToggleGroupItem value="b2">B2</ToggleGroupItem>
      <ToggleGroupItem value="c1">C1</ToggleGroupItem>
    </ToggleGroupDemo>
  ),
};
