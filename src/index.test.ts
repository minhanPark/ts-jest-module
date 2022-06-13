const Optpayments = require("./index");

global.window = Object.create(window);

describe("Optpayments test", () => {
  it("throw error if client key isn't string", () => {
    try {
      Optpayments(123);
    } catch (e) {
      expect(e.message).toBe("clientKey의 타입이 문자가 아닙니다.");
    }
  });
  it("throw error if method isn't CARD", () => {
    try {
      const optpay = Optpayments(
        "test_7a588fbe8915dcb4b11e8bb088b476b43aedc960"
      );
      optpay.requestPayment({
        method: "",
        amount: 1000,
        orderId: "xxxxxxx-xxxxxx-xxxx-xxxx",
        orderName: "테스트주문",
        goodsName: "카카오몽셀",
        name: "홍길동",
        email: "gildong@naver.dcc",
        mobileNumber: "01055541215",
        address: "부산진구 부전로",
        zipCode: "15151",
        merchantReceiveUrl: "http://112.175.117.102:5555",
      });
    } catch (e) {
      expect(e.message).toBe("");
    }
  });
});
