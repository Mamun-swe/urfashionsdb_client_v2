import React, { useState } from 'react';
import './style.scss';
import Slider from 'react-slick';
import { Icon } from 'react-icons-kit';
import { ic_keyboard_arrow_left, ic_keyboard_arrow_right, ic_remove_red_eye } from 'react-icons-kit/md';
import ProductModalComponent from '../Modal/ProductModal';
import { Link } from 'react-router-dom';

const LatestProductComponent = ({ products }) => {
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    const customeSlider = React.useRef()

    const next = () => {
        customeSlider.current.slickNext()
    }
    const previous = () => {
        customeSlider.current.slickPrev()
    }

    const settings = {
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const handleModal = data => {
        setModalShow(true)
        setModalData(data)
    }

    const hideModal = () => {
        setModalShow(false)
    }

    // Replace white space with (_)
    const replaceWhiteSpace = (data) => {
        let productName = data
        productName = productName.replace(/ /g, "-")
        return productName
    }

    return (
        <div className="featured-product">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center mb-4">
                        <h1 className="text-upperrcase">Featured Products</h1>
                    </div>

                    {/* Product Slider */}
                    <div className="col-12 product-slider">
                        <Slider ref={customeSlider} {...settings}>
                            {products.length > 0 && products.map((product, i) =>
                                <div className="card rounded-0 border-0" key={i}>
                                    <div className="card-body">
                                        <Link to={`/product/${product.id}/${replaceWhiteSpace(product.name)}`}>
                                            <img src={product.image} className="img-fluid" alt="..." />
                                        </Link>

                                        {/* Button Group */}
                                        <div className="button-group text-right pr-3">
                                            <button
                                                type="button"
                                                className="btn shadow-sm icon-btn"
                                                onClick={() => handleModal(product)}
                                            >
                                                <Icon icon={ic_remove_red_eye} size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-footer rounded-0">
                                        <Link to={`/product/${product.id}/${replaceWhiteSpace(product.name)}`}>
                                            <p className="name">{product.name.slice(0, 25)}</p>
                                            <div className="d-flex pricing">
                                                <div><p>৳ {product.selling_price}</p></div>
                                                {product.selling_price < product.mrp ?
                                                    <div className="pl-2"><del>৳ {product.mrp}</del></div>
                                                    : null}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </Slider>

                        <button
                            type="button"
                            className="btn rounded-circle shadow-none prev-btn"
                            onClick={previous}
                        >
                            <Icon
                                size={25}
                                icon={ic_keyboard_arrow_left}
                                style={{ color: '#fff' }}
                            />
                        </button>

                        <button
                            type="button"
                            className="btn rounded-circle shadow-none next-btn"
                            onClick={next}
                        >
                            <Icon
                                size={25}
                                icon={ic_keyboard_arrow_right}
                                style={{ color: '#fff' }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <ProductModalComponent
                productinfo={modalData}
                show={modalShow}
                hidemodal={hideModal}
                onHide={() => setModalShow(false)}
            />
        </div>
    );
};

export default LatestProductComponent;