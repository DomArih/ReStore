import { ThemeContext } from "@emotion/react";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Agent from "../../app/api/agent";
import AppPagination from "../../app/components/AppPagination";
import CheckBoxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to low'},
    {value: 'price', label: 'Price - Low to high'},
]

export default function Catalog()
{   
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

useEffect(() => {
  if(!productsLoaded) dispatch(fetchProductsAsync());
}, [productsLoaded,dispatch])

useEffect(() => {
    if(!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded])

if(!filtersLoaded) return <h3>Loading ...</h3>;

    return(
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb:2}}>
                    <ProductSearch />

                </Paper>

                <Paper sx = {{mb: 2, p:2}}>
                    <RadioButtonGroup 
                        selectedValue = {productParams.orderBy}
                        options = {sortOptions}
                        onChange= {(e) => dispatch(setProductParams({orderBy: e.targer.value}))}
                    />
                </Paper>

                <Paper sx = {{mb: 2, p:2}}>
                    <CheckBoxButtons 
                        items = {brands}
                        checked = {productParams.brands}
                        onChange = {(items: string[]) => dispatch(setProductParams({brands: items}))}
                    />
                </Paper>

                <Paper sx = {{mb: 2, p:2}}>
                <CheckBoxButtons 
                        items = {types}
                        checked = {productParams.types}
                        onChange = {(items: string[]) => dispatch(setProductParams({types: items}))}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                  <ProductList products={products} />
            </Grid>
           <Grid item xs={3} />
           <Grid item xs={9} sx={{mb: 2}}>
                {metaData &&
                <AppPagination
                    metaData = {metaData}
                    onPageChange = {(page:number) => dispatch(setPageNumber({pageNumber: page}))}
                />}
           </Grid>
        </Grid>
    )
}