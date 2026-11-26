const form = document.getElementById("bookingForm");

const bookingList =
    document.getElementById("bookingList");

const message =
    document.getElementById("message");


let bookings =
    JSON.parse(
        localStorage.getItem("hostelBookings")
    ) || [];


// ===============================
// SET MINIMUM DATE
// ===============================

const dateInput =
    document.getElementById("date");

const today =
    new Date().toISOString().split("T")[0];

dateInput.min = today;


// ===============================
// SELECT ROOM FROM ROOM CARD
// ===============================

function selectRoom(roomName) {

    document.getElementById("room").value =
        roomName;

    document.getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// BOOKING FORM
// ===============================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const studentName =
        document.getElementById("studentName")
            .value.trim();

    const studentId =
        document.getElementById("studentId")
            .value.trim();

    const room =
        document.getElementById("room")
            .value;

    const date =
        document.getElementById("date")
            .value;

    const startTime =
        document.getElementById("startTime")
            .value;

    const endTime =
        document.getElementById("endTime")
            .value;

    const purpose =
        document.getElementById("purpose")
            .value.trim();


    // Check time

    if (startTime >= endTime) {

        showMessage(
            "End time must be after start time.",
            "error"
        );

        return;
    }


    // Check overlapping booking

    const conflict =
        bookings.some(function(booking) {

            return (

                booking.room === room &&

                booking.date === date &&

                startTime < booking.endTime &&

                endTime > booking.startTime

            );

        });


    if (conflict) {

        showMessage(
            "This room is already booked during this time.",
            "error"
        );

        return;
    }


    // Create booking

    const booking = {

        id: Date.now(),

        studentName,

        studentId,

        room,

        date,

        startTime,

        endTime,

        purpose

    };


    bookings.push(booking);


    localStorage.setItem(
        "hostelBookings",
        JSON.stringify(bookings)
    );


    showMessage(
        "✓ Booking confirmed successfully!",
        "success"
    );


    form.reset();


    dateInput.min = today;


    displayBookings();

});


// ===============================
// MESSAGE
// ===============================

function showMessage(text, type) {

    message.textContent = text;

    if (type === "success") {

        message.style.color = "#16a34a";

    } else {

        message.style.color = "#dc2626";

    }

}


// ===============================
// DISPLAY BOOKINGS
// ===============================

function displayBookings() {

    bookingList.innerHTML = "";


    if (bookings.length === 0) {

        bookingList.innerHTML = `

            <div class="empty-bookings">

                <i class="fa-regular fa-calendar-xmark"></i>

                <h3>No bookings yet</h3>

                <p>
                    Your confirmed room bookings
                    will appear here.
                </p>

            </div>

        `;

        return;
    }


    bookings.forEach(function(booking) {

        const item =
            document.createElement("div");

        item.className =
            "booking-item";


        item.innerHTML = `

            <h3>
                <i class="fa-solid fa-door-open"></i>
                ${booking.room}
            </h3>

            <p>
                <strong>Student:</strong>
                ${booking.studentName}
            </p>

            <p>
                <strong>Student ID:</strong>
                ${booking.studentId}
            </p>

            <p>
                <strong>Date:</strong>
                ${booking.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${booking.startTime}
                -
                ${booking.endTime}
            </p>

            <p>
                <strong>Purpose:</strong>
                ${booking.purpose}
            </p>

            <button
                class="cancel-btn"
                onclick="cancelBooking(${booking.id})">

                <i class="fa-solid fa-trash"></i>
                Cancel Booking

            </button>

        `;


        bookingList.appendChild(item);

    });

}


// ===============================
// CANCEL BOOKING
// ===============================

function cancelBooking(id) {

    const confirmation =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmation) {
        return;
    }


    bookings =
        bookings.filter(function(booking) {

            return booking.id !== id;

        });


    localStorage.setItem(
        "hostelBookings",
        JSON.stringify(bookings)
    );


    displayBookings();

}