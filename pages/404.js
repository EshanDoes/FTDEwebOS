import Head from 'next/head';

export default function NotFound(){
    return (
    <div style={{ width: "100%", height: "100%", placeContent: "center", placeItems: "center", position: "absolute", left: 0, top: 0 }}>
        <Head>
            <title>404 error: Not found.</title>
        </Head>
        <h1>Page not found.</h1>
    </div>)
}