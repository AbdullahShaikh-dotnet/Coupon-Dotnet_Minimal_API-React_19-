import React, { useContext } from 'react';
import UserContext from "../Utility/UserContext";
import useCouponsData from "../Utility/useCouponsData"

const Home = () => {
    const { user } = useContext(UserContext);
    const { data, error } = useCouponsData();

    type Coupon = Readonly<{
        id: number
        name: string
        couponCode: string
        percentage: number
        expireDate: Date
        createDate: Date
        isActive: boolean
    }>



    let coupons: Coupon[] = [
        {
            id: 1,
            name: "Summer Sale",
            couponCode: "SUMMER20",
            percentage: 20,
            expireDate: new Date("2025-09-01"),
            createDate: new Date(),
            isActive: true
        },
        {
            id: 2,
            name: "Monsoon Sale",
            couponCode: "MONSOON20",
            percentage: 30,
            expireDate: new Date("2025-09-01"),
            createDate: new Date(),
            isActive: true
        }
    ]


    console.log(data);
    console.log("User in Home:", user);
    /*debugger;*/

    return <>
        <div className="pt-16">
            <h1 className="text-2xl font-bold">Home</h1>
            <div className='grid grid-flow-col grid-rows-1 gap-1'>
                {
                    Object.keys(coupons[0]).map((column, index) => (

                        <h1 key={index} className='font-semibold'>{column.toUpperCase()}</h1>

                    ))
                }
            </div>
            {
                coupons.map((coupon, index) => (
                    <div key={index} className='grid grid-flow-col grid-rows-1 gap-1'>
                        {
                            Object.values(coupon).map((data, i) => (
                                <h1 key={i}>{data instanceof Date ? data.toLocaleDateString() : data}</h1>
                            ))
                        }
                    </div>
                )
                )
            }
        </div>
    </>
}

export default Home;