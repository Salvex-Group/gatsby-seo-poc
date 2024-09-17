import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"

const ProductTemplate = ({ data }) => {
  const product = data.allProduct.nodes[0]
  console.log("productproduct", product)

  return (
    <>
      <Helmet>
        <title>{product.productName || product.productName}</title>
        <meta
          name="description"
          content={
            product.productName || `Details about ${product.productSlug}`
          }
        />
      </Helmet>
      <div>
        <h1>{product.productName + " " + product.productSlug}</h1>
        <img src={product.productImage} alt={product.name} />
        <p>{product.description}</p>
      </div>
    </>
  )
}

export default ProductTemplate

export const query = graphql`
  query ($id: String!) {
    allProduct(filter: { id: { eq: $id } }) {
      nodes {
        id
        productImage
        productName
        productSlug
      }
    }
  }
`
