import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { FloatingButtons } from '../../component/FloatingButtons';
import { Button } from '../../component/Button';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Store, PaymentStatus } from '../../Store';
import R from '../../routes';

const PLACE_ORDER = gql`
  mutation placeOrder($data: PlaceOrderInput!) {
    placeOrder(data: $data) {
      id
      number
    }
  }
`;

interface Props {
  store: Store;
}

@observer
export class PaymentButton extends React.Component<Props, {}> {
  @observable isSubmitting = false;

  handlePay = async mutate => {
    const { store } = this.props;
    this.isSubmitting = true;
    try {
      const { data } = await mutate({
        variables: {
          data: {
            items: store.order.items.map(item => ({
              cardItem: item.cardItem.id,
              subitems: item.subitems.map(subitem => subitem.id),
              restaurant: item.restaurant.id,
            })),
            tip: store.order.tip,
          },
        },
      });
      store.setPaymentAttempt(data.placeOrder);
      R.Router.replaceRoute(`/order?status=${PaymentStatus.Success}`);
    } catch (err) {
      console.error('Error with payment', err);
      store.setPaymentAttempt();
      R.Router.replaceRoute(`/order?status=${PaymentStatus.Error}`);
    }
    this.isSubmitting = false;
  };

  render() {
    return (
      <Mutation mutation={PLACE_ORDER}>
        {mutate => (
          <FloatingButtons>
            <Button
              onClick={() => this.handlePay(mutate)}
              disabled={this.isSubmitting}
            >
              Pay
            </Button>
          </FloatingButtons>
        )}
      </Mutation>
    );
  }
}
