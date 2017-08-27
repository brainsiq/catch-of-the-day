import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  addFish = fish => {
    const fishes = {...this.state.fishes};

    fishes[`fish-${Date.now()}`] = fish;

    this.setState({ fishes });
  };

  updateFish = (key, fish) => {
    const fishes = {...this.state.fishes};

    fishes[key] = fish;

    this.setState({ fishes });
  };

  removeFish = key => {
    const fishes = {...this.state.fishes};

    fishes[key] = null;

    this.setState({ fishes });
  };

  loadSamples = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = key => {
    const order = {...this.state.order};
    order[key] = order[key] ? order[key] + 1 : 1;
    this.setState({ order })
  };

  removeFromOrder = key => {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  };

  componentWillMount() {
    const order = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (order) {
      this.setState({ order: JSON.parse(order) });
    }

    this.baseRef = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.baseRef);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>
        <Order
          removeFromOrder={this.removeFromOrder}
          fishes={ this.state.fishes }
          order={ this.state.order }
          storeId={ this.props.params.storeId }
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }

  static propTypes = {
    params: React.PropTypes.object.isRequired
  };
}


export default App;
