import React from 'react';

import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Order extends React.Component {
  renderOrder = (orderId) => {
    const fish = this.props.fishes[orderId];
    const count = this.props.order[orderId];
    const removeButton = <button onClick={() => this.props.removeFromOrder(orderId) }>&times;</button>;

    if (!fish || fish.status === 'unavailable') {
      return (
        <li key={orderId}>
          Sorry, { fish ? fish.name : 'fish' } is no longer available!
          {removeButton}
        </li>
      )
    }

    return (
      <li key={orderId}>
        <span>
          <CSSTransitionGroup
            component="span"
            className="count"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <span key={count}>{ count }</span>
          </CSSTransitionGroup>
          lbs { fish.name } {removeButton}
        </span>
        <span className="price">{ formatPrice(count * fish.price) }</span>
      </li>
    )
  };

  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';

      return isAvailable ? prevTotal + (fish.price * count || 0) : prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2>Your Order</h2>
        <CSSTransitionGroup
          component="ul"
          transitionName="order"
          className="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          { orderIds.map(this.renderOrder) }
          <li className="total">
            <strong>Total:</strong>
            {formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    );
  }
  
  static propTypes = {
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  };
}


export default Order;
