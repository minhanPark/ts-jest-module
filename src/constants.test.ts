const c = require("./constants");

describe("constants test", () => {
  it("PAYMENT_WRAPPER value type is string", () => {
    expect(typeof c.PAYMENT_WRAPPER).toBe("string");
  });
  it("value tobe __optpayments__", () => {
    expect(c.PAYMENT_WRAPPER).toBe("__optpayments__");
  });
  it("IFRAME_WRAPPER value type is string", () => {
    expect(typeof c.IFRAME_WRAPPER).toBe("string");
  });
  it("value tobe __optpayments__", () => {
    expect(c.IFRAME_WRAPPER).toBe("__optpayments-iframe__");
  });
});
