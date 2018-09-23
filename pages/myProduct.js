import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import accounting from 'accounting';
import Link from 'next/link';

import Navbar from '../layout/Navbar';
import Loading from '../layout/Loading';
import redirectToLogin from '../client/helpers/redirectToLogin';
import { getCurrentUserProductApi, deleteProductApi } from '../client/services/product';

import '../styles/common.scss';
import 'react-toastify/dist/ReactToastify.css';
import { buildImagePath } from '../client/services/helper';

type MyProductProps = {
  token: string,
};

type MyProductState = {
  currentUserProduct: Object,
  isLoading: boolean,
};

export default class MyProduct extends React.Component<MyProductProps, MyProductState> {
  static async getInitialProps({ isServer, res }, token) {
    if (!token) {
      redirectToLogin(isServer, res);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUserProduct: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    this.fetchCurrentUserProduct();
  }

  fetchCurrentUserProduct() {
    const { token } = this.props;
    return getCurrentUserProductApi(token).then((response) => {
      if (response.error) {
        toast(response.message, {
          position: 'bottom-center',
          type: 'error',
          hideProgressBar: true,
        });
        throw new Error(response.error + response.message);
      }
      const { data } = response;
      this.setState({ currentUserProduct: data, isLoading: false });
    });
  }

  deleteProduct(e, productId) {
    e.preventDefault();
    const { token } = this.props;
    this.setState({ isLoading: true });
    deleteProductApi(token, productId)
      .then((response) => {
        if (response.error) {
          toast(response.message, {
            position: 'bottom-center',
            type: 'error',
            hideProgressBar: true,
          });
          return;
        }
        toast(response.message, {
          position: 'bottom-center',
          type: 'success',
          hideProgressBar: true,
        });
      })
      .then(this.fetchCurrentUserProduct.bind(this))
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
        toast('Error saat Menghapus Produk', {
          position: 'bottom-center',
          type: 'error',
          hideProgressBar: true,
        });
      });
  }

  render() {
    const { token } = this.props;
    const { isLoading, currentUserProduct } = this.state;
    // console.log(currentUserProduct);
    return (
      <div>
        <Navbar isLoggedIn={token} />
        <h3 className="tc">Produk Saya</h3>
        {currentUserProduct.length === 0 && (
          <div className="col center-align">
            <p className="mt5">Anda belum membuat produk</p>
            <Link href="/product/add" prefetch>
              <a>Buat Produk</a>
            </Link>
          </div>
        )}
        {currentUserProduct.map(productData => (
          <div className="row">
            <div className="col s12 m7">
              <div className="card">
                <div className="card-image ">
                  <img
                    className="responsive-img product-image"
                    src={buildImagePath(productData.image)}
                  />
                  <span className="card-title">{productData.name}</span>
                </div>
                <div className="card-stacked">
                  <div className="card-content">
                    <p>{productData.description}</p>
                  </div>
                  <ul className="collection">
                    <li className="collection-item">
                      <strong>
                        {accounting.formatMoney(productData.price, 'Rp ', 2, '.', ',')}
                      </strong>
                    </li>
                    <li className="collection-item">
                      <strong>Stok(persediaan) : </strong>
                      {`${productData.stock}`}
                    </li>
                    <li className="collection-item">
                      <strong>Jenis Produk : </strong>
                      {`${productData.type.name}`}
                    </li>
                  </ul>
                  <div className="card-action">
                    {/* <a href="#">EDIT</a> */}
                    <a
                      href="#"
                      onClick={e => this.deleteProduct(e, productData._id)}
                      className="red-text"
                    >
                      HAPUS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <ToastContainer />
        <Loading isVisible={isLoading} />
      </div>
    );
  }
}
