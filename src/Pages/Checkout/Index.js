import React, { useEffect, useState } from 'react';
import './order.scss';
import '../../styles/checkout.scss';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { productsList } from '../../Redux/Actions/cartAction';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiURL } from '../../utils/apiURL';
import { Icon } from 'react-icons-kit';
import { ic_close, ic_done_all } from 'react-icons-kit/md';

import NavBarComponent from '../../Components/NavBar/NavBar';
import FooterComponent from '../../Components/Footer/Index';

import EmptyShoppingCartImg from '../../assets/static/empty_shopping_cart.png';
import Logo from '../../assets/static/logo.png';


toast.configure({ autoClose: 2000 })
const Index = () => {
    let subTotal = 0
    const dispatch = useDispatch()
    const history = useHistory()
    let { cartProducts } = useSelector((state => state.products))
    const { register, handleSubmit, errors } = useForm()
    const [outSideDhaka, setOutSideDhaka] = useState(false)
    const [inSideDhaka, setInSideDhaka] = useState(false)
    const [shippingArea, setShippingArea] = useState()
    const [cashOnDelivery, setCashOnDelivery] = useState(true)
    const [loading, setLoading] = useState(false)
    const [shippingErr, setShippingErr] = useState(false)
    const [delivery_charge, setDelivery_charge] = useState('')
    const [isShow, setShow] = useState(false)
    const [checkOutResponseData, setCheckOutResponseData] = useState()
    const [orderCode, setOrderCode] = useState()
    const [couponInfo, setCouponInfo] = useState({})
    const [loggedUser, setLoggedUser] = useState({})


    useEffect(() => {
        dispatch(productsList())
        const getCoupon = async () => {
            const coupon = await JSON.parse(localStorage.getItem('couponData'))
            setCouponInfo(coupon)
        }
        let user = JSON.parse(localStorage.getItem('user'))
        setLoggedUser(user)
        getCoupon()
    }, [dispatch])

    const onChangeOutSideDhaka = event => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setOutSideDhaka(value)
        setInSideDhaka(false)
        setShippingArea(event.target.name)
        setDelivery_charge(120)
    }

    const onChangeInSideDhaka = event => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setOutSideDhaka(false)
        setInSideDhaka(value)
        setShippingArea(event.target.name)
        setDelivery_charge(60)
    }

    const countTotal = () => {
        if (couponInfo && couponInfo.type === 'percent') {
            const total = subTotal - (subTotal * (couponInfo.percent) / 100) + delivery_charge
            return total
        } else if (couponInfo && couponInfo.type === 'fixed') {
            const total = subTotal - couponInfo.amount + delivery_charge
            return total
        } else {
            return subTotal + delivery_charge
        }

    }

    const onSubmit = async (data) => {
        // Header 
        const header = {
            headers:
            {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        if (!shippingArea) {
            return setShippingErr(true)
        }

        const checkOutData = {
            id: loggedUser ? loggedUser.id : null,
            name: data.name,
            phone: data.phone,
            district: data.district,
            delivery_address: data.delivery_address,
            courier_name: data.courier_name,
            email: data.email,
            shipping_area: shippingArea,
            delivery_method: 'Cash on delivery',
            total_price: countTotal(),
            delivery_charge: delivery_charge,
            coupon_code: couponInfo ? couponInfo.code : null,
            discount: couponInfo && couponInfo.type === 'percent' ? couponInfo.percent : couponInfo && couponInfo.type === 'fixed' ? couponInfo.amount : null,
            discount_type: couponInfo ? couponInfo.type : null,
            products: cartProducts
        }

        try {
            setLoading(true)

            const response = await axios.post(`${apiURL}website/confirmorder`, checkOutData, header)
            if (response.status === 200) {
                setCheckOutResponseData(checkOutData)
                setOrderCode(response.data)
                setShow(true)
                localStorage.removeItem('couponData')
                localStorage.removeItem('products')
            }
            console.log(response)
        } catch (error) {
            if (error) {
                setLoading(false)
                localStorage.removeItem('couponData')
                console.log(error.response)
            }
        }
    }

    const hideModal = () => {
        setShow(false)
        history.push('/')
    }

    const downloadOrder = () => {
        window.print()
    }



    if (isShow) {
        // Order status
        return (
            <div className="card shadow rounded-0 border-0 order-card my-2">
                <div className="card-header border-bottom bg-white p-3 p-lg-4">
                    <div className="d-flex mb-2">
                        <div className="flex-fill text-right">
                            <h5 className="mb-0 mt-2">Order Status</h5>
                        </div>
                        <div className="flex-fill text-right">
                            <button
                                type="button"
                                className="btn rounded-circle shadow-none p-1 bg-light"
                                onClick={hideModal}
                            >
                                <Icon icon={ic_close} size={25} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-3 p-lg-4" id="section-to-print">
                    <div className="text-center">
                        <img src={Logo} className="img-fluid" alt="..." />
                        <br />
                        <Icon icon={ic_done_all} className="text-success" size={30} />
                        <h6>thank you, your order has been recived</h6>
                    </div>

                    <div className="row border m-2 py-3 order-details">
                        <div className="col-12 col-lg-6">
                            <p>{checkOutResponseData.name ?? null}</p>
                            <p>{checkOutResponseData.phone ?? null}</p>
                            <p className="text-lowercase">{checkOutResponseData.email ?? null}</p>
                            <p>order code: {orderCode ?? null}</p>
                        </div>
                        <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                            <h6>Delivery info</h6>
                            <p>delivery method: {checkOutResponseData.delivery_method ?? null}</p>
                            <p>delivery address: {checkOutResponseData.delivery_address ?? null}</p>
                            <p>shipping area: {checkOutResponseData.shipping_area ?? null}</p>
                            <p>courier: {
                                checkOutResponseData.courier_name && checkOutResponseData.courier_name === 'sundarban_courier' ?
                                    <span>সুন্দরবন কুরিয়ার</span>
                                    : checkOutResponseData.courier_name && checkOutResponseData.courier_name === 'kartua_courier' ?
                                        <span>করতোয়া কুরিয়ার</span>
                                        : checkOutResponseData.courier_name && checkOutResponseData.courier_name === 'janani_courier' ?
                                            <span>জননী কুরিয়ার</span>
                                            : checkOutResponseData.courier_name && checkOutResponseData.courier_name === 'dhaka_home_delivery' ?
                                                <span>ঢাকা হোম ডেলিভারি</span>
                                                : checkOutResponseData.courier_name && checkOutResponseData.courier_name === 's_a_paribahan' ?
                                                    <span>এস এ পরিবহন</span>
                                                    : null
                            }</p>
                        </div>
                    </div>

                    <div className="row products">
                        <div className="col-12 px-4 pt-4">
                            <table className="table table-sm table-borderless">
                                <thead>
                                    <tr>
                                        <td><p>Name</p></td>
                                        <td className="text-center"><p>Size</p></td>
                                        <td className="text-center"><p>Color</p></td>
                                        <td className="text-center"><p>Quantity</p></td>
                                        <td className="text-right"><p>Price</p></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkOutResponseData.products ?
                                        checkOutResponseData.products.length > 0 &&
                                        checkOutResponseData.products.map((product, i) =>
                                            <tr key={i}>
                                                <td><p>{product.name}</p></td>
                                                <td className="text-center"><p>{product.size}</p></td>
                                                <td className="text-center">
                                                    <div style={{ background: product.color, width: 20, height: 20, margin: 'auto' }}></div>
                                                </td>
                                                <td className="text-center"><p>{product.quantity}</p></td>
                                                <td className="text-right"><p>{product.quantity * product.price} tk.</p></td>
                                            </tr>
                                        ) : null}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 text-right">
                            <p style={styles.text}>Discount: {checkOutResponseData.discount ?? null}
                                {checkOutResponseData.discount_type === 'percent' ? ' %' : checkOutResponseData.discount_type === 'fixed' ? ' tk.' : null}</p>
                            <p style={styles.text}>Sub-total: {checkOutResponseData.total_price ? checkOutResponseData.total_price - checkOutResponseData.delivery_charge : null} tk.</p>
                            <p style={styles.text}>Delivery charge: {checkOutResponseData.delivery_charge ?? null} tk.</p>
                            <p style={styles.text}>Total price: {checkOutResponseData.total_price ?? null} tk.</p>
                        </div>
                    </div>
                </div>

                <div className="card-footer bg-white border-0 p-4">
                    <button
                        type="button"
                        className="btn btn-block shadow-none text-black"
                        onClick={downloadOrder}
                    >Download Boucher
                            </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout">
            <NavBarComponent />

            {cartProducts && cartProducts.length > 0 ?
                <div className="container pt-4 pb-4 pb-lg-5">
                    <div className="row">
                        <div className="col-12 text-center mb-4 mb-lg-5 mt-lg-3">
                            <div className="checkout-header">
                                <h5 className="mb-0">
                                    <span className="text-muted">shopping cart/</span>
                                    <span className="text-black">checkout</span>
                                </h5>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            {/* User Details */}
                            <div className="col-12 col-lg-7 user-details-column">
                                <div className="card rounded-0">
                                    <div className="card-body">
                                        <div className="title border-bottom mb-3">
                                            <h6 className="mb-2">billing details</h6>
                                        </div>

                                        {/* Input Fields */}
                                        <div className="input-fields">
                                            {/* Name */}
                                            <div className="form-group mb-3">
                                                {errors.name && errors.name.message ? (
                                                    <p className="text-danger">{errors.name && errors.name.message}</p>
                                                ) : <p className="text-muted">Name*</p>
                                                }

                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={loggedUser ? loggedUser.name : null}
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Name is required*"
                                                    })}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="form-group mb-3">
                                                {errors.phone && errors.phone.message ? (
                                                    <p className="text-danger">{errors.phone && errors.phone.message}</p>
                                                ) : <p className="text-muted">Phone*</p>
                                                }

                                                <input
                                                    type="text"
                                                    name="phone"
                                                    defaultValue={loggedUser ? loggedUser.phone_number : null}
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Phone is required*"
                                                    })}
                                                />
                                            </div>

                                            {/* District */}
                                            <div className="form-group mb-3">
                                                {errors.district && errors.district.message ? (
                                                    <p className="text-danger">{errors.district && errors.district.message}</p>
                                                ) : <p className="text-muted">District*</p>
                                                }

                                                <input
                                                    type="text"
                                                    name="district"
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "District is required*"
                                                    })}
                                                />
                                            </div>

                                            {/* Delivery Address */}
                                            <div className="form-group mb-3">
                                                {errors.delivery_address && errors.delivery_address.message ? (
                                                    <p className="text-danger">{errors.delivery_address && errors.delivery_address.message}</p>
                                                ) : <p className="text-muted">Delivery Address*</p>
                                                }

                                                <input
                                                    type="text"
                                                    name="delivery_address"
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Delivery Address is required*"
                                                    })}
                                                />
                                            </div>

                                            {/* Courier */}
                                            <div className="form-group mb-3">
                                                {errors.courier_name && errors.courier_name.message ? (
                                                    <p className="text-danger">{errors.courier_name && errors.courier_name.message}</p>
                                                ) : <p className="text-muted">Courier*</p>
                                                }

                                                <select
                                                    name="courier_name"
                                                    className="form-control shadow-none pl-1"
                                                    ref={register({
                                                        required: "Courier is required*"
                                                    })}
                                                >
                                                    <option value="sundarban_courier">সুন্দরবন কুরিয়ার</option>
                                                    <option value="kartua_courier">করতোয়া কুরিয়ার</option>
                                                    <option value="janani_courier">জননী কুরিয়ার</option>
                                                    <option value="dhaka_home_delivery">ঢাকা হোম ডেলিভারি</option>
                                                    <option value="s_a_paribahan">এস এ পরিবহন</option>
                                                </select>

                                            </div>

                                            {/* Email */}
                                            <div className="form-group mb-3">
                                                {errors.email && errors.email.message ? (
                                                    <small className="text-danger">{errors.email && errors.email.message}</small>
                                                ) : <p className="text-muted">Email Address</p>
                                                }

                                                <input
                                                    type="text"
                                                    name="email"
                                                    defaultValue={loggedUser ? loggedUser.email : null}
                                                    className="form-control shadow-none"
                                                    placeholder="example@gmail.com"
                                                    ref={register({
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Details */}
                            <div className="col-12 col-lg-5 mt-4 mt-lg-0 order-details">
                                <div className="card rounded-0">
                                    <div className="card-body">
                                        <div className="title border-bottom mb-3">
                                            <h6 className="mb-2">your order</h6>
                                        </div>

                                        {/* Cart Produucts */}
                                        <div className="cart-products">

                                            {cartProducts.length > 0 && cartProducts.map((product, i) =>
                                                <div className="product-single d-flex" key={i}>
                                                    <div>
                                                        <p>{product.name}</p>
                                                        <small>Quantity: {product.quantity}</small>
                                                    </div>
                                                    <div className="ml-auto pl-2">
                                                        <p>{product.price * product.quantity} tk.</p>
                                                    </div>
                                                    <div className="d-none">{subTotal += product.price * product.quantity}</div>
                                                </div>
                                            )}

                                        </div>

                                        {/* Sub Total */}
                                        <div className="sub-total border-top d-flex">
                                            <div>
                                                <p>Sub Total</p>
                                            </div>
                                            <div className="ml-auto pl-2">
                                                <p>{subTotal} tk.</p>
                                            </div>
                                        </div>

                                        {/* Shipping Area */}
                                        <div className="shipping mt-3">
                                            {shippingErr ? <p className="text-danger">Shipping area required*</p> :
                                                <p>Shipping area</p>
                                            }

                                            <div className="d-flex">
                                                <div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="out-side-dhaka"
                                                            name="Outside Dhaka"
                                                            value="120"
                                                            checked={outSideDhaka}
                                                            onChange={onChangeOutSideDhaka}
                                                        />
                                                        <label className="form-check-label" htmlFor="out-side-dhaka">Outside Dhaka</label>
                                                    </div>
                                                </div>
                                                <div className="ml-auto">
                                                    <p className="mb-2">Tk. 120</p>
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="in-side-dhaka"
                                                            name="Inside Dhaka"
                                                            value="60"
                                                            checked={inSideDhaka}
                                                            onChange={onChangeInSideDhaka}
                                                        />
                                                        <label className="form-check-label" htmlFor="in-side-dhaka">Dhaka City</label>
                                                    </div>
                                                </div>
                                                <div className="ml-auto">
                                                    <p>Tk. 60</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Discount */}
                                        {couponInfo ?
                                            <div className="sub-total d-flex mt-0">
                                                <div>
                                                    <p>Discount</p>
                                                </div>
                                                <div className="ml-auto pl-2">
                                                    {
                                                        couponInfo.type === 'percent' ?
                                                            <p>{couponInfo.percent} %</p>
                                                            : couponInfo.type === 'fixed' ?
                                                                <p>{couponInfo.amount} tk.</p>
                                                                : null

                                                    }
                                                </div>
                                            </div>
                                            : null}

                                        {/* Total */}
                                        <div className="sub-total border-top d-flex mt-0">
                                            <div>
                                                <p className="text-black">Total</p>
                                            </div>
                                            <div className="ml-auto pl-2">
                                                <p>{countTotal()} tk.</p>
                                            </div>
                                        </div>

                                        {/* Delivery Method */}
                                        <div className="delivery-method my-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    checked={cashOnDelivery}
                                                    className="form-check-input"
                                                    onChange={() => setCashOnDelivery(true)}
                                                    id="cash-on-delivery"
                                                />
                                                <label className="form-check-label" htmlFor="cash-on-delivery">Cash on delivery</label>
                                                <p>***ঢাকার বাহিরে ক্যাশ ও ডেলিভারি অর্ডার কনফার্ম করতে হলে ক্যারিয়ার চার্র্জ ১০০ টাকা অগ্রিম প্রদান করতে হবে***
                                            <br />
                                                বিকাশ নাম্বার : 01532979139

                                            <br />
                                                *Send Money* করতে হবে।
                                            </p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn text-white btn-block rounded-0 shadow-none order-place-button"
                                            disabled={loading}
                                        >
                                            {loading ? <span>Loading...</span> :
                                                <span>place order</span>
                                            }
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>


                </div>
                : <div className="container py-4">
                    <div className="row">
                        <div className="col-12 text-center empty-cart">
                            <img src={EmptyShoppingCartImg} className="img-fluid" alt="..." />
                            <h5 className="mt-3">Your Cart is Empty</h5>
                            <Link to="/" type="button" className="btn shadow-none">Back To Shopping</Link>
                        </div>
                    </div>
                </div>
            }
            <FooterComponent />

        </div>
    );
};

export default Index;

const styles = {
    text: {
        fontSize: 14,
        color: '#000',
        marginBottom: 0,
        fontWeight: 500
    }
}