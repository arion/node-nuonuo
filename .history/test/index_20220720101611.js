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

const requestBillingNew = async orderNo => {
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
  console.log('response', response);

  return response.data.result.invoiceSerialNum;
};

const delay = time => new Promise(res => setTimeout(res, time));

const queryInvoiceResult = async (invoiceNum, repeatTimes = 3) => {
  const nuonuo = new Nuonuo(config);

  const { userTax } = nuonuo.config;

  const method = 'nuonuo.ElectronInvoice.queryInvoiceResult';
  const content = {
    isOfferInvoiceDetail: '1',
    orderNos: [ '' ],
    serialNos: [ invoiceNum ],
  };

  const response = await nuonuo.exec(method, content, userTax);

  // [
  //   {
  //     "address": "",
  //     "bankAccount": "",
  //     "checker": "李四",
  //     "clerk": "Zhang San",
  //     "clerkId": "",
  //     "createTime": 1658300764000,
  //     "deptId": "",
  //     "extensionNumber": "0",
  //     "imgUrls": "",
  //     "invoiceDate": 1642048200000,
  //     "invoiceType": "1",
  //     "listFlag": "0",
  //     "listName": "",
  //     "notifyEmail": "aomurbekov@gmail.com",
  //     "oldInvoiceCode": "",
  //     "oldInvoiceNo": "",
  //     "orderAmount": "200.00",
  //     "payee": "张三",
  //     "phone": "15858585858",
  //     "productOilFlag": 0,
  //     "proxyInvoiceFlag": "0",
  //     "remark": "",
  //     "saleName": "航信培训企业789113",
  //     "salerAccount": "宇宙支行123456778",
  //     "salerAddress": "Russia, Moscow",
  //     "salerTaxNum": "339902999999789113",
  //     "salerTel": "057177777777",
  //     "specificFactor": 0,
  //     "telephone": "",
  //     "terminalNumber": "",
  //     "updateTime": 1658300380000,
  //     "serialNo": "22072015060302023686",
  //     "orderNo": "s7zkl6aoph",
  //     "status": "20",
  //     "statusMsg": "开票中",
  //     "failCause": "",
  //     "pdfUrl": "",
  //     "pictureUrl": "",
  //     "invoiceCode": "",
  //     "invoiceNo": "",
  //     "exTaxAmount": "176.99",
  //     "taxAmount": "23.01",
  //     "payerName": "buyername",
  //     "payerTaxNo": "",
  //     "invoiceKind": "增值税电子普通发票",
  //     "invoiceItems": [
  //       {
  //         "deduction": "0.00",
  //         "itemCodeAbb": "日用杂品",
  //         "itemSelfCode": "",
  //         "itemName": "computer",
  //         "itemUnit": "",
  //         "itemPrice": "200.000000000000000000",
  //         "itemTaxRate": "0.13",
  //         "itemNum": "1.000000000000000000",
  //         "itemAmount": "200.00",
  //         "itemTaxAmount": "23.01",
  //         "itemSpec": "",
  //         "itemCode": "1060512990000000000",
  //         "isIncludeTax": "true",
  //         "invoiceLineProperty": "0",
  //         "zeroRateFlag": "",
  //         "favouredPolicyName": "",
  //         "favouredPolicyFlag": "0"
  //       }
  //     ]
  //   }
  // ]

  const invoice = response.data.result[0];

  if (!invoice || invoice.status !== 2) {
    if (repeatTimes > 0) {
      console.log('retry fetch invoice');
      await delay(5000);
      return queryInvoiceResult(invoiceNum, repeatTimes - 1);
    }
    throw new Error(`Can't fetch invoice: ${invoiceNum}`);

  }

  return invoice.imgUrls;
};

async function test() {
  const orderNo = Math.random().toString(36).substr(2);
  console.log('orderNo', orderNo);
  const invoiceNumber = await requestBillingNew(orderNo);
  console.log('invoiceSerialNum', invoiceNumber);
  const imgUrl = queryInvoiceResult(invoiceNumber);
  console.log('imgUrl', imgUrl);
}

test();
