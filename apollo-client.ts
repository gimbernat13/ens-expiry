

import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const THEGRAPH_API_KEY = process.env.THEGRAPH_API_KEY;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: `https://gateway.thegraph.com/api/${THEGRAPH_API_KEY}/subgraphs/id/9sVPwghMnW4XkFTJV7T53EtmZ2JdmttuT5sRQe6DXhrq`,
 
    }),
  });
});


