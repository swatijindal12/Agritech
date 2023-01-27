import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Title from "../../common/Title";
import Card from "./Card";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import axios from "axios";
import { clearCart } from "../../../redux/actions/cartActions";

const Container = styled.div`
  padding: 1rem 1rem 10rem;
`;

const Box = styled.div`
  box-sizing: border-box;
  position: fixed;
  width: 100vw;
  height: fit-content;
  left: 0px;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #000000;
  padding: 1rem;
`;

const FinalAmount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;

  span {
    font-weight: 400;
  }
`;

const Cart = () => {
  const [finalAmount, setFinalAmount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const data = useSelector(store => store.cart.cart);
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //Update Final Amount on every change in cart array
    const amount = data.reduce(
      (acc, curr) => curr.price * curr.selected_quantity + acc,
      0
    );
    setFinalAmount(amount);

    //Update checkout data
    let tempCheckoutData = {
      agreements: [],
      price: 0,
    };

    data.forEach(item => {
      let agreement_ids = [];
      for (let i = 0; i < item.selected_quantity; i++) {
        agreement_ids.push(item.agreements[i]);
      }
      tempCheckoutData.agreements = [
        ...tempCheckoutData.agreements,
        {
          agreement_ids,
          unit_price: item.price,
        },
      ];
    });
    setCheckoutData({ ...tempCheckoutData, price: amount });
  }, [data]);

  const handleCheckout = async () => {
    const order = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/marketplace/checkout`,
      checkoutData,
      {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      }
    );

    console.log("here the key is ", " data is ", order);

    const options = {
      key: process.env.REACT_APP_RZORPAY_KEY,
      amount: checkoutData.price * 100,
      currency: "INR",
      name: "Agritrust",
      description: "RazorPay payment",
      image:
        "https://razorpay.com/docs/build/browser/assets/images/payment-pages-v3-pp_complete_image.jpg",
      order_id: order?.data.data.id,
      handler: function (response) {
        console.log("response :", response);
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/marketplace/paymentverification`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: "Bearer " + user?.data.token,
              },
            }
          )
          .then(res => {
            console.log("response ", res);
            dispatch(clearCart());
            alert(res.data.message);
          })
          .catch(err => console.log("Error ", err));
      },
      prefill: {
        name: "sudhanshu Kumar",
        email: "sudhanshu.kumar@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#F0EAD2",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <Container>
      <Flexbox justify="space-between">
        <Title>My Cart</Title>
      </Flexbox>
      <br />
      {data?.map((item, index) => {
        return <Card data={item} key={item.id} index={index} />;
      })}
      <Box>
        <FinalAmount>
          <span>Total </span> ₹ {finalAmount}
        </FinalAmount>

        <Button text="CHECKOUT" width="100%" onClick={handleCheckout} />
      </Box>
    </Container>
  );
};

export default Cart;