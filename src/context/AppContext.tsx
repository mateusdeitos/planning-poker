import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const client = new QueryClient({
	defaultOptions: {
		mutations: {
			retry: false,
		},
		queries: {
			cacheTime: 0,
			retry: false,
		}
	}
});

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}

const theme = extendTheme({ config })

export const AppContext = ({ children }) => {
	return <ChakraProvider resetCSS theme={theme}>
		<QueryClientProvider client={client}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	</ChakraProvider>
}