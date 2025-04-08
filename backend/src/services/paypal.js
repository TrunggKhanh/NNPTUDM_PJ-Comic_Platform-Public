const axios = require('axios')

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })

    return response.data.access_token
}

// exports.createOrder = async () => {
//     const accessToken = await generateAccessToken()

//     const response = await axios({
//         url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
//         method: 'post',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + accessToken
//         },
//         data: JSON.stringify({
//             intent: 'CAPTURE',
//             purchase_units: [
//                 {
//                     items: [
//                         {
//                             name: 'Node.js Complete Course',
//                             description: 'Node.js Complete Course with Express and MongoDB',
//                             quantity: 1,
//                             unit_amount: {
//                                 currency_code: 'USD',
//                                 value: '100.00'
//                             }
//                         }
//                     ],

//                     amount: {
//                         currency_code: 'USD',
//                         value: '100.00',
//                         breakdown: {
//                             item_total: {
//                                 currency_code: 'USD',
//                                 value: '100.00'
//                             }
//                         }
//                     }
//                 }
//             ],

//             application_context: {
//                 return_url: process.env.BASE_URL + '/paypal/complete-order',
//                 cancel_url: process.env.BASE_URL + '/paypal/cancel-order',
//                 shipping_preference: 'NO_SHIPPING',
//                 user_action: 'PAY_NOW',
//                 brand_name: 'manfra.io'
//             }
//         })
//     })
//     console.log('PayPal Response:', JSON.stringify(response.data, null, 2));
//     return response.data.links.find(link => link.rel === 'approve').href
// }

exports.createOrder = async (amount, description) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        data: {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: description || 'Thanh toán đơn hàng', // Mô tả sản phẩm
                            description: description || 'Thanh toán đơn hàng thông qua PayPal',
                            quantity: 1,
                            unit_amount: {
                                currency_code: 'USD', // Loại tiền tệ
                                value: amount.toFixed(2), // Giá trị thanh toán
                            },
                        },
                    ],
                    amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount.toFixed(2),
                            },
                        },
                    },
                },
            ],
            application_context: {
                return_url: `${process.env.BASE_URL}/paypal/complete-order`, // URL khi thanh toán thành công
                cancel_url: `${process.env.BASE_URL}/paypal/cancel-order`, // URL khi hủy thanh toán
                shipping_preference: 'NO_SHIPPING', // Không yêu cầu địa chỉ giao hàng
                user_action: 'PAY_NOW',
                brand_name: 'Mangasmurf', // Tên thương hiệu hiển thị trên PayPal
            },
        },
    });

    console.log('PayPal Response:', JSON.stringify(response.data, null, 2));

    // Lấy URL phê duyệt từ phản hồi
    return response.data.links.find((link) => link.rel === 'approve').href;
};


exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })

    return response.data
}