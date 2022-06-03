(() => {
  var o,
    t,
    r = {
      601: (o, t) => {
        (t.PAYMENT_WRAPPER = "__optpayments__"),
          (t.IFRAME_WRAPPER = "__optpayments-iframe__");
      },
    },
    _ = {};
  (o = (function o(t) {
    var e = _[t];
    if (void 0 !== e) return e.exports;
    var n = (_[t] = { exports: {} });
    return r[t](n, n.exports, o), n.exports;
  })(601)),
    console.log(o.PAYMENT_WRAPPER),
    (t = "".concat(o.IFRAME_WRAPPER, " ").concat(15)),
    console.log(t);
})();
