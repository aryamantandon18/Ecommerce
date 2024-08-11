import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import MetaData from "../layouts/MetaData";
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StorageIcon from '@mui/icons-material/Storage';
// import {
//   FormHelperText,
//   Grid,
//   Input,
//   InputLabel,
//   TextField,
// } from "@mui/material";
import toast from "react-hot-toast";
import { clearErrors, getProductDetails, updateProduct } from "../../actions/productActions";
import { useNavigate, useParams } from "react-router-dom";
import {UPDATE_PRODUCT_RESET} from "../../constants/productConstants";
import { Button } from "@mui/material";

const UpdateProduct = () => {
    const {id} = useParams();
  const dispatch = useDispatch();
  const { error:updateError, isUpdated,loading } = useSelector((state) => state.deleteProduct);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages,setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const navigate = useNavigate();

  const {error,product} = useSelector(state=>state.productDetails)

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Electronics",
    "Camera",
    "SmartPhones",
    "Cars",
    "Shoes",
    "Watch",
    "women",
    "men",
  ];

  useEffect(()=>{
    if(product && product._id!== id){
        dispatch(getProductDetails(id));
    }
    else{
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setOldImages(product.images);
    }
    if(updateError){
        toast.error(updateError);
        dispatch(clearErrors());
    }
    if(error){
        toast.error(error);
        dispatch(clearErrors());
    }
    if(isUpdated){
        toast.success("Product updated Successfully");
        navigate("/admin/products");
        dispatch({type:UPDATE_PRODUCT_RESET})
    }
  },[dispatch,updateError,updateError,error,product,id,navigate])

  const updateProductSubmitHandler=(e)=>{
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("price",price);
    myForm.set("description",description);
    myForm.set("stock",stock);
    myForm.set("category",category)

    images.forEach((image)=>(
        myForm.append("images",image)
    ))

    dispatch(updateProduct({id,productData:myForm}));
  }

  const updateProductImagesChange=(e)=>{
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file)=>{
        const reader = new FileReader();

        reader.onload=()=>{
            if(reader.readyState===2){
                setImages((old)=>[...old,reader.result]);
                setImagesPreview((old)=>[...old,reader.result]);
            }
        }
        reader.readAsDataURL(file);
    })
  }
  return (
    <Fragment>
    <MetaData title="Update Product" />
    <div className="dashboard">
      <SideBar />
      <div className="newProductContainer">
        <form
          className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1>Update Product</h1>
            <div>
                <SpellcheckIcon/>
                <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
                <DescriptionIcon/>
                <textarea placeholder="Product Description"
                value={description}
                cols={30}
                rows={1}
                onChange={(e)=>{setDescription(e.target.value)}}></textarea>
            </div>
            <div>
            <AccountTreeIcon/>
                <select value={category} onChange={(e)=>{setCategory(e.target.value)}}>
                    <option value="">
                        Choose Category
                    </option>
                   { categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                   ))}
                </select>
            </div>
            <div>
            <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {oldImages && oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Product Preview" />
              ))}
            </div>

             <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
            id="createProductBtn"
            type="submit"
            disabled={loading? true: false}>
                Update
            </Button>
        </form>
      </div>
    </div>
  </Fragment>
  );
};

export default UpdateProduct;
