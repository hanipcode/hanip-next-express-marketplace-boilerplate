import React from 'react';
import Link from 'next/link';
import accounting from 'accounting';
import Lightbox from 'react-images';

import redirectToLogin from '../client/helpers/redirectToLogin';
import Navbar from '../layout/Navbar';
import { getProductDetailApi } from '../client/services/product';

import '../styles/common.scss';
import { buildImagePath } from '../client/services/helper';

export default class productDetail extends React.Component {
  static async getInitialProps({ isServer, res, query }, token) {
    // if (!token) {
    //   redirectToLogin(isServer, res);
    //   return;
    // }
    const { productId } = query;
    const productResponse = await getProductDetailApi(token, productId);
    const { data } = productResponse;
    return { productInfo: data || {} };
  }

  state = {
    isImageOpen: false,
    lightBoxIndex: 0
  };

  render() {
    const { productInfo, token } = this.props;
    const { isImageOpen, lightBoxIndex } = this.state;
    return (
      <div>
        <Navbar isLoggedIn={token} />
        <div className="container">
          {!productInfo._id && (
            <div className="mt7 col9 center-align">
              <h3>Produk tidak ditemukan</h3>
              <h5>
                Kembali ke
                {' '}
                <Link href="/" prefetch>
                  <a>Beranda</a>
                </Link>
              </h5>
            </div>
          )}
          {productInfo._id && (
            <div>
              <Link href="/" prefetch>
                <p className="mt3">
                  <a>{'< halaman awal'}</a>
                </p>
              </Link>
              <img
                src={buildImagePath(productInfo.image[0])}
                className="img-responsive product-image mt3"
                onClick={() => this.setState({ isImageOpen: true })}
              />
              <p className="center-align">
                <a onClick={() => this.setState({ isImageOpen: true })}>Lihat Galeri Produk</a>
              </p>
              <Lightbox
                images={productInfo.image.map(imageData => ({
                  src: buildImagePath(imageData).replace(
                    '/product_thumbnail/',
                    '/product_images/',
                  ),
                }))}
                isOpen={isImageOpen}
                onClickNext={() => this.setState({ lightBoxIndex: lightBoxIndex + 1})}
                onClickPrev={() => this.setState({ lightBoxIndex: lightBoxIndex - 1})}
                currentImage={lightBoxIndex}
                onClose={() => this.setState({ isImageOpen: false })}
                backdropClosesModal
              />
              <h4>{productInfo.name}</h4>
              <h6>
                {accounting.formatMoney(productInfo.price, 'Rp ', 2, '.', ',')}
                {' '}
per
                {' '}
                {productInfo.price_unit_name}
              </h6>
              <h6 className="mt4">Deskripsi Produk</h6>
              <p className="row">
                <span className="col">{productInfo.description}</span>
              </p>
              <h6>Jenis Produk</h6>
              <p className="row">
                <span className="col">{productInfo.type.name}</span>
              </p>
              <h6>Stok Produk</h6>
              <p className="row">
                <span className="col">
                  {productInfo.stock}
                  {' '}
                  {productInfo.stock_unit_name}
                </span>
              </p>
              <h6>Informasi Penjual</h6>
              <p className="row">
                <span className="col">Nama:</span>
                <span className="col">
                  {`${productInfo.user.first_name} ${productInfo.user.last_name}`}
                </span>
              </p>
              <p className="row">
                <span className="col">Alamat:</span>
                <span className="col">
                  {productInfo.user.location_name || 'Penjual belum menginput alamat'}
                </span>
              </p>
              <p className="row">
                <span className="col">Email:</span>
                <span className="col">
                  <a href={`mailto:${productInfo.user.email}`}>{productInfo.user.email}</a>
                </span>
              </p>
              <p className="row">
                <span className="col">Nomor Telepon:</span>
                <span className="col">
                  <a href={`tel:${productInfo.user.phone_number}`}>
                    {productInfo.user.phone_number}
                  </a>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
