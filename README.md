# Booking System (Computer Science Coursework)

The booking system for the Computer Science IA(Coursework for IB Computer Science HL)

Hosted on: https://ideashubbookingsystem.herokuapp.com/

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/BookingSystem.png "Booking System")

This is a booking system meant for use by students at a school's **makerspace**, where rooms need to booked for use and bookings must be managed by an administrator.

# Technologies used:
- Front-end: **Pug(templating engine), Bootstrap, jQuery**
- Back-end: **Node.js, MongoDB**

# Important libraries:
- **Express** for Node.js - routing
- **Mongoose** to communicate with MongoDB, build data models
- **Passport.js** for Google authentication
- **Moment** for operations with time
- **Nodemailer** for sending mail automatically

# Features:
- Users can see and make bookings on a table schedule, along with an option for how much time before the booking they want to be reminded
- Users log in with their school Gmail accounts. Non-school Gmail accounts or non-admin accounts are denied access.
- Users receive automated reminder e-mails before their booking, and can cancel their bookings.
- The administrator can also cancel any bookings on the schedule, at which point an e-mail is sent to the user to notify them.
- Settings for each bookable space can be edited by the admin, and spaces can be added and deleted.
- The admin can also set how many weeks ahead the schedule should show.
- Other bookings can be imported by the admin through an Excel sheet upload.

# Screenshots:

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/AccountPage.png "Account Page")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/MakeBooking.png "Make Booking")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/YourBookings.png "Your Bookings")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/CancelBookingUser.png "Cancel Booking User")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/AdminPage.png "Admin Page")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/CancelBookingAdmin.png "Cancel Booking Admin")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/AdminSettings.png "Admin Settings")

![alt text](https://github.com/huzaifa1712/BookingSystemImplementation/blob/master/ProductScreenshots/EditSettings.png "Edit Settings")
