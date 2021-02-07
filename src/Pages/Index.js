import React, { useState, useEffect, createRef } from 'react';
import axios from 'axios';
import { apiURL } from '../utils/apiURL';
import Skeleton from 'react-loading-skeleton';

import NavbarComponent from '../Components/NavBar/NavBar';
import SliderComponent from '../Components/Slider/SliderComponent';
// import CampaignComponent from '../Components/Campaigns/Index';
import CategoryComponent from '../Components/Category/CategoryComponent';
import FeaturedProductsComponent from '../Components/FeaturedProducts/Index';
import LatestProductsComponent from '../Components/LatestProducts/Index';
import FooterComponent from '../Components/Footer/Index';
// import LoadingBannerComponent from '../Components/Modal/HomeLoadingModal';

const Index = () => {
    const refs = createRef()
    const windowWidth = window.innerWidth
    const [loading, setLoading] = useState(false)
    const [sliders, setSliders] = useState([])
    const [categories, setCategories] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [fakeArr] = useState([1, 2, 3, 4, 5, 6, 7, 8])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${apiURL}website`)
                if (response.status === 200) {
                    setSliders(response.data.sliders)
                    setCategories(response.data.categories)
                    setFeaturedProducts(response.data.featuredProducts)
                    setLoading(false)
                    console.log(response.data)
                }
            } catch (error) {
                if (error) {
                    console.log(error.response)
                }
            }
        }

        fetchData()
    }, [])

    // Pre Loader
    if (loading) {
        return (
            <div>
                <NavbarComponent />
                <div className="container py-2">

                    {/* Slider Loader */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card border-0" ref={refs}>
                                <Skeleton
                                    animation={true}
                                    count={1}
                                    width={refs.innerWidth}
                                    height={
                                        windowWidth > 1500 ? 400 :
                                            windowWidth > 992 ? 310 :
                                                windowWidth > 768 ? 230 :
                                                    windowWidth > 576 ? 170 : 150}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Loader */}
                    <div className="row pt-3 pb-2">
                        <div className="col-6 pr-2">
                            <div className="card border-0" ref={refs}>
                                <Skeleton
                                    animation={true}
                                    count={1}
                                    width={refs.innerWidth}
                                    height={
                                        windowWidth > 992 ? 280 :
                                            windowWidth > 768 ? 230 :
                                                windowWidth > 576 ? 170 : 150}
                                />
                            </div>
                        </div>
                        <div className="col-6 pl-2">
                            <div className="card border-0" ref={refs}>
                                <Skeleton
                                    animation={true}
                                    count={1}
                                    width={refs.innerWidth}
                                    height={
                                        windowWidth > 992 ? 280 :
                                            windowWidth > 768 ? 230 :
                                                windowWidth > 576 ? 170 : 150}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Products Loader */}
                    <div className="row px-2 pb-3">
                        <div className="col-12 text-center py-3">
                            <Skeleton animation={true} count={1} width={windowWidth > 576 ? 400 : 280} height={40} />
                        </div>

                        {fakeArr.slice(0, 4).map((k) =>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2" key={k}>
                                <div className="card border-0" ref={refs}>
                                    <Skeleton animation={true} count={1} width={refs.innerWidth} height={windowWidth > 1210 ? 315 : windowWidth > 992 ? 350 : windowWidth > 768 ? 247 : 270} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Latest Products Loader */}
                    <div className="row px-2 pb-3">
                        <div className="col-12 text-center py-3">
                            <Skeleton animation={true} count={1} width={windowWidth > 576 ? 400 : 280} height={40} />
                        </div>

                        {fakeArr.map((k) =>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2" key={k}>
                                <div className="card border-0" ref={refs}>
                                    <Skeleton animation={true} count={1} width={refs.innerWidth} height={windowWidth > 1210 ? 315 : windowWidth > 992 ? 350 : windowWidth > 768 ? 247 : 270} />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            <NavbarComponent />

            {/* Slider */}
            {sliders && sliders ?
                <SliderComponent sliders={sliders} />
                : null}

            {/* <CampaignComponent campaigns={sliders} /> */}

            {/* Category */}
            {categories &&
                categories.length > 0 ?
                <CategoryComponent categories={categories} />
                : null}

            {/* Featured Products */}
            {featuredProducts &&
                featuredProducts.length > 0 ?
                <FeaturedProductsComponent products={featuredProducts} />
                : null}

            {/* Latest Products */}
            {categories ?
                <LatestProductsComponent categories={categories} />
                : null}

            {/* Footer */}
            <FooterComponent />
        </div>
    );
};

export default Index;