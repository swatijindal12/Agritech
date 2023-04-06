import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Title from "../../common/Title";
import Card from "./Card";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import axios from "axios";
import { clearCart } from "../../../redux/actions/cartActions";
import FallbackIcon from "../../../assets/empty-cart.svg";
import Modal from "./Modal";
import Logo from "../../../assets/logo.png";

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

const Fallback = styled.img`
  height: 100px;
  width: 100px;
  opacity: 0.3;
`;

const CardsContainer = styled(Flexbox)`
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Error = styled.p`
  font-size: 1rem;
  color: red;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Cart = () => {
  const [finalAmount, setFinalAmount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(false);

  const data = useSelector(store => store.cart.cart);
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showSuccessModal) {
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.href = "/contracts";
      }, 2000);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    //Update Final Amount on every change in cart array
    const amount = data.reduce(
      (acc, curr) => curr._id.price * curr.selected_quantity + acc,
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
          unit_price: item._id.price,
        },
      ];
    });

    setCheckoutData({ ...tempCheckoutData, price: amount });
  }, [data]);

  const handleCheckout = async () => {
    if (data.length == 0) {
      return;
    }
    let order;
    try {
      order = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/marketplace/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      );
      // console.log("order data", order.data)
      if(order.data.error){
        setError(order.data.error)
      }
    } catch (err) {
      // console.log("error while buy contract", err);
      setError(err.order.data.error);
    }
    // console.log("here the key is ", " data is ", order);

    const options = {
      key: process.env.REACT_APP_RZORPAY_KEY,
      amount: checkoutData.price * 100,
      currency: "INR",
      name: "Agritrust",
      description: "RazorPay payment",
      image: Logo,
      order_id: order?.data.data.id,
      handler: function (response) {
        // console.log("response :", response);
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
            // console.log("response ", res);
            dispatch(clearCart());
            setShowSuccessModal(true);
          })
          .catch(err => console.log("Error ", err));
      },
      prefill: {
        name: user?.data.name,
        email: user?.data.email,
        contact: user?.data.phone,
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
    <>
      {showSuccessModal && <Modal />}

      <Container>
        <Flexbox justify="space-between">
          <Title>My Cart</Title>
        </Flexbox>
        <br />
        <CardsContainer>
          {data?.length > 0 ? (
            data?.map((item, index) => {
              return <Card data={item} key={item.id} index={index} />;
            })
          ) : (
            <Flexbox style={{ opacity: "0.3" }} margin="5rem 0">
              <Fallback src={FallbackIcon} />
              <p>Empty</p>
            </Flexbox>
          )}
        </CardsContainer>
        <Box>
          <FinalAmount>
            <span>Total </span> ₹ {finalAmount}
          </FinalAmount>
          {error && <Error>Error : {error}</Error>}

          <Button
            text="CHECKOUT"
            width="30%"
            onClick={handleCheckout}
            disabled={data.length === 0}
          />
        </Box>
      </Container>
    </>
  );
};

export default Cart;
