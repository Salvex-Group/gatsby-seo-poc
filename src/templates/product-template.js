import React from "react"
import { graphql } from "gatsby"

const ProductTemplate = props => {
  console.log("data", props)
  const { data } = props
  const product = data.allProduct.nodes[0]
  console.log("productproduct", product)

  return (
    <div>
      <h1>{product.productName + " " + product.productSlug}</h1>
      <img src={product.productImage} alt={product.name} />
      <p>{product.description}</p>
    </div>
  )
}

export default ProductTemplate
export { Head } from "../components/head"

export const query = graphql`
  query ($id: String!) {
    allProduct(filter: { id: { eq: $id } }) {
      nodes {
        id
        productImage
        productName
        productSlug
        description
      }
    }
  }
`
