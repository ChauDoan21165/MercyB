import type { Meta, StoryObj } from "@storybook/react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Mở hộp thoại</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chào mừng đến với MercyBlade</DialogTitle>
          <DialogDescription>
            Ứng dụng học tiếng Anh dành riêng cho người Việt.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">Nội dung hộp thoại ở đây.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa thông tin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>Cập nhật thông tin cá nhân của bạn.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input id="fullname" placeholder="Nguyễn Văn A" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email-dialog">Email</Label>
            <Input id="email-dialog" type="email" placeholder="email@mercyblade.com" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
