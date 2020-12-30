import React from 'react'
import './style.scss'
import FourOFourImg from '../../assets/static/empty_shopping_cart.png'
import { Link } from 'react-router-dom'

const Index = ({ message }) => {
    return (
        <div className="fourOfour text-center">
            <img src={FourOFourImg} className="img-fluid" alt="..." />
            <h5 className="mt-3">{message ? message : null}</h5>
            <Link
                to="/"
                type="button"
                className="btn shadow-none"
            >Back to Home</Link>
        </div>
    );
};

export default Index;