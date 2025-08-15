import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
    const [count, setCount] = useState(0)
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCoupons() {
            try {
                const response = await fetch('/api/coupon/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiResponse = await response.json();
                setCoupons(apiResponse.result);
            } catch (err) {
                setError(err.message);
            }
        }


        const timeOut = setTimeout(() => {
            fetchCoupons();
        }, 3000)

        return () => {
            clearTimeout(timeOut)
        }

    }, [count]);

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>


            <h1>Coupons</h1>
            <div>
                {coupons.length === 0 && <h2>Loading...</h2>}
            </div>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {Array.isArray(coupons) && coupons.map((coupon, idx) => (
                    <li key={idx}>{coupon.name} - {coupon.percentage}% (Code : {coupon.couponCode})</li>
                ))}
            </ul>


        </>
    )
}

export default App
