import { ChakraProvider } from "@chakra-ui/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Head from "next/head"
import { AuthProvider } from "../context/AuthContext";

const client = new QueryClient();

function MyApp({ Component, pageProps }) {
	return <>
		<Head>
			<title>Planning Poker App</title>
		</Head>
		<ChakraProvider resetCSS>
			<AuthProvider>
				<QueryClientProvider client={client}>
					<Component {...pageProps} />
					<ReactQueryDevtools />
				</QueryClientProvider>
			</AuthProvider>
		</ChakraProvider>
	</>
}

export default MyApp
