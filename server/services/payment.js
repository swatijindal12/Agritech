const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.getKeyId = async (req) => {
  console.log("getKeyId services ");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  response.httpStatus = 200;
  response.data = process.env.RAZORPAY_KEY_ID;

  return response;
};

// create service
exports.createOrder = async (req) => {
  console.log("CreateOrder services ");
  const agreements = req.body.agreements;
  const price = req.body.price;
  const length = agreements.length;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    // Inserting Data into OrderItem Table
    for (let i = 0; i < length; i++) {
      // console.log("each :- ", agreements[i]);
      for (let j = 0; j < agreements[i].agreement_ids.length; j++) {
        // console.log("each Agreements :- ", agreements[i].agreement_ids[j]);
        const unit_price = agreements[i].unit_price;

        console.log(
          "unit price :- ",
          agreements[i].agreement_ids[j],
          unit_price
        );

        // Insert the Data in orderItem Table.
        await OrderItem.create({
          agreement_id: agreements[i].agreement_ids[j],
          unit: req.body.unit,
          price: unit_price,
        });
      }
    }

    const options = {
      amount: Number(price * 100), // Total amount passed.
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log("Order :- ", order);

    // Inserting orderDetail in Order table
    await Order.create({
      customer_id: req.user._id,
      razorpay_order_id: order.id,
      amount: price,
      currency: "INR",
    });

    response.message = `Order created successful`;
    response.httpStatus = 200;
    response.data = order;
  } catch (error) {
    response.message = `Failed operation ${error}`;
    response.httpStatus = 500;
  }

  return response;
};

// verify service working...
exports.paymentVerification = async (req) => {
  console.log("req.user :", req.user);
  console.log("PaymentVerification services ");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(
    "Payment detail :- ",
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  console.log("isAuthentic : ", isAuthentic);
  if (isAuthentic) {
    // Database comes here
    await Payment.create({
      razorpay_reference_id: razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    console.log("is authentic");
    response.message = "Working PaymentVerification...";
    response.httpStatus = 200;

    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    // );
  } else {
    response.message = "Not Working PaymentVerification...";
    response.httpStatus = 400;
  }

  return response;
};
