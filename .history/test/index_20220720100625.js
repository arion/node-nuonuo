'use strict';

const Nuonuo = require('../src');

const config = {
  isv: true,
  redirectUri: 'http://localhost:7001/nuonuo/redirect', // if isv is true
  authTokenUrl: 'https://open.nuonuo.com/accessToken',
  authCodeUrl: 'https://open.nuonuo.com/authorize',
  apiUrl: 'https://sandbox.nuonuocs.cn/open/v1/services',
  appKey: 'SD63236305',
  appSecret: 'SDDED2523BED4643',
  userTax: '339902999999789113',
  okCode: '0000',
  accessTokenCache: {
    store: 'memory',
    prefix: 'nuonuo',
    ttl: 86400, // 24 hours
    quota: [ 50, 2592000 ], // 50 times / 30 days
  },
};

const requestBillingNew = async (orderNo) => {
  const nuonuo = new Nuonuo(config);

  const { userTax } = nuonuo.config;

  const method = 'nuonuo.ElectronInvoice.requestBillingNew';

  const content = {
    order: {
      buyerName: 'buyername',
      salerTaxNum: userTax,
      salerTel: '057177777777',
      salerAddress: 'Russia, Moscow',
      orderNo,
      invoiceDate: '2022-01-13 12:30:00',
      clerk: 'Zhang San',
      buyerPhone: '15858585858',
      email: 'aomurbekov@gmail.com',
      invoiceType: '1',
      invoiceDetail: [
        {
          goodsName: 'computer',
          withTaxFlag: '1',
          price: '200',
          taxRate: '0.13',
          num: '1',
        },
      ],
    },
  };

  const response = await nuonuo.exec(method, content, userTax);
  // console.log('response', response);

  return response.data.result.invoiceSerialNum;
};

const queryInvoiceResult = async (invoiceNum) => {
  const nuonuo = new Nuonuo(config);

  const { userTax } = nuonuo.config;

  const method = 'nuonuo.ElectronInvoice.queryInvoiceResult';
  const content = {
    isOfferInvoiceDetail: '1',
    orderNos: [ '' ],
    serialNos: [ invoiceNum ],
  };

  const response = await nuonuo.exec(method, content, userTax);

  console.log('response', JSON.stringify(response.data.result));
};

async function test() {
  const orderNo = Math.random().toString(36).substr(2);
  console.log('orderNo', orderNo);
  const invoiceNumber = await requestBillingNew(orderNo);
  console.log('invoiceSerialNum', invoiceNumber);
  queryInvoiceResult(invoiceNumber);
}


test();
