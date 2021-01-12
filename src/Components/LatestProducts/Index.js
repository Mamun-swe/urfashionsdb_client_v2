import React, { useEffect, useState, createRef } from 'react';
import './style.scss';
import axios from 'axios';
import Icon from 'react-icons-kit';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiURL } from '../../utils/apiURL';
import Skeleton from 'react-loading-skeleton';
import { shoppingBag } from 'react-icons-kit/feather';
import { ic_remove_red_eye } from 'react-icons-kit/md';
import { addProduct } from '../../Redux/Actions/cartAction';
import ProductModalComponent from '../Modal/ProductModal';


const Index = ({ categories }) => {
    const refs = createRef()
    const history = useHistory()
    const windowWidth = window.innerWidth
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(18)
    const [products, setProducts] = useState([])
    const [id, setId] = useState()
    const productsPerPage = 18
    const dispatch = useDispatch()
    const [fakeArr] = useState([1, 2, 3, 4, 5, 6, 7, 8])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                let response
                if (id) {
                    response = await axios.get(`${apiURL}website/shop/${id}`)
                } else {
                    response = await axios.get(`${apiURL}website/shop`)
                }
                setProducts(response.data)
                setLimit(12)
                setLoading(false)
            } catch (error) {
                if (error) {
                    console.log(error.response);
                }
            }
        }

        // Check window width
        const windowWidth = () => {
            const width = window.innerWidth
            if (width < 576) {
                setLimit(10)
            }

            if (width > 576 && width < 768) {
                setLimit(12)
            }

            if (width > 768 && width < 992) {
                setLimit(16)
            }

            if (width > 992) {
                setLimit(30)
            }

            if (width > 1280) {
                setLimit(40)
            }

            if (width > 1500) {
                setLimit(42)
            }
        }

        fetchProducts()
        windowWidth()
    }, [id, categories])

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

    return (
        <div className="latest-products">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        <h1 className="text-upperrcase">latest products</h1>
                    </div>

                    <div className="col-12 text-center">
                        <div className="latest-product-buttons">
                            <button
                                type="button"
                                className="btn shadow-none"
                                onClick={() => setId(null)}
                            >All</button>
                            {categories.length > 0 && categories.map((category, i) =>
                                <button
                                    type="button"
                                    className="btn shadow-none"
                                    key={i}
                                    onClick={() => setId(category.id)}
                                >
                                    {category.name}
                                </button>
                            )}
                        </div>
                    </div>
                </div>


                {loading ?
                    // Pre-loader
                    <div className="row">
                        {fakeArr.map((k) =>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2" key={k}>
                                <div className="card border-0" ref={refs}>
                                    <Skeleton animation={true} count={1} width={refs.innerWidth} height={windowWidth > 1210 ? 315 : windowWidth > 992 ? 350 : windowWidth > 768 ? 247 : 270} />
                                </div>
                            </div>
                        )}
                    </div>
                    :

                    <div className="row products mt-4">
                        <div className="col-12">
                            {products && products.length > 0 && products.slice(0, limit).map((product, i) =>
                                <div className="card product" key={i}>
                                    <div className="card-body">
                                        <Link to={`/product/${product.id}/${replaceWhiteSpace(product.name)}`}>
                                            <img src={product.image} className="img-fluid" alt="..." />
                                        </Link>

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

                        {products && products.length <= limit ? null :
                            <div className="col-12 text-center">
                                <button type="button" className="btn shadow-none load-more-btn" onClick={() => setLimit(limit + productsPerPage)}>Load More</button>
                            </div>
                        }
                    </div>
                }
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
        </div>
    );
};

export default Index;