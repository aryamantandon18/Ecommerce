import React from 'react'
import {
    Button,
    Col,
    Form,
    FormFeedback,
    Input,
    InputGroup,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,import { useFormik } from "formik";
    import React, { useState } from "react";
    import toastr from "toastr";
    import { useRef } from "react";
    import * as Yup from "yup";
    import  {useEffect} from "react"
    import TopCrousel from "./TopCrousel";
    import pica from 'pica';
    import {
      Button,
      Col,
      Form,
      FormFeedback,
      Input,
      InputGroup,
      Label,
      Modal,
      ModalBody,
      ModalFooter,
      ModalHeader,
      Row,
      Dropdown,
      DropdownToggle,
      DropdownMenu,
      DropdownItem,
      Container,
      FormGroup
    } from "reactstrap";
    import { editBanner } from "api/backend/banner";
    import Switch from "react-switch";
    import { editflash } from "api/backend/flashCard";
    import ImageModal from "./Imagemodal";
    import ArchiveSidebar from "../ArchieveSidebar/ArchieveSidebar";
    import { archieve } from "api/backend/banner";
    const NewBannerModal = ({
        toggleEditModal,
      isOpen,
      rowdata,
      handleNewBannerAdded,
      handleNewFlashCardAdded,
      showBannersTable,
      flashCard,
      setFlashCard,
      handleOpenSidebar,
      toggleChangeOrderModal,
      images2,
      sidebarOpen,
      handleCloseSidebar
      
    
    }) => {
        useEffect(() => {
            if (rowdata) {
              validation.setValues({
                bannerName: rowdata.bannerName || "",
                slug: rowdata.slug || "",
                images: rowdata.images || [],
                
                // Add other fields if necessary
              });
              setActive(rowdata.status)
            }
          }, [rowdata]);
      // const [flashCard, setFlashCard] = useState(!showBannersTable);
      const hiddenInputFileUploaderRef = useRef();
      const [active,setActive]=useState(rowdata?.status);
      const [isVisible, setIsVisible] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const toggleVisibility = () => setIsVisible(!isVisible);
      const [currentHrefLink, setCurrentHrefLink] = useState('');
      const[imagemodal,setImagemodal]=useState(false);
      const [archievedimages,setAImages]=useState([]);
      const [images,setimages]=useState(null);
      const [modal, setModal] = useState(false);
      const[frontendModal,SetFrontendModal]=useState(false);
    
      const toggleModal = () => SetFrontendModal(!frontendModal);
      const [selectedImageIndex, setSelectedImageIndex] = useState(null);
      const handleImageClick =(index)=>{
        setSelectedImageIndex(index);
        setModal(true);
      }
      console.log("rowdata",rowdata)
      const hiddenInputFileUploaderRefFlash = useRef();
        console.log("EDITMODALPAGE",isOpen);
      const validation = useFormik({
        enableReinitialize: true,
        initialValues:{
            bannerName: rowdata?.bannerName || "",
            type: rowdata?.type || "",
            images: rowdata?.images || [],
            href:currentHrefLink,
        },
        validationSchema: Yup.object({
          bannerName: Yup.string().min(1).required("Banner Name is required"),
          type: Yup.string().min(1).required("Banner type is required"),
          images: Yup.array()
            .min(1)
            .max(3)
            .required("Banner images cant be less than 1 and more than 3"),
        }),
        onSubmit: async values => {
          console.log(values);
          createNewBanner(values);
        },
      });
      const validationflush = useFormik({
        enableReinitialize: true,
        initialValues: {
          flashName: rowdata?.flashName||"",
          flashslug: rowdata?.flashslug|"",
          images: rowdata?.images||[],
        },
        validationSchema: Yup.object({
          flashName: Yup.string().min(1).required("flash card Name is required"),
          flashslug: Yup.string().min(1).required(" Name is required"),
          images: Yup.array()
            .min(1)
            .max(3)
            .required("flush card images cant be less than 1 and more than 3"),
        }),
        onSubmit: async values => {
          alert(values);
          console.log("values");
          createNewFlashCard(values);
        },
      });
      
      const clickHiddenInput = () => {
        hiddenInputFileUploaderRef.current.click();
      };
      const clickHiddenInputFlash = () => {
        hiddenInputFileUploaderRefFlash.current.click();
      };
      const nextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex === rowdata.images.length - 1 ? 0 : prevIndex + 1));
      };
    
      const previousImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? rowdata.images.length - 1 : prevIndex - 1));
      };
      const handleCustomImageUpload = async (e) => {
    
        if (e.target.files && e.target.files[0]) {
          let imgObj = e.target.files[0];
      
         
          let reader = new FileReader();
      
          reader.readAsDataURL(imgObj);
      
          reader.onload = async (e) => {
            let imageUrl = e.target?.result;
           
            if (typeof imageUrl === 'string') {
              let img = new Image();
              img.src = imageUrl;
      
              img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 480;
                const picaInstance = pica();
      
                try {
                  const resizedCanvas = await picaInstance.resize(img, canvas);
                  const resizedBlob = await picaInstance.toBlob(resizedCanvas, 'image/jpeg', 0.90);
      
                  const reader = new FileReader();
                  reader.readAsDataURL(resizedBlob);
      
                  reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                      let oldImagesInState = validation.values.images;
                      let imgObjForState = {
                        src: reader.result,
                      };
      
                      let newImagesArray = [...oldImagesInState, imgObjForState];
                      console.log("NEWIMAGESARRAY",newImagesArray);
                      validation.setFieldValue('images', newImagesArray);
                    }
                  };
                  reader.onerror = () => alert('Failed to read resized image!');
                } catch (error) {
                  alert('Failed to resize image!');
                }
              };
            }
          };
          reader.onerror = () => alert('Failed to read file!');
        }
      };
      const handleCustomImageUploadFlash = e => {
        if (e.target.files && e.target.files[0]) {
          let imgObj = e.target.files[0];
          // initiate reader and convert blob to base64.
          let reader = new FileReader();
          reader.readAsDataURL(imgObj);
    
          reader.onload = e => {
            let imageUrl = e.target?.result;
    
            let oldImagesInState = validationflush.values.images;
            let imgObjForState = {
              src: imageUrl,
            };
    
            let newImagesArray = [...oldImagesInState, imgObjForState];
            validationflush.setFieldValue("images", newImagesArray);
          };
        }
      };
      const toggle = () => setModal(!modal);
      const handleRemoveImage = src => {
        let oldImages = validation.values.images;
        let filteredImages = _.filter(oldImages, function (img) {
          return img.src !== src;
        });
    
        validation.setFieldValue("images", filteredImages);
      };
      const handleRemoveImageFlash = src => {
        let oldImages = validation.values.images;
        let filteredImages = _.filter(oldImages, function (img) {
          return img.src !== src;
        });
    
        validationflush.setFieldValue("images", filteredImages);
      };
      const createNewBanner = async values => {
        const updatedValues = {
            ...values,
            _id: rowdata._id,
            status:active
          };
          console.log("updated data",updatedValues);
        const response = await editBanner(updatedValues);
    
        if (response.status === 200) {
          toastr.success("Banner  updated  successfully.");
          // handleNewBannerAdded(response.data);
          validation.resetForm();
          toggleEditModal();
        } else if (response.status === 399) {
          validation.setErrors({
            code: "Banner slug already taken",
          });
          toastr.error("Banner slug already taken");
        } else {
          toastr.error(response.data);
        }
      };
      const createNewFlashCard = async values => {
        const updatedvalues={
          ...values,
          _id: rowdata._id
        }
        const response = await editflash(updatedvalues);
    
        if (response.status === 200) {
          toastr.success("Flash Card  updated successfully.");
         
          validationflush.resetForm();
          toggleEditModal();
        } else if (response.status === 399) {
          validationflush.setErrors({
            code: "FlashCard slug already taken",
          });
          toastr.error("FlashCard slug already taken");
        } else {
          toastr.error(response.data);
        }
      };
    
      console.log("ROW DATA",rowdata);
      return (
        <Container fluid className="p-0">
          { isOpen &&
            <div >
            <Col
             xl="12"
            >
              <div className="">
               <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
               <ModalHeader>{rowdata?.bannerName}</ModalHeader>
               <Button onClick={toggleModal} > Preview</Button>
                <div style={{display:"flex", flexDirection:"column",marginTop:"10px"}}>
                <p className="me-2">Do you want to active</p>
                      <Switch
                        id="flashbanner"
                        height={20}
                        handleDiameter={22}
                        onColor={"#34c38f"}
                        offColor={"#f46a6a"}
                        checked={active}
                        onChange={() => setActive(prev=>!prev)}
                      />
                </div>
               </div>
                { flashCard == false && (
                  <>
                    <ModalBody>
                     
                      <div  style={{display:"flex", alignItems:"center", gap:"10px"}}>
                      {
                         rowdata.images.map((img,index)=>(
                            <div key={index} style={{cursor:"pointer"}}  onClick={() => handleImageClick(index)}>
                              <img src={img.src} height="50px" width="50px"></img>
                            </div>
                         ))
    
                      }
                       <Modal isOpen={modal} toggle={toggle} size="xl" centered={true}>
                        <ModalHeader toggle={toggle}>Image Details</ModalHeader>
                        <ModalBody>
                          {selectedImageIndex !== null &&  (
                            <>
                              <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                              <img src={rowdata.images[selectedImageIndex].src} alt={`Image ${selectedImageIndex}`} width={rowdata.images[selectedImageIndex].width} 
                              height={rowdata.images[selectedImageIndex].height}/>
                              <div>
                                  <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr>
                                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Height</th>
                                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Width</th>
                                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Link</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rowdata.images[selectedImageIndex].height}</td>
                                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rowdata.images[selectedImageIndex].width}</td>
                                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rowdata.images[selectedImageIndex].href} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                              <Button color="primary" onClick={previousImage}>Previous</Button>
                              <Button color="primary" onClick={nextImage}>Next</Button>
                              </div>
    
                            </>
                          )}
                        </ModalBody>
                      </Modal>
                      </div>
                      
                      <div>
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <Row>
                            <Col xs={12} md={6}>
                              <div>
                                <Label>Banner Name</Label>
                                <Input
                                  name="bannerName"
                                  placeholder="Banner Name"
                                  value={validation.values.bannerName || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.bannerName &&
                                    validation.errors.bannerName
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.bannerName &&
                                validation.errors.bannerName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.bannerName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col>
                              <div>
                                <Label>Banner Type</Label>
                                <div>
                                  
                                </div>
                                <Input
                                  name="type"
                                  placeholder="Banner type"
                                  value={validation.values.type || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.type && validation.errors.type
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.bannerName &&
                                validation.errors.bannerName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.type}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                          <Row className="p-2 py-4 d-flex justify-content-center">
                          <Col xl="12">
                      <div onClick={toggleVisibility} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Upload and change the image</span>
                          <Button color="primary" onClick={toggleVisibility} size="sm">
                              {isVisible ? 'Hide' : 'Show'}
                          </Button>
                      </div>
                      
                      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"10px"}}>
                        <span>Change image Ordering style</span>
                      <Button
    
                      size="sm"
                      className="me-0 mb-1 mb-md-1"
                      color="primary"
                      onClick={() => toggleChangeOrderModal(rowdata)}
                    >
                     Change Order
                     </Button>
                     
                      </div>
                      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"10px"}}>
                        <span>Upload image from Archieve </span>
                      <Button
    
                      size="sm"
                      className="me-0 mb-1 mb-md-1"
                      color="primary"
                      onClick={handleOpenSidebar}
                    >
                      Archieve section
                     </Button>
                     
                      </div>
                  </Col>
      
                  {isVisible && (
                      <Col xs={12} md={6}>
                          <div>
                              <Label>Image</Label>
                              <p className="font-size-10">
                                  You need to upload at least one image and at max
                                  three images:
                              </p>
                              <InputGroup>
                                  <input
                                      ref={hiddenInputFileUploaderRef}
                                      id="hidden-input-upload"
                                      accept="image/*"
                                      className="d-none"
                                      name="images"
                                      type="file"
                                      onChange={handleCustomImageUpload}
                                      onClick={e => (e.target.value = "")}
                                  />
      
                                  <Button
                                      color="primary"
                                      className="d-flex align-items-center"
                                      onClick={clickHiddenInput}
                                  >
                                      <i className="bx bxs-camera-plus me-1 font-size-18"></i>
                                      Upload Image
                                  </Button>
                              </InputGroup>
                          </div>
                      </Col>
                         )}
                 
                          </Row>
                          { isVisible &&
                            <Row>
                            {validation &&
                              validation.values.images.length &&
                              validation.values.images.map((imgObj, idx) => {
                                return (
                                  <Col key={idx}>
                                    <div className="d-flex flex-column align-items-center my-4">
                                      <div
                                        style={{
                                          // width: 300,
                                          height: 420,
                                          backgroundColor: "white",
                                          display: "flex",
                                          borderRadius: 4,
                                          overflow: "hidden",
                                          position: "relative",
                                        }}
                                      >
                                        <img src={imgObj.src} />
      
                                        <div
                                          style={{
                                            position: "absolute",
                                            width: "20%",
                                            height: "20%",
                                            top: "20%",
                                            left: "20%",
                                            border: "2px solid #00ADB5",
                                          }}
                                        />
      
                                        <div
                                          role={"button"}
                                          onClick={() =>
                                            handleRemoveImage(imgObj.src)
                                          }
                                          className="bg-danger d-flex align-items-center justify-content-center"
                                          style={{
                                            position: "absolute",
                                            right: 2,
                                            top: 2,
                                            borderRadius: 20,
                                            width: 22,
                                            height: 22,
                                          }}
                                        >
                                          <span className="font-size-20 text-white">
                                            x
                                          </span>
                                        </div>
                                      </div>
                                      <FormGroup>
                                        <Label for={`hreflink-${idx}`}>Href Link for Image {idx + 1}</Label>
                                        <Input
                                          type="text"
                                          name="href"
                                          id={`hreflink-${idx}`}
                                          value={imgObj.href}
                                         onChange={(e)=>setCurrentHrefLink(e.target.value)}
                                        />
                                      </FormGroup>
                                    </div>
                                  </Col>
                                );
                              })}
                          </Row>
                          }
                        </Form>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <div className="d-flex w-100 justify-content-between">
                        <Button type="button" color="danger" onClick={toggleEditModal}>
                          Close
                        </Button>
      
                        <Button
                          type="button"
                          color="primary"
                          onClick={validation.handleSubmit}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )}
                {/* {flashCard == true && (
                  <>
                    <ModalBody>
                      <p className="me-2">Add Flash</p>
                      <Switch
                        id="flashbanner"
                        height={20}
                        handleDiameter={22}
                        onColor={"#34c38f"}
                        offColor={"#f46a6a"}
                        checked={flashCard}
                        onChange={(checked, e, id) => setFlashCard(checked)}
                      />
                      <div>
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            validationflush.handleSubmit();
                            return false;
                          }}
                        >
                          <Row>
                            <Col xs={12} md={6}>
                              <div>
                                <Label>Flash Card Name</Label>
                                <Input
                                  name="flashName"
                                  placeholder="flash card Name"
                                  value={validationflush.values.flashName || ""}
                                  onChange={validationflush.handleChange}
                                  onBlur={validationflush.handleBlur}
                                  invalid={
                                    validationflush.touched.flashName &&
                                    validationflush.errors.flashName
                                      ? true
                                      : false
                                  }
                                />
                                {validationflush.touched.flashName &&
                                validationflush.errors.flashName ? (
                                  <FormFeedback type="invalid">
                                    {validationflush.errors.flashName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col>
                              <div>
                                <Label>Flash Card Slug</Label>
                                <Input
                                  name="flashslug"
                                  placeholder="Flash Card Slug"
                                  value={validationflush.values.flashslug || ""}
                                  onChange={validationflush.handleChange}
                                  onBlur={validationflush.handleBlur}
                                  invalid={
                                    validationflush.touched.flashslug &&
                                    validationflush.errors.flashslug
                                      ? true
                                      : false
                                  }
                                />
                                {validationflush.touched.flashslug &&
                                validationflush.errors.flashslug ? (
                                  <FormFeedback type="invalid">
                                    {validationflush.errors.flashslug}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
      
                          <Row className="p-2 py-4 d-flex justify-content-center">
                            <Col xs={12} md={6}>
                              <div>
                                <Label>Image</Label>
                                <p className="font-size-10">
                                  You need to upload at least one image and at max
                                  three images:
                                </p>
                                <InputGroup>
                                  <input
                                    ref={hiddenInputFileUploaderRefFlash}
                                    id="hidden-input-upload"
                                    accept="image/*"
                                    className="d-none"
                                    name="images"
                                    type="file"
                                    onChange={handleCustomImageUploadFlash}
                                    onClick={e => (e.target.value = "")}
                                  />
      
                                  <Button
                                    color="primary"
                                    className="d-flex align-items-center"
                                    onClick={() => {
                                      clickHiddenInputFlash();
                                    }}
                                  >
                                    <i className="bx bxs-camera-plus me-1 font-size-18"></i>
                                    Upload Image
                                  </Button>
                                </InputGroup>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            {validationflush &&
                              validationflush.values.images.length &&
                              validationflush.values.images.map((imgObj, idx) => {
                                return (
                                  <Col key={idx}>
                                    <div className="d-flex flex-column align-items-center my-4">
                                      <div
                                        style={{
                                          // width: 300,
                                          height: 420,
                                          backgroundColor: "white",
                                          display: "flex",
                                          borderRadius: 4,
                                          overflow: "hidden",
                                          position: "relative",
                                        }}
                                      >
                                        <img src={imgObj.src} />
      
                                        <div
                                          style={{
                                            position: "absolute",
                                            width: "20%",
                                            height: "20%",
                                            top: "20%",
                                            left: "20%",
                                            border: "2px solid #556ee6",
                                          }}
                                        />
      
                                        <div
                                          role={"button"}
                                          onClick={() =>
                                            handleRemoveImageFlash(imgObj.src)
                                          }
                                          className="bg-danger d-flex align-items-center justify-content-center"
                                          style={{
                                            position: "absolute",
                                            right: 2,
                                            top: 2,
                                            borderRadius: 20,
                                            width: 22,
                                            height: 22,
                                          }}
                                        >
                                          <span className="font-size-20 text-white">
                                            x
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                );
                              })}
                          </Row>
                        </Form>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <div className="d-flex w-100 justify-content-between">
                        <Button type="button" color="danger" onClick={toggleEditModal}>
                          Close
                        </Button>
      
                        <Button
                          type="button"
                          color="primary"
                          // onClick={validationflush.handleSubmit}
                          onClick={() => {
                            createNewFlashCard(validationflush.values);
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )} */}
                <ArchiveSidebar
                open={sidebarOpen}
                onClose={handleCloseSidebar}
                archivedImages={images2}
                validation={validation}
                />
                <TopCrousel
                  toggle={toggleModal}
                  isOpen={frontendModal}
                />
              
              </div>
             
            </Col>
            </div>
      
          }
         
        </Container>
      );
    };
    
    export default NewBannerModal;
    
    DropdownItem,
    Container,
    FormGroup
  } from "reactstrap";

const EditSampleModal = ({
    toggleEditModal,
    isOpen,
    rowdata
}) => {
  return (
    <Container fluid className="p-0">
    { isOpen &&
      <div >
      <Col xl="12">
        <div className=''>
        <div className='justify-between'>
        <ModalHeader>{rowdata?.Title}</ModalHeader>
        <Button > Preview</Button>
        </div>
        </div>
      </Col>
      </div>
    }
    </Container>
  )
}

export default EditSampleModal