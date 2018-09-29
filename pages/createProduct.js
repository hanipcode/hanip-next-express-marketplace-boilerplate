import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { Helmet } from 'react-helmet';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../layout/Navbar';
import '../styles/common.scss';
import { fetchProductTypeState, getProductTypeListState } from '../client/ducks/productType';
import redirectToLogin from '../client/helpers/redirectToLogin';
import MimeHelper from '../client/helpers/mime';
import { createProductApi } from '../client/services/product';

type CreateProductProps = {
  token: String,
  productTypeList: Array,
  fetchProductType(token: String): void,
};

type CreateProductState = {
  productName: string,
  productTypeId: string,
  productStock: number,
  productPrice: number,
  productImage: File,
  productDescription: string,
};

class CreateProduct extends React.Component<CreateProductProps, CreateProductState> {
  static async getInitialProps({
    store, isServer, pathname, query, res,
  }, token) {
    if (!token) {
      redirectToLogin(isServer, res);
      return;
    }
    await store.dispatch(fetchProductTypeState(token));
  }

  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      productTypeId: '',
      productStock: null,
      productPrice: null,
      productImage: null,
      productDescription: '',
    };
  }

  componentWillMount() {
    const { token, fetchProductType } = this.props;
    fetchProductType(token);
  }

  onSubmit(e) {
    e.preventDefault();
    const validationError = this.validateForm();
    if (validationError.isError) {
      toast(validationError.message, {
        position: 'bottom-center',
        type: 'error',
        hideProgressBar: true,
      });
      return;
    }
    const { token } = this.props;
    const {
      productDescription,
      productImage,
      productName,
      productPrice,
      productStock,
      productTypeId,
    } = this.state;
    createProductApi(
      token,
      productTypeId,
      productName,
      productPrice,
      productStock,
      productDescription,
      productImage,
    ).then((response) => {
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
        onClose: () => Router.replace('/home'),
      });
    });
  }

  validateForm() {
    const validationError = { isError: false, message: '' };
    const stateKeys = Object.keys(this.state);
    const { productImage } = this.state;
    stateKeys.forEach((key) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.state[key] === '' || !this.state[key]) {
        validationError.isError = true;
        validationError.message = 'Semua Form Harus Terisi';
      }
    });
    if (productImage && !MimeHelper.isImage(productImage.type)) {
      validationError.isError = true;
      validationError.message = 'Gambar Produk hanya support file gambar';
    }
    return validationError;
  }

  render() {
    const { productTypeList, token } = this.props;
    const {
      productDescription,
      productImage,
      productName,
      productPrice,
      productStock,
      productTypeId,
    } = this.state;
    return (
      <div>
        <Navbar isLoggedIn={token} />
        <form className="container" onSubmit={e => this.onSubmit(e)}>
          <div className="row mt4">
            <div className="input-field col s12">
              <i className="material-icons prefix">store</i>
              <input
                type="text"
                className="validate"
                value={productName}
                onChange={e => this.setState({ productName: e.currentTarget.value })}
                id="nama_produk"
              />
              <label htmlFor="nama_produk">Nama Produk</label>
              <span className="helper-text">Nama Produk yang ingin anda jual</span>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">domain</i>
              <select
                id="jenis_produk"
                onChange={e => this.setState({ productTypeId: e.currentTarget.value })}
                value={productTypeId}
              >
                <option value="" disabled selected>
                  Pilih Jenis Produk
                </option>
                {productTypeList.map(productTypeData => (
                  <option key={productTypeData._id} value={productTypeData._id}>
                    {productTypeData.name}
                  </option>
                ))}
              </select>
              <span className="helper-text">Jenis produk</span>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">grain</i>
              <input
                type="number"
                className="validate"
                id="jumlah_produk"
                value={productStock}
                onChange={e => this.setState({ productStock: e.currentTarget.value })}
              />
              <label htmlFor="jumlah_produk">Stok Produk</label>
              <span className="helper-text">Jumlah produk yang tersedia</span>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">business_center</i>
                <input
                  type="number"
                  className="validate"
                  id="harga_produk"
                  value={productPrice}
                  onChange={e => this.setState({ productPrice: e.currentTarget.value })}
                />
                <span className="helper-text">Harga per Item / Ekor</span>
              </div>
            </div>
            <div className="row">
              <div className="file-field input-field col s12">
                <div className="btn">
                  <span>File</span>
                  <input
                    type="file"
                    onChange={e => this.setState({ productImage: e.currentTarget.files[0] })}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" id="gambar_produk" />
                  <label htmlFor="gambar_produk">Gambar Produk</label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="prefix material-icons">title</i>
              <textarea
                id="deskripsi_produk"
                className="materialize-textarea"
                value={productDescription}
                onChange={e => this.setState({ productDescription: e.currentTarget.value })}
                data-length="140"
                rows={4}
              />
              <label htmlFor="deskripsi_produk">Deskripsi Produk</label>
            </div>
          </div>
          <div className="row mb5 mt3">
            <button type="submit" className="waves-effect waves-light btn col s12 m-5">
              Tambahkan ke Produk
            </button>
          </div>
        </form>
        <ToastContainer />
        <Helmet>
          <script>
            {`
              $(document).ready(function() {
                var elems = document.querySelectorAll('select');
                var instances = M.FormSelect.init(elems);
              });
              `}
          </script>
        </Helmet>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  // fetchProductType: token => dispatch(fetchProductTypeState(token)),
});

const mapStateToProps = state => ({
  productTypeList: getProductTypeListState(state.productTypeState),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateProduct);
