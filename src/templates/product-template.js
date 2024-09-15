import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"

const ProductTemplate = ({ data }) => {
  const product = data.allMongodbProductsGetsby

  return (
    <>
      <Helmet>
        <title>{product.productName || product.productName}</title>
        <meta
          name="description"
          content={
            product.productName || `Details about ${product.productName}`
          }
        />
      </Helmet>
      <div>
        <h1>{product.productName}</h1>
        <img src={product.productImage} alt={product.name} />
        <p>{product.description}</p>
      </div>
    </>
  )
}

export default ProductTemplate

export const query = graphql`
  query ($id: String!) {
    allMongodbProductsGetsby(id: { eq: $id }) {
      id
      productImage
      productName
      productSlug
      mongodb_id
    }
  }
`
