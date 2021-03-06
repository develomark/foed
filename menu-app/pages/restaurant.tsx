import React from 'react';
import { Query } from '../component/Query';
import { CardOverview } from '../container/Card/Overview';
import gql from 'graphql-tag';
import { Store } from 'Store';

interface Props {
  slug: string;
  categoryId: string;
  store: Store;
}

const RESTAURANT_DETAILS = gql`
  query getRestaurant($slug: String!) {
    restaurant(where: { slug: $slug }) {
      id
      name
      slug
      organization {
        id
        name
        slug
      }
      activeCard {
        id
        categories {
          id
          name
        }
      }
    }
  }
`;

export default class CardOverviewPage extends React.Component<Props, {}> {
  static getInitialProps({ query: { slug, categoryId } }) {
    return { slug, categoryId };
  }

  componentDidMount() {
    document.body.classList.add('order-page');
  }

  componentWillUnmount() {
    this.props.store.order.clearPreselected();
    document.body.classList.remove('order-page');
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.categoryId !== this.props.categoryId) {
      this.props.store.order.clearPreselected();
    }
  }

  render() {
    const { slug, store } = this.props;
    return (
      <Query query={RESTAURANT_DETAILS} variables={{ slug }}>
        {result => {
          const restaurant = result.data.restaurant;
          const categoryId =
            this.props.categoryId || restaurant.activeCard.categories[0].id;
          return (
            <CardOverview
              restaurant={restaurant}
              categoryId={categoryId}
              store={store}
            />
          );
        }}
      </Query>
    );
  }
}
