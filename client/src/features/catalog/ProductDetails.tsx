import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails()
{
    const {basket,status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const{id} = useParams<{id: string}>();
    const product = useAppSelector(state => productSelectors.selectById(state, id))
    const {status: productStatus} = useAppSelector(state => state.catalog);
    const [quantity, setQuantitiy] = useState(0);
    const item = basket?.items.find(i => i.producId === product?.id);

    useEffect(() => {
        if(item) setQuantitiy(item.quantity);
        if(!product) dispatch(fetchProductAsync(parseInt(id)));
    }, [id, item, dispatch, product])

    function handleInputChange(event: any){
        if(event.target.value >= 0)
        {
            setQuantitiy(parseInt(event.target.value));
        }
    }

    function handleUpdateCart(){
        if(!item ||quantity > item.quantity){
            const updatedQuantitiy = item? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({productId: product?.id! ,quantity: updatedQuantitiy}))
        }else{
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
        }
    }

    if(productStatus.includes('pending')) return <h3>Loading...</h3>

    if(!product) return <h3>Product not found</h3>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb:2}}/>
                <Typography variant='h4' color='secondary'>${(product.price/100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{product.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>{product.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>{product.type}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Brand</TableCell>
                            <TableCell>{product.brand}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Quantitiy in stock</TableCell>
                            <TableCell>{product.quantityInStock}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField 
                            onChange={handleInputChange}
                            variant='outlined'
                            type =  'number'
                            label = 'Quantitiy in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                        disabled = {item?.quantity === quantity || !item && quantity === 0}
                        loading = {status.includes('pendingRemoveItem' + item?.producId)}
                        onClick={handleUpdateCart}
                         sx={{height: '55px'}}
                         color = 'primary'
                         size= 'large'
                         variant = 'contained'
                         fullWidth
                        >
                            {item ? 'Update Quantitiy' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}