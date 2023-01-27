const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Agreement = require("../models/agreements");
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
    const options = {
      amount: Number(price * 100), // Total amount passed.
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log("Order :- ", order);

    // Inserting orderDetail in Order table
    const orderCreated = await Order.create({
      customer_id: req.user._id,
      razorpay_order_id: order.id,
      amount: price,
      currency: "INR",
    });
    // const orderCreatedId = orderCreated.id;
    console.log("orderCreatedId :- ", orderCreated);

    // Inserting Data into OrderItem Table
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < agreements[i].agreement_ids.length; j++) {
        const unit_price = agreements[i].unit_price;

        // Insert the Data in orderItem Table.
        await OrderItem.create({
          order_id: orderCreated._id,
          agreement_id: agreements[i].agreement_ids[j],
          unit: req.body.unit,
          price: unit_price,
        });
      }
    }

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
  console.log("PaymentVerification Services");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    Order.findOne({ razorpay_order_id })
      .then(async (order_id) => {
        if (order_id) {
          const id = order_id._id;
          await Payment.create({
            order_id: id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_payment_signature: razorpay_signature,
            payment_status: true,
          });

          // find the agreement and update its sold_status to true.
          // Query in Order_Item table
          const order_items = await OrderItem.find({ order_id: id });

          for (let i = 0; i < order_items.length; i++) {
            await Agreement.updateOne(
              { _id: order_items[i].agreement_id },
              { sold_status: true }
            );
          }
        } else {
          response.error = "No order found";
          response.httpStatus = 404;
        }
      })
      .catch((err) => {
        console.log(`error : ${err}`);
        response.message = "failed operation";
        response.httpStatus = 500;
      });
    response.message = `Payment Successful`;
    response.httpStatus = 200;
    response.data = razorpay_payment_id;
  } else {
    response.error = "Payment failed";
    response.httpStatus = 500;
  }

  return response;
};
