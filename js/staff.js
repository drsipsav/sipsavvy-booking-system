import { db } from "./core/firebase-init.js";

const staffTableBody = document.getElementById("staffTableBody");
const staffModal = document.getElementById("staffModal");
const closeStaffModal = document.getElementById("closeStaffModal");
const addStaffBtn = document.getElementById("addStaffBtn");
const saveStaffBtn = document.getElementById("saveStaffBtn");

let editingId = null;

function openModal() {
  staffModal.style.display = "flex";
}

function closeModal() {
  staffModal.style.display = "none";
  editingId = null;
}

addStaffBtn.addEventListener("click", () => {
  editingId = null;
  openModal();
});

closeStaffModal.addEventListener("click", closeModal);

async function loadStaff() {
  const snap = await db.collection("staff").get();
  staffTableBody.innerHTML = "";

  snap.forEach(doc => {
    const s = doc.data();
    staffTableBody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.role}</td>
        <td>${s.active ? "Active" : "Inactive"}</td>
        <td>${s.lastActivity || "—"}</td>
        <td>
          <button class="staff-action-btn" onclick="editStaff('${doc.id}')">Edit</button>
        </td>
      </tr>
    `;
  });
}

window.editStaff = async (id) => {
  editingId = id;
  const docRef = await db.collection("staff").doc(id).get();
  const s = docRef.data();

  document.getElementById("staffName").value = s.name;
  document.getElementById("staffEmail").value = s.email;
  document.getElementById("staffRole").value = s.role;

  openModal();
};

saveStaffBtn.addEventListener("click", async () => {
  const name = document.getElementById("staffName").value;
  const email = document.getElementById("staffEmail").value;
  const role = document.getElementById("staffRole").value;

  if (editingId) {
    await db.collection("staff").doc(editingId).update({
      name, email, role
    });
  } else {
    await db.collection("staff").add({
      name,
      email,
      role,
      active: true,
      lastActivity: "Created"
    });
  }

  closeModal();
  loadStaff();
});

loadStaff();
