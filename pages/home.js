import React from 'react';
import { connect } from 'react-redux';
import accounting from 'accounting';
import Link from 'next/link';

import Navbar from '../layout/Navbar';

import { getUserDataState, getUserAccessTokenState } from '../client/ducks/user';
import Loading from '../layout/Loading';
import redirectToLogin from '../client/helpers/redirectToLogin';
import { getAllProductApi } from '../client/services/product';

import '../styles/common.scss';

type HomeState = {
  isLoading: boolean,
  productList: Array,
  searchText: string,
};

class Home extends React.Component<null, HomeState> {
  static async getInitialProps({ isServer, res }, token) {}

  state = {
    isLoading: true,
    productList: [],
    searchText: '',
  };

  componentWillMount() {
    this.fetchProductList();
  }

  fetchProductList() {
    const { token } = this.props;
    getAllProductApi(token)
      .then((response) => {
        if (response.data) {
          this.setState({ productList: response.data });
        }
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  isLoggedIn(token: string) {
    if (token !== null && token !== undefined) {
      return true;
    }
    return false;
  }

  render() {
    const { token } = this.props;
    const { isLoading, productList, searchText } = this.state;
    return (
      <div>
        <Navbar isLoggedIn={this.isLoggedIn(token)} />
        <Loading isVisible={isLoading} />
        {!this.isLoggedIn(token) && (
          <div className="col s12 center-align mr4 mt4 ml4">
            <p>
              Anda masuk sebagai pembeli, Untuk memulai berjualan anda dapat
              <Link href="/register" prefetch>
                <a> Mendaftar </a>
              </Link>
              atau
              <Link href="/login" prefetch>
                <a> Login.</a>
              </Link>
            </p>
          </div>
        )}
        <div className="row mt4">
          <div className="nav-wrapper">
            <form className="center-align">
              <div className="input-field">
                <input
                  id="search"
                  type="search"
                  value={searchText}
                  onChange={e => this.setState({ searchText: e.currentTarget.value })}
                  placeholder="Cari Produk"
                  required
                />
                <label className="label-icon" htmlFor="search">
                  <i className="material-icons">search</i>
                </label>
                <i className="material-icons">close</i>
              </div>
              {searchText.length > 0 && (
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Cari
                  <i className="material-icons right">search</i>
                </button>
              )}
            </form>
          </div>
          {productList.map(productData => (
            <div className="col s6 mt3">
              <div className="card">
                <div className="card-image ">
                  <img className="responsive-img product-thumbnail" src={productData.image} />
                </div>
                <div className="card-content">
                  <p>
                    <span className="card-title">{productData.name}</span>
                  </p>
                  <p>
                    <span>{`${productData.user.first_name} ${productData.user.last_name}`}</span>
                  </p>
                  <h6 className="mb4">
                    {accounting.formatMoney(productData.price, 'Rp ', 2, '.', ',')}
                  </h6>
                  <Link
                    href={{ pathname: '/productDetail', query: { productId: productData._id } }}
                    as={`/product/detail/${productData._id}`}
                    prefetch
                  >
                    <a className="blue-text">Lihat Produk</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userState: getUserDataState(state.userState),
});

export default connect(mapStateToProps)(Home);
