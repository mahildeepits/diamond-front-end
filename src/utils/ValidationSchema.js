import * as Yup from "yup";
export const loginSchema = Yup.object({
  // email: Yup.string().email().required("Please enter a valid email"),
  password: Yup.string().min(6).max(20).required("Please enter password"),
});
export const signUpSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email"),
  name: Yup.string().required("Please enter a name"),
  // mobile: Yup.number().required("Please enter a mobile number"),
  // gender: Yup.string().required("Please select a gender"),
  password: Yup.string().min(6).max(20).required("Please enter a password"),
  opted_for: Yup.string().required("Please select the option"),
});
export const userForm = (edit = false) => {
  const validationSchema = {
    email: Yup.string().email("Please enter a valid email"),
    name: Yup.string().required("Please enter a name"),
    mobile: Yup.number().required("Please enter a mobile number"),
    // gender: Yup.string().required("Please select a gender"),
    opted_for: Yup.string().required("Atleast one TDS/TCS should be selected"),
    client_id: Yup.number().max(9999999999, "Client ID should not be greater than 10 digits").min(100000, "Client ID should not be less than 6 digits").required("Client ID should not be empty"),
    limit: Yup.number().min(1).max(100000000).required("Limit should not be empty"),
    silver_limit: Yup.number().min(0).max(100000000),
    retail_gold_limit: Yup.number().min(0).max(100000000),
  };

  if(edit) validationSchema.password = Yup.string().min(6).max(20);
  else validationSchema.password = Yup.string().min(6).max(20).required("Please enter a password");

  return Yup.object(validationSchema);
}

export const subAdminSchema = Yup.object({
  email: Yup.string().email().required("Please enter a valid email"),
  name: Yup.string().required("Please enter a name"),
  mobile: Yup.number().required("Please enter a mobile number"),
  // gender: Yup.string().required("Please select a gender"),
  password: Yup.string().min(6).max(20).required("Please enter a password"),
});
export const bankDetailsSchema = Yup.object({
  bank_name: Yup.string().required("Bank Name is required"),
  account_number: Yup.number().required("Account Number is required"),
  ifsc_code: Yup.string().required("IFSC Code is required"),
  branch_name: Yup.string().required("Branch Name is required"),
  account_holder_name: Yup.string().required("Account Holder Name is required"),
});
export const bookingsUpdateSchema = Yup.object({
  rate: Yup.number()
    .required("Rate is required")
    .positive("Rate must be greater than zero"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be greater than zero"),
  total_amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
  seen: Yup.string().required("Seen status is required"),
  created_by: Yup.string().required("Created by is required"),
});
export const bookingsSchemaAdmin = Yup.object({
    client_id: Yup.string().required("Client is required"),
    rate: Yup.number().when('rateOption', {
      is: 'current',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Rate is required").positive("Rate must be greater than zero"),
    }),
    quantity: Yup.number()
      .when('byType', {
        is: 'quantity',
        then: (schema) => schema.required("Quantity is required").positive("Quantity must be greater than zero"),
        otherwise: (schema) => schema.notRequired(),
      }),
    total_amount: Yup.number()
      .when('byType', {
        is: 'amount',
        then: (schema) => schema.required("Total Amount is required").positive("Total Amount must be greater than zero"),
        otherwise: (schema) => schema.notRequired(),
      }),
    byType: Yup.string().oneOf(['quantity', 'amount']).required("byType is required"),
  });
  export const bookingsSchemaNonAdmin = Yup.object({
    // client_id: Yup.string().required("Client is required"),
    rate: Yup.number().required('Rate is required'),
    quantity: Yup.number()
      .when('byType', {
        is: 'quantity',
        then: (schema) => schema.required("Quantity is required").positive("Quantity must be greater than zero"),
        otherwise: (schema) => schema.notRequired(),
      }),
    total_amount: Yup.number()
      .when('byType', {
        is: 'total_amount',
        then: (schema) => schema.required("Total Amount is required").positive("Total Amount must be greater than zero"),
        otherwise: (schema) => schema.notRequired(),
      }),
    byType: Yup.string().oneOf(['quantity', 'total_amount']).required("byType is required"),
  });
