import { ThemeContext } from "@emotion/react";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog()
{   
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

useEffect(() => {
  if(!productsLoaded) dispatch(fetchProductsAsync());
}, [productsLoaded,dispatch])

//if(status,includes('pending')) return <LoadingComponent message = 'Loading products.../>

    return(
        <>
            <ProductList products={products} />
        </>
    )
}