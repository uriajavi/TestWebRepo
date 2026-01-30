/* 
 * @todo Convert function to Class Customer
 * @todo Add toJSON method in order for Customer to be formatted as server side expects when stringifying 
 */
function Customer(  id, 
                    firstName, 
                    lastName, 
                    middleInitial, 
                    street, 
                    city, 
                    state,
                    zip,
                    phone,
                    email,
                    password) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleInitial = middleInitial;
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.phone = phone;
    this.email = email;
    this.password = password;
}
