import React from 'react';

import base from '../base';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
  state = {
    uid: null,
    owner: null
  };

  handleChange = (e, key) => {
    const fish = {
      ...this.props.fishes[key],
      [e.target.name]: e.target.value
    };

    this.props.updateFish(key, fish);
  };

  authenticate = provider => {
    base.authWithOAuthPopup(provider, this.authHandler);
  };

  authHandler = (err, authData) => {
    if (err) {
      return console.error(err);
    }

    const storeRef = base.database().ref(this.props.storeId);
    storeRef.once('value', snapshot => {
      const store = snapshot.val() || {};

      if (!store.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: store.owner || authData.user.uid
      });
    });
  };

  logout = () => {
    base.unauth();
    this.setState({ uid: null });
  };

  renderLogin = () => {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>
          Log In with Github
        </button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>
          Log In with Facebook
        </button>
      </nav>
    );
  };

  renderInventory = (key) => {
    const fish = this.props.fishes[key];

    return (
      <div className="fish-edit" key={ key }>
          <input type="text" name="name" value={ fish.name } placeholder="Fish Name" onChange={e => this.handleChange(e, key)} />
          <input type="text" name="price" value={ fish.price } placeholder="Fish Price" onChange={e => this.handleChange(e, key)} />
          <select name="status" value={ fish.status } placeholder="Fish Status" onChange={e => this.handleChange(e, key)}>
            <option value="available">Fresh!</option>
            <option value="unavailable">Sold Out!</option>
          </select>
          <textarea name="desc" value={ fish.desc } placeholder="Fish Desc" onChange={e => this.handleChange(e, key)}></textarea>
          <input type="text" name="image" value={ fish.image } placeholder="Fish Image" onChange={e => this.handleChange(e, key)} />
          <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  };

  componentDidMount() {
    base.onAuth(user => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  render() {
    const logoutButton = <button onClick={this.logout}>Log Out!</button>;

    if (!this.state.uid) {
      return <div>{ this.renderLogin() }</div>
    }

    if (this.state.uid !== this.state.owner) {
      return <div>
        <p>Sorry you aren't the owner of this store!</p>
        { logoutButton }
      </div>
    }

    return (
      <div>
        <h2>Inventory</h2>
        { logoutButton }
        { Object.keys(this.props.fishes).map(this.renderInventory) }

        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>
          Load Sample Fishes
        </button>
      </div>
    )
  }

  static propTypes = {
    addFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    storeId: React.PropTypes.string.isRequired
  };
}


export default Inventory;
