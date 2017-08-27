import React from 'react';

import { formatPrice } from '../helpers';

class Fish extends React.Component {
  addToOrder = () => {
    this.props.addToOrder(this.props.index);
  };

  render() {
    const { details } = this.props;
    const isAvailable = details.status === 'available';
    const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';

    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish=name">{ details.name }</h3>
        <span className="price">{ formatPrice(details.price) }</span>
        <p>{ details.desc }</p>
        <button disabled={ !isAvailable } onClick={ this.addToOrder }>{ buttonText }</button>
      </li>
    )
  }

  static propTypes = {
    index: React.PropTypes.string.isRequired,
    details: React.PropTypes.object.isRequired,
    addToOrder: React.PropTypes.func.isRequired
  };
}


export default Fish;
