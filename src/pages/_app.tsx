import Head from "next/head";
import { AppContext } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
	return <>
		<Head>
			<title>Planning Poker App</title>
		</Head>
		<AuthProvider>
			<AppContext>
				<Component {...pageProps} />
			</AppContext>
		</AuthProvider>
	</>
}

export default MyApp
