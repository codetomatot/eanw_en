import { useRouteError, Link } from "react-router-dom";

export default function ErrorRoute() {
    const error = useRouteError();
    console.log(error);

    return (
        <div id="er-pg" style={{textAlign: "center"}}>
            <h1>{error.message || error.statusText}</h1>
            <Link to="/">Return Home</Link>
        </div>
    )
}