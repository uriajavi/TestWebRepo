/*
 * Attributes to be used by this controller.
 * Elements to be managed by the controller.
 */

const signInForm=document.getElementById("signInForm");
const tfEmail=document.getElementById("tfEmail");
const tfPassword=document.getElementById("tfPassword");
const btSignIn=document.getElementById("btSignIn");
const responseMsg=document.getElementById("responseMsg");

const customers=new Set();

/*
 * Event handlers association.
 */
signInForm.addEventListener("submit",handleFormSubmit);
tfEmail.addEventListener("blur",handleEmailBlur);
tfPassword.addEventListener("blur",handlePasswordBlur);
btSignIn.addEventListener("click",handleSignInOnClick);


/*
 * EVENT HANDLERS
 */
 /**
 * Validate form data and call another function to send data
 * and process response
 * @param {type} event
 * @returns {undefined}
 */
 function handleSignInOnClick (event){
    try{
                    //Get references to form fields
                    const tfEmail=document.getElementById("tfEmail");
                    const tfPassword=document.getElementById("tfPassword");
                    const signInForm=document.getElementById("signInForm");
                    //Create a RegExp object to validate email
                    const emailRegExp=
                        new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
                    //Stop event propagation and default navigator actions 
                    event.preventDefault();
                    event.stopPropagation();
                    //Validate email and password filling
                    if(tfEmail.value.trim()===""||tfPassword.value.trim()==="")
                    throw new Error("Email and password must be filled.");
                    //Validate email and password length
                    if(tfEmail.value.length>255)
                    throw new Error("Email cannot have more than 255 characters.");
                    if (tfPassword.value.length>255)
                    throw new Error("Password cannot have more than 255 characters.");
                    //Email validation using regular expression
                    if(!emailRegExp.exec(tfEmail.value.trim()))
                    throw new Error("Email has not a valid format.");
                    //Call to function for sending data and process response
                    sendRequestAndProcessResponse();
    }catch(error){
                    //Show error messages in red styled div
                    const msgBox = document.getElementById("responseMsg");
                    msgBox.className = 'error';
                    msgBox.textContent = 'Error: ' + error.message;
                    msgBox.style.display = 'block';
    }
}
/*
 * UTILITY FUNCTIONS
 */
/**
 * 
 * @returns {undefined}
 */
function sendRequestAndProcessResponse (){
                //get form and message div references
                const signInForm=document.getElementById("signInForm");
                const msgBox = document.getElementById("responseMsg");
                //get field´s values
                const valueTfEmail=tfEmail.value.trim();
                const valueTfPassword=tfPassword.value.trim();
                //Send Request using fetch API (window.fetch method)
                fetch(signInForm.action +
                      `${encodeURIComponent(valueTfEmail)}/${encodeURIComponent(valueTfPassword)}`, 
                    {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/xml'
                        }
                    }).then(response => {
                        //Process HTTP 401 error
                        if (response.status===401){
                          return response.text().then(text => {
                            throw new Error('Wrong credentials!!');
                          });
                        }
                        //Process HTTP 500 error
                        else if (response.status===500){
                          return response.text().then(text => {
                            throw new Error('Server Error. Please try later!!');
                          });
                        }
                        //Process any other error
                        else if (!response.ok) {
                          return response.text().then(text => {
                            throw new Error(text || 'Unexpected error!!');
                          });
                        }
                        return response.text();
                    })
                    //Process OK response 
                    .then(data => {
                        msgBox.className = 'success';
                        msgBox.textContent = 'Customer signed in successfully!';
                        msgBox.style.display = 'block';
                        //Store response data into Customer object and in session storage 
                        storeResponseXMLData(data);
                        //get customer object from storage
                        const customerName=sessionStorage.getItem("customer.firstName");
                        //create XML from customer's data stored
                        const customerXML=`<customer>
                                <city>${sessionStorage.getItem("customer.city")}</city>
                                <email>${sessionStorage.getItem("customer.email")}</email>
                                <firstName>${sessionStorage.getItem("customer.firstName")}</firstName>
                                <id>${sessionStorage.getItem("customer.id")}</id>
                                <lastName>${sessionStorage.getItem("customer.lastName")}</lastName>
                                <middleInitial>${sessionStorage.getItem("customer.middleInitial")}</middleInitial>
                                <password>${sessionStorage.getItem("customer.password")}</password>
                                <phone>${sessionStorage.getItem("customer.phone")}</phone>
                                <state>${sessionStorage.getItem("customer.state")}</state>
                                <street>${sessionStorage.getItem("customer.street")}</street>
                                <zip>${sessionStorage.getItem("customer.zip")}</zip>
                            </customer>`.trim();
                        msgBox.textContent = msgBox.textContent+'Hi '+customerName+'!';
                    })
                    //Process errors
                    .catch(error => {
                            msgBox.className = 'error';
                            msgBox.textContent = 'Error: ' + error.message;
                            msgBox.style.display = 'block';
                    }
                );        
}
/**
* Read XML response data and store it in session client storage. 
* @param {type} xmlString Response text 
* @returns {undefined}
*/
function storeResponseXMLData (xmlString){
                //Create XML parser
                const parser = new DOMParser();
                //Parse response XML data
                const xmlDoc=parser.parseFromString(xmlString,"application/xml");
                //Create Customer object with data received in response
                
                //
                while(i<lenght.Array){
                    const customer=new Customer(
                        xmlDoc.getElementsByTagName("id")[i].textContent,
                        xmlDoc.getElementsByTagName("firstName")[0].textContent,
                        xmlDoc.getElementsByTagName("lastName")[0].textContent,
                        xmlDoc.getElementsByTagName("middleInitial")[0].textContent,
                        xmlDoc.getElementsByTagName("street")[0].textContent,
                        xmlDoc.getElementsByTagName("city")[0].textContent,
                        xmlDoc.getElementsByTagName("state")[0].textContent,
                        xmlDoc.getElementsByTagName("zip")[0].textContent,
                        xmlDoc.getElementsByTagName("phone")[0].textContent,
                        xmlDoc.getElementsByTagName("email")[0].textContent,
                        xmlDoc.getElementsByTagName("password")[0].textContent,
                    );
                    customers.add(customer);
                }
                const customer=new Customer(
                    xmlDoc.getElementsByTagName("id")[0].textContent,
                    xmlDoc.getElementsByTagName("firstName")[0].textContent,
                    xmlDoc.getElementsByTagName("lastName")[0].textContent,
                    xmlDoc.getElementsByTagName("middleInitial")[0].textContent,
                    xmlDoc.getElementsByTagName("street")[0].textContent,
                    xmlDoc.getElementsByTagName("city")[0].textContent,
                    xmlDoc.getElementsByTagName("state")[0].textContent,
                    xmlDoc.getElementsByTagName("zip")[0].textContent,
                    xmlDoc.getElementsByTagName("phone")[0].textContent,
                    xmlDoc.getElementsByTagName("email")[0].textContent,
                    xmlDoc.getElementsByTagName("password")[0].textContent,
                );
                // Save data to sessionStorage
                sessionStorage.setItem("customer.id", customer.id);
                sessionStorage.setItem("customer.firstName", customer.firstName);
                sessionStorage.setItem("customer.lastName", customer.lastName);
                sessionStorage.setItem("customer.middleInitial", customer.middleInitial);
                sessionStorage.setItem("customer.street", customer.street);
                sessionStorage.setItem("customer.city", customer.city);
                sessionStorage.setItem("customer.state", customer.state);
                sessionStorage.setItem("customer.zip", customer.zip);
                sessionStorage.setItem("customer.phone", customer.phone);
                sessionStorage.setItem("customer.email", customer.email);
                sessionStorage.setItem("customer.password", customer.password);
                console.log("Customer's data for "+customer.id+" saved on session storage.");
}



class MyClass {
  somethingCool = 5;
  get somethingCool() {
    return this.somethingCool; 
  }

  set somethingCool(value) {
    this.somethingCool = value; 
  }
}

const x = new MyClass();
JSON.stringify(x); // '{}'

x.somethingCool = 10;
JSON.stringify(x); // '{}'





















