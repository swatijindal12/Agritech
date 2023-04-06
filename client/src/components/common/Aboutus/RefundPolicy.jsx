import React from "react";
import styled from "styled-components";
import Title from "../Title";
import { useSelector } from "react-redux";
import BackButton from "../../../assets/back-button.svg";
import Flexbox from "../Flexbox";

const Container = styled.div`
  padding: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #6c584c;
  margin-top: 1.5rem;
  margin-bottom: 4rem;
  @media screen and (max-width: 990px){
    margin-bottom: 11.5rem;
  }
`;

const Back = styled.img`
  cursor: pointer;
`;

const ContactUs = () => {
  const user = useSelector(store => store.auth.user);

  return (
    <Container>
      {!user ? (
        <Flexbox justify="space-between">
          <Back src={BackButton} onClick={() => window.history.go(-1)} />
          <Title>Returns and Refunds Policy</Title>
        </Flexbox>
      ) : (
        <Title>Returns and Refunds Policy</Title>
      )}
      <Description>
        Thank you for shopping at www.soulbiofarms.com. If for any reason, you
        are not completely satisfied with a purchase, we invite you to review
        our policy on refunds and returns. The following terms are applicable
        for any products that you’ve purchased from us.
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        The words in which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in the plural.
        <br />
        <h3>Definitions</h3>
        For the purposes of this Return and Refund Policy:
        <br /> <br />
        “Company” (referred to as either "the Company", "We", "Us" or "Our" in
        this Agreement) refers to SOUL Society for Organic Farming Research &
        Education
        <br />
        “Goods” refers to the items offered for sale.
        <br />
        “Orders” means a request by you to purchase goods from us.
        <br />
        “Website” refers to www.soulbiofarms.com, accessible from
        https://www.soulbiofarms.com
        <br />
        “You” means the individual accessing or using the service, or the
        company, or other legal entity on behalf of which such individual is
        accessing or using the service, as applicable.
        <br />
        <h3>Your Order Cancellation Rights</h3>
        You are entitled to cancel your order within 14 days without giving any
        reason for doing so.
        <br />
        The deadline for canceling an Order is 14 days from the date on which
        you received the goods or on which a third party you have appointed, who
        is not the carrier, takes possession of the product delivered.
        <br />
        In order to exercise your right of cancellation, you must inform us of
        your decision by means of a clear statement.
        <br />
        We will reimburse you no later than 14 days from the day on which we
        receive the returned Goods. We will use the same means of payment as you
        used for the Order, and you will not incur any fees for such
        reimbursement.
        <br />
        <h3>Conditions for Returns</h3>
        In order for the Goods to be eligible for a return, please make sure
        that:
        <br />
        <br />
        The goods were purchased in the last 14 days
        <br />
        The goods are in the original packaging
        <br />
        The following goods cannot be returned:
        <br />
        The supply of goods is made to your specifications or clearly
        personalized.
        <br />
        The supply of goods which according to their nature are not suitable to
        be returned, deteriorate rapidly or where the date of expiry is over.
        <br />
        The supply of goods that are not suitable for return due to health
        protection or hygiene reasons and were unsealed after delivery.
        <br />
        The supply of goods which are, after delivery, according to their
        nature, inseparably mixed with other items.
        <br /> <br />
        We reserve the right to refuse returns of any merchandise that does not
        meet the above return conditions at our sole discretion.
        <h3>Returning Goods</h3>
        You are responsible for the cost and risk of returning the goods to Us.
        You should send the goods to the following address:
        <br />
        Coral Woods, Coral Woods, Hoshangabad Rd, Misrod, Bhopal, Madhya Pradesh
        462047, India
        <br />
        We cannot be held responsible for goods damaged or lost in return
        shipment. Therefore, we recommend an insured and trackable mail service.
        We are unable to issue a refund without actual receipt of the goods or
        proof of received return delivery.
        <br />
      </Description>
    </Container>
  );
};

export default ContactUs;
