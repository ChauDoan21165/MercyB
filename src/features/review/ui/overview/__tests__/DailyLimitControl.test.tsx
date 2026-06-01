import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  DailyLimitControl,
  DAILY_LIMIT_MAX,
  DAILY_LIMIT_MIN,
} from "../DailyLimitControl";

describe("DailyLimitControl", () => {
  it("renders the Vietnamese label and current value", () => {
    render(<DailyLimitControl value={20} onChange={() => {}} />);
    expect(screen.getByText("Số thẻ mới mỗi ngày")).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: "Số thẻ mới mỗi ngày" }),
    ).toHaveValue(20);
  });

  it("fires onChange with the typed value", () => {
    const onChange = vi.fn();
    render(<DailyLimitControl value={20} onChange={onChange} />);
    const input = screen.getByRole("spinbutton", {
      name: "Số thẻ mới mỗi ngày",
    });
    fireEvent.change(input, { target: { value: "35" } });
    expect(onChange).toHaveBeenCalledWith(35);
  });

  it("increments and decrements via the stepper buttons", () => {
    const onChange = vi.fn();
    render(<DailyLimitControl value={20} onChange={onChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Tăng số thẻ mới mỗi ngày" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(25);
    fireEvent.click(
      screen.getByRole("button", { name: "Giảm số thẻ mới mỗi ngày" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(15);
  });

  it("clamps to bounds and does not over-emit at the edges", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DailyLimitControl value={DAILY_LIMIT_MIN} onChange={onChange} />,
    );
    // Decrement at min is disabled.
    expect(
      screen.getByRole("button", { name: "Giảm số thẻ mới mỗi ngày" }),
    ).toBeDisabled();

    rerender(<DailyLimitControl value={DAILY_LIMIT_MAX} onChange={onChange} />);
    expect(
      screen.getByRole("button", { name: "Tăng số thẻ mới mỗi ngày" }),
    ).toBeDisabled();

    // Typing an out-of-range value clamps.
    rerender(<DailyLimitControl value={50} onChange={onChange} />);
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Số thẻ mới mỗi ngày" }),
      { target: { value: "999" } },
    );
    expect(onChange).toHaveBeenLastCalledWith(DAILY_LIMIT_MAX);
  });

  it("disables every control when disabled", () => {
    render(<DailyLimitControl value={20} onChange={() => {}} disabled />);
    expect(
      screen.getByRole("spinbutton", { name: "Số thẻ mới mỗi ngày" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Tăng số thẻ mới mỗi ngày" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Giảm số thẻ mới mỗi ngày" }),
    ).toBeDisabled();
  });
});
