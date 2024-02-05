/* eslint-disable prettier/prettier */
export const ValidationCodes = {
  authDTO: {
    emailIsRequired: 'Email_Is_Required',
    emailLength: 'Email_Length',
    passwordIsRequired: 'Password_Is_Required',
    passwordLength: 'Password_Length'
  },
  customerDTO: {
    customerNameIsRequired: 'Customer_Name_Is_Required',
    customerNameLength: 'Customer_Name_Length',
    contactNumberIsRequired: 'Customer_Contact_Number_Is_Required',
    contactMaxLength: 'Customer_Contact_Max_Length_13',
    cityIsRequired: 'Customer_City_Name_Is_Required',
    addressIsRequired: 'Customer_Adress_Is_Required',
    addressMaxLength: 'Customer_Address_Max_Length_300',
    ageShouldNumber: 'Age_Should_Number',
  },

  general: {
    somethingWentWrong: 'Something_Went_Wrong'
  }
};
