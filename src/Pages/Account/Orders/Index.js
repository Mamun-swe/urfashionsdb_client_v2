import React, { useEffect, useState } from 'react';
import '../../../styles/Account/order.scss';
import './order.scss'
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { ordersList } from '../../../Redux/Actions/ordersAction';

import { Icon } from 'react-icons-kit';
import { ic_close, ic_info_outline } from 'react-icons-kit/md';

import LoadingComponent from '../../../Components/Loader';
import EmptyImage from '../../../assets/static/empty_shopping_cart.png';

const Index = () => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [singleOrder, setSingleOrder] = useState({})
    let { orders, loading, error } = useSelector((state => state.orders))

    useEffect(() => {
        dispatch(ordersList())
    }, [dispatch])

    const handleModal = data => {
        setSingleOrder(data)
        setShow(true)
    }


    if (show) {
        return (
            <div className="single-order card shadow rounded-0 border-0 my-4">
                <div className="card-header bg-white p-4">
                    <div className="d-flex">
                        <div className="flex-fill text-right">
                            <h5 className="mb-0 mt-1">Your order has been {singleOrder.status}</h5>
                        </div>
                        <div className="flex-fill text-right">
                            <button
                                type="button"
                                className="btn btn-light p-1 rounded-circle shadow-none"
                                onClick={() => setShow(false)}
                            >
                                <Icon icon={ic_close} size={25} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">

                    <div className="row">
                        <div className="col-12 ">

                            {/* Short Info */}
                            <div className="short-info mb-4">
                                <p>Order number: <span>{singleOrder.order_code}</span></p>
                                <p>Date: <span>{moment(singleOrder.created_at).format('d MMM, YYYY')}</span></p>
                                <p>Email: <span>{singleOrder.email}</span></p>
                                <p>Total: <span>{singleOrder.total_price} tk.</span></p>
                                <p>Payment method: <span>{singleOrder.delivery_method}</span></p>
                            </div>

                            {/* Messages */}
                            <div className="message" style={{ background: '#007bff' }}>
                                <div className="d-flex">
                                    <div><Icon icon={ic_info_outline} style={{ color: '#fff' }} /></div>
                                    <div className="pl-2"><p>***ঢাকার বাহিরে ক্যাশ ও ডেলিভারিতে অর্ডার কনফার্ম করতে হলে কুরিয়ার চার্র্জ ১০০ টাকা অগ্রিম প্রদান করতে হবে </p></div>
                                </div>
                            </div>

                            <div className="message" style={{ background: '#007bff' }}>
                                <div className="d-flex">
                                    <div><Icon icon={ic_info_outline} style={{ color: '#fff' }} /></div>
                                    <div className="pl-2">
                                        <p>বিকাশ নাম্বার: 01997-335500</p>
                                        <p>রকেট নাম্বার: 01925-618270-7</p>
                                    </div>
                                </div>
                            </div>

                            <div className="message" style={{ background: '#007bff' }}>
                                <div className="d-flex">
                                    <div><Icon icon={ic_info_outline} style={{ color: '#fff' }} /></div>
                                    <div className="pl-2"><p>*Send Money করতে হবে</p></div>
                                </div>
                            </div>

                            <div className="message" style={{ background: '#007bff' }}>
                                <div className="d-flex">
                                    <div><Icon icon={ic_info_outline} style={{ color: '#fff' }} /></div>
                                    <div className="pl-2"><p>*Reference এ আপনার নাম্বার দিতে হবে</p></div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="order-details my-4">
                                <h6 className="text-capitalize">Order details</h6>

                                {singleOrder.products ?
                                    singleOrder.products.length > 0 &&
                                    singleOrder.products.map((product, i) =>
                                        <div className="d-flex border-bottom mb-2 pb-2" key={i}>
                                            <div className="pr-2 pr-md-4">
                                                <img src={product.product.image} className="img-fluid" style={{ width: 60 }} alt="..." />
                                            </div>
                                            <div className="pr-2">
                                                <p>Product: <span>{product.product.name}</span></p>
                                                <p>Size: <span>{product.size}</span></p>
                                                <p>Color:
                                                    <span
                                                        style={{ background: product.color, width: 20, height: 20 }}>
                                                    </span>
                                                </p>
                                                <p>Price: <span>{product.price} tk.</span></p>
                                                <p>Quantity: <span>{product.quantity}</span></p>
                                            </div>
                                            <div className="ml-auto">
                                                <p>Total: <span>{product.price * product.quantity} tk.</span></p>
                                            </div>
                                        </div>
                                    ) : null}

                                <table className="table table-sm table-borderless">
                                    <tbody>
                                        {/* Shipping */}
                                        <tr>
                                            <td><p>Shipping:</p></td>
                                            <td className="text-right"><p>Tk. {singleOrder.delivery_charge} via {singleOrder.shipping_area}</p></td>
                                        </tr>

                                        {/* Payment Method */}
                                        <tr>
                                            <td><p>Payment method:</p></td>
                                            <td className="text-right"><p>{singleOrder.delivery_method}</p></td>
                                        </tr>

                                        {/* total */}
                                        <tr>
                                            <td><p>Total:</p></td>
                                            <td className="text-right"><p>{singleOrder.total_price} tk.</p></td>
                                        </tr>
                                    </tbody>
                                </table>

                                <hr />

                                <div className="bg-light p-2">
                                    <table className="table table-sm table-borderless table-responsive-sm mb-0">
                                        <tbody>
                                            {/* Name */}
                                            <tr>
                                                <td><p>Name:</p></td>
                                                <td className="text-capitalize"><p>{singleOrder.name}</p></td>
                                            </tr>

                                            {/* District */}
                                            <tr>
                                                <td><p>District:</p></td>
                                                <td className="text-capitalize"><p>{singleOrder.district}</p></td>
                                            </tr>

                                            {/* Courier */}
                                            <tr>
                                                <td><p>Courier:</p></td>
                                                <td>
                                                    <p>{
                                                        singleOrder.courier_name && singleOrder.courier_name === 'sundarban_courier' ?
                                                            <span>সুন্দরবন কুরিয়ার</span>
                                                            : singleOrder.courier_name && singleOrder.courier_name === 'kartua_courier' ?
                                                                <span>করতোয়া কুরিয়ার</span>
                                                                : singleOrder.courier_name && singleOrder.courier_name === 'janani_courier' ?
                                                                    <span>জননী কুরিয়ার</span>
                                                                    : singleOrder.courier_name && singleOrder.courier_name === 'dhaka_home_delivery' ?
                                                                        <span>ঢাকা হোম ডেলিভারি</span>
                                                                        : singleOrder.courier_name && singleOrder.courier_name === 's_a_paribahan' ?
                                                                            <span>এস এ পরিবহন</span>
                                                                            : null
                                                    }</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            {/* Addresses */}
                            <div className="addresses my-4">
                                <div className="d-flex">
                                    {/* Billing Address */}
                                    <div>
                                        <h6 className="text-capitalize">Billing address</h6>
                                        <p>{singleOrder.name}</p>
                                        <p>{singleOrder.district}</p>
                                        <p>{singleOrder.phone}</p>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="ml-auto">
                                        <h6 className="text-capitalize">Shipping address</h6>
                                        <p>{singleOrder.delivery_address}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        );
    } else {
        return (
            <div className="order-index">
                <div className="header text-center mt-3">
                    <h5>my orders</h5>
                </div>

                {loading ? <LoadingComponent /> :
                    error ?
                        <div className="empty-box text-center mb-4 py-0">
                            <img src={EmptyImage} className="img-fluid" alt="..." />
                            <h5>You have no orders !!</h5>
                            <Link to="/" className="btn shadow-none">Back to Shopping</Link>
                        </div> :
                        <div className="body mb-4">
                            <table className="table table-sm table-borderless table-responsive-md">
                                <thead>
                                    <tr>
                                        <td>order code</td>
                                        <td>date</td>
                                        <td>status</td>
                                        <td>total</td>
                                        <td className="text-right">action</td>
                                    </tr>
                                </thead>

                                <tbody>

                                    {orders.length > 0 && orders.map((order, i) =>
                                        <tr key={i}>
                                            <td><p>{order.order_code}</p></td>
                                            <td><p>{moment(order.created_at).format('DD MMM, YYYY')}</p></td>
                                            <td><p className="text-capitalize">{order.status}</p></td>
                                            <td><p>{order.total_price} tk.</p></td>
                                            <td className="text-right">
                                                <button
                                                    type="button"
                                                    className="btn rounded-0 shadow-none view-btn"
                                                    onClick={() => handleModal(order)}
                                                >view
                                            </button>
                                                {/* <Link to={`/account/order/${order.id}/status`}
                                                type="button"
                                                className="btn rounded-0 shadow-none btn-light text-dark invoice-btn"
                                            >invoice</Link> */}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        );
    }
};

export default Index;