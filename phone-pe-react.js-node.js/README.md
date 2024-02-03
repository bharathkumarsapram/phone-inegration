# PhonePe Integration

### Table of Contents: 
- Introduction
- Prerequisites
- Integration Steps
    Step 1: Obtain PhonePe Developer Credentials
    Step 2: Set Up Your Application
    Step 3: Integrate PhonePe SDK or API
    Step 4: Implement Payment Flow
- Testing
- Troubleshooting
- Resources

### Introduction
Welcome to the PhonePe Integration POC Documentation. This guide will walk you through the process of integrating PhonePe payment services into your application. 

### Prerequisites
Before you begin, ensure that you have the following:
- PhonePe Developer Account: Register on the PhonePe Developer Portal and obtain your credentials.
- Access to PhonePe Sandbox Environment: PhonePe provides a sandbox environment for testing your integration.
- Web or Mobile Application: Your application where PhonePe payments will be integrated.

### Integration Steps

## Step 1: Obtain PhonePe Developer Credentials
- Visit the PhonePe Developer Portal and sign in to your developer account. Create a new project to obtain your API keys, Merchant ID, and other required credentials.

## Step 2: Set Up Your Application
- Configure your application to use PhonePe services. This involves adding the necessary dependencies or libraries based on your platform.

## Step 3: Integrate PhonePe API
- Integrate the PhonePe API into your application. Follow the guidelines provided in the PhonePe integration documentation for your chosen platform.

## Step 4: Implement Payment Flow
- Implement the payment flow in your application. This includes initiating a payment request, handling callbacks, and updating the transaction status. You can see in below snapshots.

 ## Phonepe payment initialization.
 - api/payement API is being called.
 ```
     const data ={
        name: 'Rajnish',
        amount: 1,
        number: '7623011876',
        MUID: "PGTESTPAYUAT" + Date.now(),
        transactionId: 'T' + Date.now(),
    }

    const handlePayment = (e)=>{
        e.preventDefault();
        setLoading2(true);
        axios.post('api/payment', {...data}).then(res => {
            console.log(res.data,"res@") ;
            window.location.href = res.data
        setTimeout(() => {
            setLoading2(false);
        }, 1500);
        })
        .catch(error => {
            setLoading2(false)
            console.error(error);
        });   
    }
 ```
 ## api/payement implementation in backend side with redirect url.
 - After successfully calling this API user will be redirect to phonepe webview.
 ```
 router.post('/payment', newPayment);
 ```
 ```
 const newPayment = async (req, res) => {
    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `http://localhost:5001/api/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            // console.log(response.data)
            return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url);
        })
        .catch(function (error) {
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
 }
 ```
 ## Phonepe payment web view
 - After payment processing, phone pe will redirect user to redirect url given while payment initialization.

 ## Navigate to redirect url
 - Based on transactionId payment status will be checked.
 ```
 router.post('/status/:txnId', checkStatus);
 ```
 ```
 const checkStatus = async(req, res) => {
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
    method: 'GET',
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
    }
    };

    // CHECK PAYMENT TATUS
    axios.request(options).then(async(response) => {
        if (response.data.success === true) {
            const url = `http://localhost:5001/success`;
            return res.redirect(url)
        } else {
            const url = `http://localhost:5001/failure`;
            return res.redirect(url)
        }
    })
    .catch((error) => {

    });
 };
 ```

 ## Navigate to payment success or failure page
 - After checking status of payment user will be redirected to success or failure screen.
 ```
     axios.request(options).then(async(response) => {
        if (response.data.success === true) {
            const url = `http://localhost:5001/success`;
            return res.redirect(url)
        } else {
            const url = `http://localhost:5001/failure`;
            return res.redirect(url)
        }
    })
 ```
 ```
  <Route exact path='/success' element={<Success />} />
  <Route exact path='/failure' element={<Failure />} />
 ```

### Testing
Before deploying your integration to production, thoroughly test the PhonePe payment flow in the sandbox environment. Ensure that payments are processed correctly and handle various scenarios such as successful transactions, failures, and refunds.

### Troubleshooting
If you encounter any issues during integration or testing, refer to the PhonePe integration documentation for troubleshooting guidance. You can also reach out to PhonePe support for assistance.

### Resources
- PhonePe Developer Portal
- PhonePe Integration Documentation
- You can get example project with using React.js and Node.js by visiting this link: https://drive.google.com/file/d/16rkDFBFrDZKUs687gZiFjiAU2XJWpU1n/view?usp=sharing











