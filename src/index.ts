const constants = require("./constants");
const base64 = require("base-64");

interface IPaymentData {
  amount?: string;
  orderId?: string;
  orderName?: string;
  goodsName?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  address?: string;
  zipCode?: string;
  merchantReceiveUrl?: string;
  method?: "CARD";
  mallId?: string;
  mallName?: string;
}

interface EventWithData extends Event {
  data: string;
}
interface IOptpayments {
  requestPayment(paymentData: IPaymentData): void;
  receiveMsgFromChild(e: EventWithData): void;
}

module.exports = function Optpayments(clientKey: string): IOptpayments {
  return new (function (clientKey: string) {
    if (typeof clientKey !== "string")
      throw new TypeError("clientKey의 타입이 문자가 아닙니다.");

    const actionURL = clientKey.startsWith("test_")
      ? "http://112.175.117.102:5555/optpay"
      : "http://112.175.117.102:5555/optpay";
    this.requestPayment = async function (paymentData: IPaymentData = {}) {
      try {
        if (paymentData.method !== "CARD")
          throw new TypeError("method가 올바르지 않습니다.");
        const necessaryParams = [
          "amount",
          "orderId",
          "orderName",
          "goodsName",
          "name",
          "email",
          "mobileNumber",
          "address",
          "zipCode",
          "merchantReceiveUrl",
          "method",
          "mallId",
          "mallName",
        ];
        for (let param of necessaryParams) {
          if (!paymentData.hasOwnProperty(param))
            throw new TypeError(`${param} 값이 필요합니다.`);
        }
        const { result }: { result: boolean } = await (
          await fetch("http://112.175.117.102:5555/api/public-key", {
            method: "GET",
            headers: {
              Authorization: base64.encode(clientKey),
            },
          })
        ).json();
        if (!result) throw new Error("client key가 올바르지 않습니다.");

        const wrapper = document.createElement("div");
        wrapper.setAttribute(
          "style",
          "position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 9999999; background-color: rgba(0, 0, 0, 0.6); margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: center; align-items: center;"
        );
        wrapper.setAttribute("id", constants.PAYMENT_WRAPPER);

        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", actionURL);
        form.setAttribute("target", constants.IFRAME_WRAPPER);

        const clientKeyInput = document.createElement("input");
        clientKeyInput.setAttribute("type", "hidden");
        clientKeyInput.setAttribute("name", "clientKey");
        clientKeyInput.setAttribute("value", clientKey);

        form.appendChild(clientKeyInput);

        const paymentDataParams = Object.entries(paymentData);
        for (let [name, value] of paymentDataParams) {
          const hiddenInput = document.createElement("input");
          hiddenInput.setAttribute("type", "hidden");
          hiddenInput.setAttribute("name", name);
          hiddenInput.setAttribute("value", value);
          form.appendChild(hiddenInput);
        }

        const payFrame = document.createElement("iframe");
        payFrame.setAttribute("id", constants.IFRAME_WRAPPER);
        payFrame.setAttribute("name", constants.IFRAME_WRAPPER);
        payFrame.setAttribute("border", "0");
        payFrame.setAttribute("scrolling", "no");
        payFrame.setAttribute("frameborder", "0");
        payFrame.setAttribute("width", "550");
        payFrame.setAttribute("height", "825");

        wrapper.append(form);
        wrapper.append(payFrame);
        document.body.appendChild(wrapper);
        form.submit();
      } catch (e) {
        console.error(e);
      }
    };
    function isJsonString(str: string): boolean {
      try {
        const json = JSON.parse(str);
        return typeof json === "object";
      } catch (e) {
        return false;
      }
    }
    this.receiveMsgFromChild = function (e: EventWithData) {
      if (!isJsonString(e.data)) {
        return;
      }
      const params = JSON.parse(e.data);
      if (params.type === "redirect") {
        window.location.href = params.redirectUrl;
      } else if (params.type === "close-iframe") {
        const wrapper = document.getElementById(constants.PAYMENT_WRAPPER);
        wrapper.parentElement?.removeChild(wrapper);
      } else {
        console.log("지원하지 않는 형식의 message 요청");
      }
    };
    window.addEventListener("message", this.receiveMsgFromChild);
  })(clientKey);
};
