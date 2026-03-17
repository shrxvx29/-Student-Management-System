// Inputs
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("rollNumber");
const deptInput = document.getElementById("department");

const addBtn = document.getElementById("addbtn");
const tableBody = document.querySelector("#studentTable tbody");
const searchInput = document.getElementById("searchInput");

// Array to store students
let students = [];


// Load data from localStorage when page loads
window.onload = function () {

    const storedStudents = localStorage.getItem("students");

    if (storedStudents) {
        students = JSON.parse(storedStudents);
        displayStudents();
    }

};


// Add student
addBtn.addEventListener("click", function (e) {

    e.preventDefault();

    const name = nameInput.value.trim().toUpperCase();
    const roll = rollInput.value.trim().toUpperCase();
    const dept = deptInput.value.trim().toUpperCase();

    if (name === "" || roll === "" || dept === "") {
        alert("Please fill all fields");
        return;
    }
    if (checkDuplicateRoll(roll)) {
        alert("A student with this roll number already exists.");
        return;
    }


    // Create student object
    const student = {
        name: name,
        roll: roll,
        dept: dept
    };

    // Push into array
    students.push(student);

    // Save array to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    // Update table
    displayStudents();

    // Clear inputs
    nameInput.value = "";
    rollInput.value = "";
    deptInput.value = "";
    searchInput.value = "";

    // Show success message
    var successMsg = document.getElementById("successmsg");
    successMsg.style.display = "block";
    setTimeout(function () {
        successMsg.style.display = "none";
    }, 1000);


});


// Display students in table
function displayStudents(filteredStudents = null) {

    tableBody.innerHTML = "";
    
    const listToDisplay = filteredStudents || students;

    listToDisplay.forEach(function (student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.dept}</td>
            <td>
                <button class="deleteBtn" data-roll="${student.roll}"><i class="bx bx-trash"></i></button>
                <button class="editBtn" data-roll="${student.roll}"><i class="bx bx-edit"></i></button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}


// Search students
searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toUpperCase();
    const filtered = students.filter(student => 
        student.name.toUpperCase().startsWith(searchTerm)
    );
    displayStudents(filtered);
});


// Delete student
tableBody.addEventListener("click", function (e) {
    const deletebtn=e.target.closest(".deleteBtn");
    if (deletebtn) {
        const roll = deletebtn.dataset.roll;
        const index = students.findIndex(s => s.roll === roll);
        if (index !== -1) {
            students.splice(index, 1);
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            // Clear search after delete to show updated list
            searchInput.value = "";
        }
    }

});

// Edit students
tableBody.addEventListener("click", function (e) {
    const editbtn=e.target.closest(".editBtn"); 

    if (editbtn) {
        const roll = editbtn.dataset.roll;
        const index = students.findIndex(s => s.roll === roll);

        if (index !== -1) {
            const student = students[index];    
            nameInput.value = student.name;
            rollInput.value = student.roll;
            deptInput.value = student.dept;
            
            // Remove from array so it can be "re-added" or updated
            students.splice(index, 1);
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            // Clear search to show the form values clearly
            searchInput.value = "";
        }
    }
}
)

// same value errors
function checkDuplicateRoll(roll) {
    return students.some(student => student.roll === roll);
}

// Enter key function
function handlekeypress(e){
    if(e.key === "Enter"){
        addBtn.click();
    }
}