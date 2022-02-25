import { ChakraProvider } from "@chakra-ui/react"
import { QueryClientProvider, QueryClient } from 'react-query'
import Head from "next/head"

const client = new QueryClient();

function MyApp({ Component, pageProps }) {
	return <>
		<Head>
			<title>Planning Poker App</title>
		</Head>
		<ChakraProvider resetCSS>
			<QueryClientProvider client={client}>
				<Component {...pageProps} />
			</QueryClientProvider>
		</ChakraProvider>
	</>
}

export default MyApp
