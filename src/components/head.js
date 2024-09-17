import React from "react"
export const Head = ({ location, params, data, pageContext }) => (
  <>
    <title>{pageContext.productSlug}</title>
    <meta name="description" content={data.description} />
    <meta
      name="twitter:url"
      content={`https://www.foobar.tld/${location.pathname}`}
    />
  </>
)
