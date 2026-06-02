import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Fixed-type wrapper so Storybook meta avoids Accordion's discriminated union
interface AccordionDemoProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children?: React.ReactNode;
}
function AccordionDemo({ type = "single", collapsible = true, className, children }: AccordionDemoProps) {
  if (type === "multiple") {
    return <Accordion type="multiple" className={className}>{children}</Accordion>;
  }
  return (
    <Accordion type="single" collapsible={collapsible} className={className}>
      {children}
    </Accordion>
  );
}

const meta = {
  title: "UI/Accordion",
  component: AccordionDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AccordionDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AccordionDemo type="single" collapsible className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>Thì hiện tại đơn là gì?</AccordionTrigger>
        <AccordionContent>
          Thì hiện tại đơn dùng để diễn tả hành động xảy ra thường xuyên, thói quen hoặc sự thật hiển nhiên.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Cách dùng thì quá khứ đơn?</AccordionTrigger>
        <AccordionContent>
          Thì quá khứ đơn dùng để diễn tả hành động đã hoàn thành trong quá khứ tại một thời điểm cụ thể.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Phân biệt "since" và "for"?</AccordionTrigger>
        <AccordionContent>
          "Since" đi với mốc thời gian cụ thể (since 2020), còn "for" đi với khoảng thời gian (for 3 years).
        </AccordionContent>
      </AccordionItem>
    </AccordionDemo>
  ),
};

export const Multiple: Story = {
  render: () => (
    <AccordionDemo type="multiple" className="w-80">
      <AccordionItem value="a">
        <AccordionTrigger>Từ vựng cơ bản</AccordionTrigger>
        <AccordionContent>500 từ vựng thông dụng nhất trong tiếng Anh hàng ngày.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Ngữ pháp nâng cao</AccordionTrigger>
        <AccordionContent>Các cấu trúc ngữ pháp phức tạp cho bài thi IELTS.</AccordionContent>
      </AccordionItem>
    </AccordionDemo>
  ),
};

export const PreOpened: Story = {
  render: () => (
    <Accordion type="single" defaultValue="q1" collapsible className="w-80">
      <AccordionItem value="q1">
        <AccordionTrigger>Học tiếng Anh mất bao lâu?</AccordionTrigger>
        <AccordionContent>
          Phụ thuộc vào mục tiêu, nhưng với MercyBlade bạn có thể đạt B1 sau 6 tháng học đều đặn.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Ứng dụng có miễn phí không?</AccordionTrigger>
        <AccordionContent>Có, nhiều tính năng cơ bản hoàn toàn miễn phí.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
