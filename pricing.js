import React, { useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Input,
  Form,
  FormFeedback,
  Label,
  Button,
  Badge,
  InputGroup,
  InputGroupText,
  DropdownToggle,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  Collapse,
} from "reactstrap";
import Switch from "react-switch";

const shadow = {
  width: "100%",
  padding: "10px",
  boxShadow: "2px 2px 5px 0px rgba(255,255,255,0.8)",
  transition: "box-shadow 0.3s ease",
  borderRadius: "5px"
};

const Pricing = ({
  validation,
  handleRemoveAdditonalCost,
  setLocationMenuOpen,
  additionalCostsInputCurrent,
  handleAdditionalCostsInputChange,
  setDecorationMenuOpen,
  tieredpricingCat,
  setTieredpricingCat,
  handleAddTier,
  removeTieredPricing,
  handleAddPartialPayment,
  handleRemovePartialPayment,
  handlePartialPaymentChange,
  handleTogglePartialPayment
}) => {

  const [pricingCollapse, setPricingCollapse] = useState(false)
  const [tieredPricingCollapse, setTieredPricingCollapse] = useState(false)

  return (
    <div>
      <Row className="mx-auto" style={shadow} onMouseEnter={() => setPricingCollapse(true)} onMouseLeave={()=> setPricingCollapse(false)}>
        <Row> 
          <h5 className="form-label me-2">Pricing</h5>

        <Collapse 
        isOpen={pricingCollapse}
        >
        <Row>

          
          <Col xs={12} md={6}>
            <div className="mb-3">
              <Label className="form-label me-2">Unit Price</Label>

              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  name="unitPrice"
                  className="form-control"
                  type="number"
                  value={validation.values.unitPrice || "0"}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.unitPrice && validation.errors.unitPrice
                      ? true
                      : false
                  }
                ></Input>
                {validation.touched.unitPrice && validation.errors.unitPrice ? (
                  <FormFeedback type="invalid">
                    {validation.errors.unitPrice}
                  </FormFeedback>
                ) : null}
              </InputGroup>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="mb-3">
              <Label className="form-label me-2">Discount</Label>

              <InputGroup>
                <Input
                  name="discount[amount]"
                  className="form-control"
                  type="number"
                  placeholder="Discount Amount"
                  value={validation.values.discount.amount || "0"}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                ></Input>

                <InputGroupText className="d-flex">
                  <span className="me-2">Is Percent</span>

                  <Input
                    name="discount[isPercent]"
                    type="checkbox"
                    className="form-control"
                    checked={validation.values.discount.isPercent}
                    onChange={e => {
                      validation.setFieldValue(
                        "discount.isPercent",
                        e.target.checked
                      );
                    }}
                  />
                </InputGroupText>
              </InputGroup>
            </div>
          </Col>

          <div className="d-flex justify-content-center my-2">
            <span className="font-size-16 me-2">
              Final Unit Price Will Be:{" "}
            </span>

            {(validation.values.discount.amount &&
              validation.values.discount.isPercent && (
                <span className="font-size-16 fw-bold text-white">
                  ${" "}
                  {validation.values.unitPrice -
                    (validation.values.unitPrice *
                      validation.values.discount.amount) /
                      100}
                </span>
              )) ||
              (validation.values.discount.amount &&
                !validation.values.discount.isPercent && (
                  <span className="font-size-16 fw-bold text-white">
                    ${" "}
                    {validation.values.unitPrice -
                      validation.values.discount.amount}
                  </span>
                )) || (
                <span className="font-size-16 fw-bold text-white">
                  {" "}
                  $ {validation.values.unitPrice}
                </span>
              )}
          </div>
        </Row>
        </Collapse>


        </Row>

        {!!additionalCostsInputCurrent && (
          <Row>
            <Col xs={12} md={12}>
              <div className="mb-3">
                <Label className="form-label me-2">Additional Costs</Label>

                <div className="mb-2">
                  {validation &&
                    validation.values.additionalCosts.map(
                      (additionalCostObj, idx) => (
                        <Badge
                          role={"button"}
                          key={
                            additionalCostObj.location +
                            "-" +
                            additionalCostObj.decoration +
                            idx
                          }
                          className="mx-1 mt-1 font-size-12 badge-soft-success"
                          onClick={() =>
                            handleRemoveAdditonalCost(additionalCostObj)
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {additionalCostObj.location +
                              "-" +
                              additionalCostObj.decoration +
                              ": +$" +
                              additionalCostObj.cost}

                            <i className="bx bx-x font-size-16"></i>
                          </div>
                        </Badge>
                      )
                    )}
                </div>

                <InputGroup>
                  <ButtonDropdown
                    isOpen={locationMenuOpen}
                    toggle={() => setLocationMenuOpen(v => !v)}
                  >
                    <DropdownToggle
                      color="primary"
                      className="d-flex align-items-center"
                    >
                      {additionalCostsInputCurrent.location}
                      <i className="bx bx-caret-down ms-2"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      {validation.values.printingAreas.map(printingAreaObj => (
                        <DropdownItem
                          key={printingAreaObj.location}
                          onClick={() => {
                            handleAdditionalCostsInputChange(
                              "location",
                              printingAreaObj.location
                            );
                          }}
                        >
                          {printingAreaObj.location}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>

                  <ButtonDropdown
                    isOpen={decorationMenuOpen}
                    toggle={() => setDecorationMenuOpen(v => !v)}
                  >
                    <DropdownToggle
                      color="primary rounded-0"
                      className="d-flex align-items-center"
                    >
                      {additionalCostsInputCurrent.decoration}
                      <i className="bx bx-caret-down ms-2"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      {validation.values.decorations.map(decoration => (
                        <DropdownItem
                          key={decoration}
                          onClick={() => {
                            handleAdditionalCostsInputChange(
                              "decoration",
                              decoration
                            );
                          }}
                        >
                          {decoration}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>

                  <Input
                    name="additionalCosts"
                    className="form-control"
                    type="number"
                    placeholder="Cost"
                    value={additionalCostsInputCurrent.cost}
                    onChange={e => {
                      handleAdditionalCostsInputChange("cost", e.target.value);
                    }}
                    onBlur={e => {
                      handleAdditionalCostsInputChange("cost", e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleAddNewAdditionalCost();
                      }
                    }}
                  ></Input>

                  <Button color="primary" onClick={handleAddNewAdditionalCost}>
                    Add
                  </Button>
                </InputGroup>
              </div>
            </Col>
          </Row>
        )}
      </Row>

      <Row className="mx-auto mt-4" style={shadow} onMouseEnter={()=> setTieredPricingCollapse(true)} onMouseLeave={()=> setTieredPricingCollapse(false)}>
        <h5 className="form-label me-2">Tiered Pricing</h5>

        <Collapse isOpen={tieredPricingCollapse}>
        <Row>
        {tieredpricingCat?.map((values, index) => (
          <>
            {/* <Label className="form-label me-2">{values.min}</Label> */}

            <Col xs={12} md={2}>
              <Label className="form-label"> Min</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].min`}
                    className="form-control"
                    type="number"
                    placeholder="Min"
                    value={values.min || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].min = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <Label className="form-label">Max</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].max`}
                    className="form-control"
                    type="number"
                    placeholder="Max"
                    value={values.max || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].max = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <Label className="form-label"> Price</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].price`}
                    className="form-control"
                    type="number"
                    placeholder="price"
                    value={values.price || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].price = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={1}>
              <Label className="form-label">Discount</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].discount`}
                    className="form-control"
                    type="number"
                    placeholder="discount"
                    value={values.discount || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].discount = e.target.value;
                      if (updatedTiers[index].isPercent) {
                        updatedTiers[index].finalprice =
                          updatedTiers[index].price -
                          (updatedTiers[index].price *
                            updatedTiers[index].discount) /
                            100;
                      } else {
                        updatedTiers[index].finalprice =
                          updatedTiers[index].price -
                          updatedTiers[index].discount;
                      }
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={1}>
              <Label className="form-label">finalprice</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].finalprice`}
                    className="form-control"
                    type="number"
                    placeholder="finalprice"
                    value={values.finalprice || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].finalprice = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <label className="" style={{height: "14px"}}></label>
              <div className="mb-2">
                

                <InputGroupText className="d-flex">
                  <span className="me-2">Is Percent</span>

                  <Input
                    name={`values[${index}].isPercent`}
                    type="checkbox"
                    className="form-control"
                    checked={values.isPercent}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].isPercent = e.target.checked;
                      setTieredpricingCat(updatedTiers);
                    }}
                  />
                </InputGroupText>
              
              </div>
            </Col>
            <Col xs={12} md={2}>
                <label></label>
                <label className="" style={{height: "14px"}}></label>
                <div className="mb-3">

                <Button
                  size="sm"
                  // className="me-0 mb-md-1"s
                  style={{height: "100%", padding: "8px"}}
                  color="danger"
                  onClick={() => {
                    removeTieredPricing(index);
                  }}
                >
                  Delete
                </Button>
                </div>
            </Col>

            {/* <Col xs={12} md={3}>
          <div className="mb-3">
            <Button
              size="sm"
              className="me-0 mb-1 mb-md-1"
              color="danger"
              onClick={removeTieredPricing(index)}
            >
              Delete
            </Button>
          </div>
        </Col> */}
          </>
        ))}
        <Row>

        <Button color='primary' style={{width: "100px", height: "40px", marginLeft: "10px"}} onClick={handleAddTier}>Add Tier</Button>

        </Row>

        </Row>
        </Collapse>
        {/* <Label className="form-label me-2">Min</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][min]"
            className="form-control"
            type="number"
            placeholder="Min"
            value={validation.values.tieredPricing[0].min || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              console.log(e.target.value);
              // validation.setFieldValue(
              //   "tieredPricing[0].min",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup>
        <Label className="form-label me-2">Max</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][max]"
            className="form-control"
            type="number"
            placeholder="Max"
            value={validation.values.tieredPricing[0].max || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              // validation.setFieldValue(
              //   "tieredPricing[0].max",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup>
        <Label className="form-label me-2">Price</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][price]"
            className="form-control"
            type="number"
            placeholder="price"
            value={validation.values.tieredPricing[0].price || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              // validation.setFieldValue(
              //   "tieredPricing[0].price",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup> */}
      </Row>
      <Row className="mx-auto mt-4" style={shadow}>
        <Row>
          <Col>
          <div className="mb-3 d-flex w-100">
          <Label className="form-label me-2">Partial Payment Available</Label>
          <InputGroup>
            <Switch
              onChange={()=>{handleTogglePartialPayment(); validation.values.partialPayments.length===0 && handleAddPartialPayment()}}
              checked={validation.values.isPartialPaymentAvailable}
            />
          </InputGroup>
        </div>
          </Col>
        </Row>

        {validation.values.isPartialPaymentAvailable && (
          <div>
            <Label className="form-label me-2">Partial Payment Options</Label>
            <div className="mb-3">
            <Row className="border-bottom border-dark ">
            <Col xs={6} className="fw-bold text-center ps-2">Payment Percentage</Col>
            <Col xs={6} className="fw-bold text-center pe-2">Discount Percentage</Col>
          </Row>
              {validation.values.partialPayments.map((payment, index) => (
                <InputGroup key={index} className='mt-2'>
                  <Input
                    type="number"
                    className='me-2'
                    placeholder="Payment Percentage"
                    value={payment.paymentPercentage}
                    onChange={e => handlePartialPaymentChange(index, 'paymentPercentage', e.target.value)}
                  />
                  <Input
                    type="number"
                    className='ms-2'
                    placeholder="Discount Percentage"
                    value={payment.discountPercentage}
                    onChange={e => handlePartialPaymentChange(index, 'discountPercentage', e.target.value)}
                  />
                  <Button color="danger" onClick={() => handleRemovePartialPayment(index)}>
                    Remove
                  </Button>
                </InputGroup>
              ))}
              <Button color="primary" className='mt-2 w-100 ' onClick={handleAddPartialPayment}>
                Add Partial Payment
              </Button>
            </div>
          </div>
        )}
  
      </Row>
    </div>
  );
};

export default Pricing;
