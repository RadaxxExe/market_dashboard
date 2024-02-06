import { formatDateToUSFormat } from "../formatDateToUSFormat";
import { numberFormatter } from "../numberFormatter";

describe("numberFormatter", () => {
  it('should return "NaN" if no number is provided', () => {
    expect(numberFormatter()).toBe("NaN");
  });

  it("should format the number using Intl.NumberFormat with compact notation", () => {
    expect(numberFormatter(1000)).toBe("1K");
    expect(numberFormatter(1000000.55)).toBe("1M");
    expect(numberFormatter(-50000)).toBe("-50K");
    expect(numberFormatter(1000000000)).toBe("1B");
    expect(numberFormatter(0.0000001)).toBe("0.0000001");
  });
});

describe("formatDateToUSFormat", () => {
  it('should return "2023-01-01" if no date is provided', () => {
    expect(formatDateToUSFormat()).toBe("2023-01-01");
  });

  it("should format the date to the US format (YYYY-MM-DD)", () => {
    expect(formatDateToUSFormat(new Date("2023-02-15"))).toBe("2023-02-15");
    expect(formatDateToUSFormat(new Date("12/31/2023"))).toBe("2023-12-31");
    expect(formatDateToUSFormat(new Date("November 20, 2023"))).toBe(
      "2023-11-20"
    );
    expect(formatDateToUSFormat(new Date("2023-05-10T00:00:00Z"))).toBe(
      "2023-05-10"
    );
  });
});
