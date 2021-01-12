import React, { useEffect, useState, createRef } from 'react';
import './style.scss';
import axios from 'axios';
import queryString from 'query-string';
import { Icon } from 'react-icons-kit';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiURL } from '../../utils/apiURL';
import Skeleton from 'react-loading-skeleton';
import { shoppingBag } from 'react-icons-kit/feather';
import { ic_remove_red_eye } from 'react-icons-kit/md';
import { addProduct } from '../../Redux/Actions/cartAction';

import NavBarComponent from '../../Components/NavBar/NavBar';
import FooterComponent from '../../Components/Footer/Index';
import ProductModalComponent from '../../Components/Modal/ProductModal';

import NotFoundImg from '../../assets/static/empty_shopping_cart.png';

const Index = (props) => {
    const refs = createRef()
    const history = useHistory()
    const windowWidth = window.innerWidth
    const [isLoading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    const value = queryString.parse(props.location.search).query
    const dispatch = useDispatch()
    const [fakeArr] = useState([1, 2, 3, 4, 5, 6, 7, 8])

    useEffect(() => {
        const filterProducts = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${apiURL}website/search/${value}`)
                setProducts(response.data)
                setLoading(false)
            } catch (error) {
                if (error) console.log(error.response)
            }
        }

        filterProducts()
    }, [value])

    const handleModal = data => {
        setModalShow(true)
        setModalData(data)
    }

    const hideModal = () => {
        setModalShow(false)
    }

    // Add to cart
    const addToCart = data => {
        const newData = {
            id: data.id,
            cartId: Date.now(),
            name: data.name,
            price: data.selling_price,
            stock: data.stock,
            image: data.image,
            quantity: 1,
            sku: data.sku,
            available_quantity: parseInt(data.quantity),
            size: data.size ? data.size[0] : null,
            color: data.color ? data.color[0] : null
        }
        dispatch(addProduct(newData))
    }

    // Single Sale
    const singleSale = data => {
        addToCart(data)
        history.push('/checkout')
    }

    // Replace white space with (_)
    const replaceWhiteSpace = (data) => {
        let productName = data
        productName = productName.replace(/ /g, "-")
        return productName
    }

    // Discount Percent
    const discount = (mrp, selling_price) => {
        let subtraction = mrp - selling_price
        let percenteg = parseInt((subtraction * 100) / mrp)
        return percenteg
    }

    // Pre-loading
    if (isLoading) {
        return (
            <div className="search-result">
                <NavBarComponent />
                <div className="container py-4">
                    <div className="row">
                        <div className="col-12 text-center mb-3">
                            <Skeleton animation={true} count={1} width={windowWidth > 576 ? 450 : 280} height={40} />
                        </div>

                        <div className="col-12">
                            {fakeArr.map((i) =>
                                <div className="card product" ref={refs} key={i}>
                                    <Skeleton animation={true} count={1} width={refs.innerWidth} height={windowWidth > 1210 ? 315 : windowWidth > 992 ? 350 : windowWidth > 768 ? 247 : 200} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="search-result">
            <NavBarComponent />

            <div className="container py-4">
                <div className="row">
                    <div className="col-12 text-center mb-3">
                        <h5>You search for: {value}</h5>
                    </div>

                    {/* Products */}
                    {products.length > 0 ?
                        <div className="col-12">
                            {products.map((product, i) =>
                                <div className="card product" key={i}>
                                    <div className="card-body">
                                        <Link to={`/product/${product.id}/${replaceWhiteSpace(product.name)}`}>
                                            <img src={product.image} className="img-fluid" alt="..." />
                                        </Link>

                                        {/* Discount Sticker */}
                                        {product.selling_price < product.mrp ?
                                            <div className="discount-sticker text-center">
                                                <p>OFF {discount(product.mrp, product.selling_price)}%</p>
                                            </div>
                                            : null}

                                        {/* Button Group */}
                                        <div className="button-group text-center">
                                            <button
                                                type="button"
                                                className="btn shadow-sm icon-btn"
                                                onClick={() => handleModal(product)}
                                            >
                                                <Icon icon={ic_remove_red_eye} size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn shadow-sm mx-1 content-btn"
                                                onClick={() => singleSale(product)}
                                            >Buy Now</button>
                                            <button
                                                type="button"
                                                className="btn shadow-sm icon-btn"
                                                onClick={() => addToCart(product)}
                                            >
                                                <Icon icon={shoppingBag} size={18} />
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
                        </div>
                        :
                        <div className="col-12 text-center four-o-four mt-3">
                            <img src={NotFoundImg} className="img-fluid" alt="..." />
                            <h5 className="mt-3">0 Results</h5>
                            <Link to="/" type="button" className="btn shadow-none">Back To Shopping</Link>
                        </div>
                    }
                </div>
            </div>

            {/* Product Modal */}
            {modalShow ?
                <ProductModalComponent
                    productinfo={modalData}
                    show={modalShow}
                    hidemodal={hideModal}
                    onHide={() => setModalShow(false)}
                />
                : null}


            <FooterComponent />
        </div>
    );
};

export default Index;