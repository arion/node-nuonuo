"use strict";

const Nuonuo = require("../src");

const config = {
  isv: true,
  redirectUri: "http://localhost:7001/nuonuo/redirect", // if isv is true
  authTokenUrl: "https://open.nuonuo.com/accessToken",
  authCodeUrl: "https://open.nuonuo.com/authorize",
  apiUrl: "https://sandbox.nuonuocs.cn/open/v1/services",
  appKey: "SD63236305",
  appSecret: "SDDED2523BED4643",
  userTax: "339902999999789113",
  okCode: "0000",
  accessTokenCache: {
    store: "memory",
    prefix: "nuonuo",
    ttl: 86400, // 24 hours
    quota: [50, 2592000], // 50 times / 30 days
  },
};

const nuonuo = new Nuonuo(config);

const {
  appKey,
  appSecret,
  accessTokenCache,
  userTax,
  okCode: code,
  redirectUri,
} = nuonuo.config;
// const cacheKey = [ accessTokenCache.prefix, appKey, userTax ].join('-');
// const cacheVal = { access_token: 'ACCESS_TOKEN', expires_in: 86400 };
// nuonuo.getCache(cacheKey).then(res => console.log({ getCache: res }));
// nuonuo.setCache(cacheKey, cacheVal, accessTokenCache).then(res => console.log({ setCache: res }));

// nuonuo
//   .getMerchantToken(appKey, appSecret)
//   .then((res) => console.log({ getMerchantToken: res }));

const runTest = async () => {
  const tokenResponse = await nuonuo.getIsvToken(
    appKey,
    appSecret,
    code,
    userTax,
    redirectUri,
    "client_credentials" // is it correct?
  );
  console.log("tokenResponse", tokenResponse); // { access_token: 'fa35aa5f2feb821e9c02c00rv25gy93s', expires_in: 86400 }

  const senid = nuonuo.senid();
  console.log({ senid }); // { senid: 'bf22c343fd794c048e9c8e7f7873aa1e' }

  const method = "nuonuo.ElectronInvoice.queryInvoiceResult";
  const content = {
    isOfferInvoiceDetail: "1",
    orderNos: [""],
    serialNos: ["22021114442603319271"],
  };

  nuonuo.exec(method);
};

runTest();
